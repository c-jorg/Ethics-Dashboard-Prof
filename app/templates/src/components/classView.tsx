import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, BookOpen, Edit, Eye, Check, ChevronUp, ChevronDown as ChevronDownIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { BarChart, PieChart, LineChart, DoughnutChart } from './ChartComponents'; // Use your chart components
import Header from './header'; // Import the Header component
import axios from 'axios';

const backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// Define types for better type safety
type Case = {
  id: number;
  title: string;
  description: string;
  genericQuestions: string[];
  specificQuestions: string[];
};

type Student = {
  id: number;
  name: string;
  email: string;
  submissions: {
    caseId: number;
    submitted: boolean;
    mark: number;
    feedback: string;
    status: string;
    published: boolean;
  }[];
};

type ClassData = {
  name: string;
  title: string;
  classAverage: number;
  commentBank: string[];
  cases: Case[];
  students: Student[];
};

const ClassView = () => {
  const navigate = useNavigate();
  const { classId } = useParams(); // Get the class ID from URL parameters
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [activeCase, setActiveCase] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [commentBankOpen, setCommentBankOpen] = useState(false);
  const [customComment, setCustomComment] = useState('');
  const [assignedCases, setAssignedCases] = useState<number[]>([]);
  const [isClassListExpanded, setIsClassListExpanded] = useState(false);

   const [classData, setClassData] = useState<ClassData>({
    name: "",
    title: "",
    classAverage: 0,
    commentBank: [],
    cases: [],
    students: []
  });

   const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  // Fetch class data on component mount
  useEffect(() => {
    const fetchClassData = async () => {
      if (!classId) {
        setError("No class ID provided");
        setLoading(false);
        return;
      }

      try {
        // Get class details
        const classResponse = await axios.get(`${backendApiUrl}/api/class/${classId}`);

        // Once we have class details, we can use them to set up our state
        setClassData({
          name: classResponse.data.class_name,
          title: classResponse.data.class_name, // You might want to split this differently
          classAverage: 78.5, // Placeholder until you implement grade calculation
          commentBank: [
            "Excellent analysis of ethical principles",
            "Consider exploring stakeholder impacts more deeply",
            "Good use of ethical frameworks",
            "Needs more specific examples",
            "Strong critical thinking displayed"
          ],
          cases: [], // You'll need to fetch these separately
          students: [] // You'll need to fetch these separately
        });

        // You can also fetch cases and students here if you have endpoints for them

        try {
        const enrollmentsResponse = await axios.get(`${backendApiUrl}/api/class/${classId}/students`);
        console.log("Enrolled students:", enrollmentsResponse.data);

        // Update the students state with the fetched students
        setStudents(enrollmentsResponse.data);

        // Also update the classData.students property
        setClassData(prevData => ({
          ...prevData,
          students: enrollmentsResponse.data
        }));

        setLoading(false);
      } catch (enrollErr) {
        console.error("Error fetching enrolled students:", enrollErr);
        setError("Failed to load student data");
        setLoading(false);
      }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching class data:", err);
        setError("Failed to load class data");
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  // Sort students by first name (A-Z)
  const sortedStudents = classData.students.sort((a, b) =>
    a.name.split(' ')[0].localeCompare(b.name.split(' ')[0])
  );

  const SideNavLink = ({ href = "#", onClick = () => {}, children }) => (
    <div
      onClick={onClick}
      className="px-8 py-4 text-white hover:bg-blue-400 block transition-colors cursor-pointer text-lg"
    >
      {children}
    </div>
  );

  const SideNavSection = ({ title, children }) => (
    <div className="mb-6">
      <div className="px-6 py-3 bg-blue-600 text-white font-medium text-lg">
        {title}
      </div>
      {children}
    </div>
  );

  const SideNav = () => (
    <div className={`fixed top-0 left-0 h-full bg-blue-500 transition-all duration-300 ${isSideNavOpen ? 'w-64' : 'w-0'} overflow-hidden z-50`}>
      <div className="pt-20 flex flex-col">
        <SideNavSection title="Navigation">
          <SideNavLink onClick={() => navigate('/prof-dashboard')}>Dashboard</SideNavLink>
          <SideNavLink onClick={() => navigate('/add-class')}>Add Class</SideNavLink>
          <SideNavLink onClick={() => navigate('/faq')}>FAQ</SideNavLink>
        </SideNavSection>

        <SideNavSection title="Start Here - Choose A Case">
          <SideNavLink href="#">Describe The Dilemma</SideNavLink>
        </SideNavSection>

        <SideNavSection title="Consequences">
          <SideNavLink href="#">Stakeholders</SideNavLink>
        </SideNavSection>

        <SideNavSection title="Action and Duty">
          <SideNavLink href="#">Role</SideNavLink>
          <SideNavLink href="#">Past Actions</SideNavLink>
          <SideNavLink href="#">Reason</SideNavLink>
        </SideNavSection>

        <SideNavSection title="Relations">
          <SideNavLink href="#">Care Ethics</SideNavLink>
          <SideNavLink href="#">Intersectionality</SideNavLink>
          <SideNavLink href="#">Seven Generations</SideNavLink>
        </SideNavSection>
      </div>
    </div>
  );

  const CaseCard = ({ caseData }: { caseData: Case }) => {
    const isAssigned = assignedCases.includes(caseData.id);

    const handleAssign = () => {
      if (isAssigned) {
        setAssignedCases(assignedCases.filter((id) => id !== caseData.id));
      } else {
        setAssignedCases([...assignedCases, caseData.id]);
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setActiveCase(activeCase === caseData.id ? null : caseData.id)}
        >
          <h3 className="font-lusitana text-2xl font-bold text-gray-800">{caseData.title}</h3>
          <ChevronDown
            className={`transform transition-transform w-8 h-8 ${activeCase === caseData.id ? 'rotate-180' : ''}`}
          />
        </div>

        {activeCase === caseData.id && (
          <div className="mt-6">
            <p className="text-gray-600 mb-6 text-lg">{caseData.description}</p>

            <div className="mb-6">
              <h4 className="font-lusitana text-xl font-bold text-gray-700 mb-4">Generic Questions:</h4>
              <ul className="list-disc pl-8 space-y-4">
                {caseData.genericQuestions.map((q, i) => (
                  <li key={i} className="text-gray-600 text-lg">{q}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-lusitana text-xl font-bold text-gray-700 mb-4">Case-Specific Questions:</h4>
              <ul className="list-disc pl-8 space-y-4">
                {caseData.specificQuestions.map((q, i) => (
                  <li key={i} className="text-gray-600 text-lg">{q}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleAssign}
              className={`mt-6 px-6 py-2 rounded-lg flex items-center gap-2 ${
                isAssigned
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isAssigned ? <Check size={20} /> : null}
              {isAssigned ? 'Assigned' : 'Assign to Class'}
            </button>
          </div>
        )}
      </div>
    );
  };

  const StudentStatistics = () => {
    const [stats, setStats] = useState({
      averageGrade: 78.5,
      submissionRate: 85,
      participationRate: 90,
      topPerformer: "Emma Davis"
    });

    return (
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="font-lusitana text-3xl font-bold text-gray-800 mb-6">Student Statistics</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Average Grade</h3>
            <BarChart data={stats.averageGrade} />
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Submission Rate</h3>
            <PieChart data={stats.submissionRate} />
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Participation Rate</h3>
            <LineChart data={stats.participationRate} />
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Top Performer</h3>
            <DoughnutChart data={80} /> {/* Example data */}
          </div>
        </div>
      </div>
    );
  };

  const ClassList = () => {
    const sortedStudents = students.sort((a, b) =>
    a.name.split(' ')[0].localeCompare(b.name.split(' ')[0])
    );
    return (
      <div className="bg-white rounded-lg shadow-md p-8 mb-8 ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-lusitana text-3xl font-bold text-gray-800">Class List</h2>
          <button
            onClick={() => setIsClassListExpanded(!isClassListExpanded)}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            {isClassListExpanded ? (
              <>
                <ChevronUp size={20} />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <ChevronDownIcon size={20} />
                <span>Expand</span>
              </>
            )}
          </button>
        </div>
        {isClassListExpanded && (
          <div className="space-y-4">
            {students.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No students enrolled in this class yet.</p>
          ) : (
            sortedStudents.map(student => (
              <div
                key={student.id}
                onClick={() => navigate(`/student/${student.id}`)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="text-lg font-medium">{student.name}</div>
                <div className="text-gray-600">{student.email}</div>
              </div>
            ))
          )}
          </div>
        )}
      </div>
    );
  };

  return (
  <main className="flex min-h-screen flex-col p-0">
    {/* Display loading state if data is still loading */}
    {loading ? (
      <div className="flex flex-row justify-between items-start w-full max-w-7xl gap-10">
        <p className="text-xl">Loading class data...</p>
      </div>
    ) : error ? (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    ) : (
      <>
        {/* Use the Header component with actual class data */}
        <Header title={`${classData.name}`} />
        <SideNav />

        <div className={`mt-24 max-w-7xl mx-auto w-full transition-all duration-300 ${isSideNavOpen ? 'ml-64' : 'ml-0'}`}>
          <StudentStatistics />
          <ClassList />

          {/* Cases Section */}
          <div className="mb-8">
            <h2 className="font-lusitana text-3xl font-bold text-gray-800 mb-6">Cases</h2>
            {classData.cases.map(caseItem => (
              <CaseCard key={caseItem.id} caseData={caseItem} />
            ))}
          </div>
        </div>
      </>
    )}
  </main>
);
};

export default ClassView;