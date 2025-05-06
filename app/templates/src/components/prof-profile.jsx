import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Header from './header'; // Import the Header component

const ProfProfile = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Example professor data
  const professor = {
    fullName: 'Dr. John Doe',
    email: 'john.doe@university.edu',
    department: 'Computer Science',
  };

  // Example list of teacher assistants
  const teacherAssistants = [
    { id: 1, name: 'Alice Smith', email: 'alice.smith@university.edu' },
    { id: 2, name: 'Bob Johnson', email: 'bob.johnson@university.edu' },
    { id: 3, name: 'Charlie Brown', email: 'charlie.brown@university.edu' },
  ];

  // Function to handle adding a new teacher assistant
  const handleAddTeacherAssistant = () => {
    navigate('/add-ta'); // Navigate to the add TA page
  };

  // Function to handle TA click
  const handleTAClick = (taId) => {
    navigate(`/ta-profile/${taId}`); // Navigate to TA profile with the TA's ID
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header title="Professor Profile" />

      {/* Professor Information */}
      <div className="container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Professor Information</h2>
          <div className="space-y-2">
            <p><strong>Full Name:</strong> {professor.fullName}</p>
            <p><strong>Email:</strong> {professor.email}</p>
            <p><strong>Department:</strong> {professor.department}</p>
          </div>
        </div>

        {/* Teacher Assistants */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-semibold mb-4">Teacher Assistants</h2>
          {/* Add New Teacher Assistant Button */}
          <button
            onClick={handleAddTeacherAssistant}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mb-4"
          >
            Add New Teacher Assistant
          </button>
          {/* List of Teacher Assistants */}
          <ul className="space-y-2">
            {teacherAssistants.map((ta) => (
              <li 
                key={ta.id} 
                className="border-b pb-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => handleTAClick(ta.id)} // Make the whole list item clickable
              >
                <p><strong>Name:</strong> {ta.name}</p>
                <p><strong>Email:</strong> {ta.email}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfProfile;