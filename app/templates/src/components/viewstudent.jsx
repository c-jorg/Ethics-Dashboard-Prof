// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
// import Header from './header'; // Import the Header component
//
// const ViewStudent = () => {
//     const { studentId } = useParams(); // Get the student ID from the URL
//     const navigate = useNavigate(); // Initialize useNavigate for navigation
//
//     // Mock data for the student
//     const student = {
//         id: studentId,
//         name: 'John Doe',
//         email: 'john.doe@myokanagan.bc.ca',
//         completedAssignments: [
//             { id: 1, title: 'Assignment 1: Introduction to React', dateCompleted: '2023-10-01' },
//             { id: 2, title: 'Assignment 2: State and Props', dateCompleted: '2023-10-10' },
//             { id: 3, title: 'Assignment 3: React Router', dateCompleted: '2023-10-20' },
//         ],
//     };
//
//     return (
//         <main className="flex min-h-screen flex-col p-0">
//             {/* Use the Header component */}
//             <Header title="Student Profile" />
//
//             {/* Back to Class View Link */}
//             <div className="mt-4 max-w-7xl mx-auto w-full">
//                 <button
//                     onClick={() => navigate(-1)} // Navigate back to the previous page (ClassView)
//                     className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
//                 >
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                     >
//                         <path
//                             fillRule="evenodd"
//                             d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
//                             clipRule="evenodd"
//                         />
//                     </svg>
//                     <span>Back to Class View</span>
//                 </button>
//             </div>
//
//             {/* Student Profile Section */}
//             <div className="mt-4 max-w-7xl mx-auto w-full">
//                 <div className="bg-white rounded-lg shadow-md p-8 mb-8">
//                     <h1 className="font-lusitana text-3xl font-bold text-gray-800 mb-6">Student Profile</h1>
//                     <div className="space-y-4">
//                         <p><strong>ID:</strong> {student.id}</p>
//                         <p><strong>Name:</strong> {student.name}</p>
//                         <p><strong>Email:</strong> {student.email}</p>
//                     </div>
//                 </div>
//
//                 {/* Completed Assignments Section */}
//                 <div className="bg-white rounded-lg shadow-md p-8">
//                     <h2 className="font-lusitana text-3xl font-bold text-gray-800 mb-6">Completed Assignments</h2>
//                     <ul className="space-y-4">
//                         {student.completedAssignments.map((assignment) => (
//                             <li key={assignment.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
//                                 <div className="text-lg font-medium">{assignment.title}</div>
//                                 <div className="text-gray-600">Completed on: {assignment.dateCompleted}</div>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </main>
//     );
// };
//
// export default ViewStudent;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './header';

const ViewStudent = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            if (!studentId) {
                setError("No student ID provided");
                setLoading(false);
                return;
            }

            try {
                // Fetch student details
                const studentResponse = await axios.get(`${backendApiUrl}/api/students/${studentId}`);
                setStudent(studentResponse.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching student data:", err);
                setError("Failed to load student data");
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [studentId]);

    if (loading) {
        return (
            <main className="flex min-h-screen flex-col p-0">
                <Header title="Student Profile" />
                <div className="mt-8 max-w-7xl mx-auto w-full text-center">
                    <p>Loading student data...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen flex-col p-0">
                <Header title="Student Profile" />
                <div className="mt-8 max-w-7xl mx-auto w-full text-center">
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 text-blue-500 hover:text-blue-600"
                    >
                        Go Back
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col p-0">
            <Header title="Student Profile" />

            {/* Back to Class View Link */}
            <div className="mt-4 max-w-7xl mx-auto w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>Back to Class View</span>
                </button>
            </div>

            {/* Student Profile Section */}
            <div className="mt-4 max-w-7xl mx-auto w-full">
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h1 className="font-lusitana text-3xl font-bold text-gray-800 mb-6">Student Profile</h1>
                    <div className="space-y-4">
                        <p><strong>ID:</strong> {student.id}</p>
                        <p><strong>Name:</strong> {student.name}</p>
                        <p><strong>Email:</strong> {student.email}</p>
                    </div>
                </div>

                {/* Placeholder for future assignment section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="font-lusitana text-3xl font-bold text-gray-800 mb-6">Completed Assignments</h2>
                    <p className="text-gray-500">Assignment information will be displayed here in the future.</p>
                </div>
            </div>
        </main>
    );
};

export default ViewStudent;