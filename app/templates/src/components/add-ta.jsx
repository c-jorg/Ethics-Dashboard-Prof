import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';

const backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const AddTA = () => {
  const navigate = useNavigate();
  const [taData, setTaData] = useState({
    name: '',
    email: '',
    assignedClass: '',
    permissions: {
      canGrade: false,
      canProvideFeedback: false,
      canEditCourse: false,
      canViewStudents: false
    }
  });

  const exampleClasses = ['BUAD123', 'BUAD345', 'PHIL111'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setTaData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [name]: checked
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('TA Data to be submitted:', taData);
    alert('Teacher Assistant added successfully!');
    navigate('/prof-profile');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Add New Teacher Assistant" />

      <div className="container mx-auto p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          {/* TA Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">TA Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={taData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter TA's full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={taData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter TA's email"
                />
              </div>
            </div>
          </div>

          {/* Class Assignment */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Assign to Class</h2>
            <div className="space-y-3">
              {exampleClasses.map((className) => (
                <div key={className} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                  <input
                    type="radio"
                    id={className}
                    name="assignedClass"
                    value={className}
                    checked={taData.assignedClass === className}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <label htmlFor={className} className="ml-3 block text-sm font-medium text-gray-700">
                    {className}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Permissions</h2>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="canGrade"
                  name="canGrade"
                  checked={taData.permissions.canGrade}
                  onChange={handlePermissionChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="canGrade" className="ml-3 text-sm font-medium text-gray-700">Grading</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="canProvideFeedback"
                  name="canProvideFeedback"
                  checked={taData.permissions.canProvideFeedback}
                  onChange={handlePermissionChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="canProvideFeedback" className="ml-3 text-sm font-medium text-gray-700">Feedback</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="canEditCourse"
                  name="canEditCourse"
                  checked={taData.permissions.canEditCourse}
                  onChange={handlePermissionChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="canEditCourse" className="ml-3 text-sm font-medium text-gray-700">Edit Class</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="canViewStudents"
                  name="canViewStudents"
                  checked={taData.permissions.canViewStudents}
                  onChange={handlePermissionChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="canViewStudents" className="ml-3 text-sm font-medium text-gray-700">View Students</label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add TA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTA;