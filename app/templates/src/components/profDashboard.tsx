import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Header from './header';
import LogoutModal from './LogoutModal';
import axios from 'axios';

const backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [sessionData, setSessionData] = useState({
    name: "",
    email: "",
    id: null
  });

  // Define some colors to cycle through for classes
  const classColors = [
    "bg-sky-200 hover:bg-sky-300",
    "bg-rose-200 hover:bg-rose-300",
    "bg-violet-200 hover:bg-violet-300",
    "bg-amber-200 hover:bg-amber-300",
    "bg-emerald-200 hover:bg-emerald-300",
    "bg-indigo-200 hover:bg-indigo-300"
  ];

  useEffect(() => {
    const professorData = localStorage.getItem('professorData');

    if (professorData) {
      try {
        const parsedData = JSON.parse(professorData);
        setSessionData({
          name: parsedData.name || "Professor",
          email: parsedData.email || "",
          id: parsedData.id || parsedData.prof_id // Handle both field names
        });

        // Fetch classes for this professor once we have their ID
        if (parsedData.id || parsedData.prof_id) {
          fetchProfessorClasses(parsedData.id || parsedData.prof_id);
        }
      } catch (error) {
        console.error("Error parsing professor data:", error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Function to fetch classes from the database
  const fetchProfessorClasses = async (profId) => {
    try {
      setLoading(true);

      const response = await axios.get(`${backendApiUrl}/api/classes/${profId}`);
      console.log("Classes fetched:", response.data);
      const classesWithColors = response.data.map((classItem, index) => ({
        ...classItem,
        color: classColors[index % classColors.length]
      }));
      setClasses(classesWithColors);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Failed to load classes");
      setLoading(false);
    }
  };

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem('professorData');
    console.log("Logging out...");
    navigate("/");
  };

  const ClassesList = () => {
    if (loading) {
      return <div className="text-center py-10">Loading classes...</div>;
    }

    if (error) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (classes.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-6">You don't have any classes yet.</p>
          <button
            onClick={() => navigate("/add-class")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-400 transition-colors"
          >
            Add Your First Class
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-6">
        {classes.map((classItem, index) => (
          <div
            key={index}
            onClick={() => navigate(`/class/${encodeURIComponent(classItem.class_id)}`)}
            className={`flex items-center justify-center h-48 rounded-lg ${classItem.color} transition-colors cursor-pointer`}
          >
            <span className="font-lusitana text-2xl font-bold text-gray-700">
              {classItem.class_name}
            </span>
          </div>
        ))}
        <div
          onClick={() => navigate("/add-class")}
          className="flex items-center justify-center h-48 rounded-lg border-3 border-dashed border-emerald-200 hover:bg-emerald-50 transition-colors cursor-pointer"
        >
          <span className="font-lusitana text-2xl font-bold text-emerald-500">
            Add New Class
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - pass the setIsLogoutModalOpen function to the Header component */}
      <Header title="Professor Dashboard" onLogout={() => setIsLogoutModalOpen(true)} />

      {/* Welcome Message */}
      <div className="pt-4 px-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          Welcome, {sessionData.name}
        </h2>
      </div>

      {/* Main Content */}
      <main className="px-6 pb-6">
        <div className="max-w-4xl mx-auto w-full">
          {/* Classes List */}
          <ClassesList />

          {/* Buttons Section */}
          <div className="flex justify-center gap-8 mt-12">
            <button
              onClick={() => navigate("/questionbank")}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-blue-400 transition-colors"
            >
              Question Bank
            </button>
            <button
              onClick={() => navigate("/assignmentbank")}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-blue-400 transition-colors"
            >
              Assignment Bank
            </button>
          </div>
        </div>
      </main>

      {/* Logout Modal - this should render on top of everything when isLogoutModalOpen is true */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default ProfessorDashboard;
