import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './header';

const TAProfile = () => {
  const { taId } = useParams();
  const [permissions, setPermissions] = useState({
    grading: false,
    feedback: false,
    classEditing: false
  });

  // Mock data - in a real app, you'd fetch this based on taId
  const [taData, setTaData] = useState({
    id: taId,
    name: 'Alice Smith',
    email: 'alice.smith@university.edu',
    className: 'BUAD 123'
  });

  // Load permissions when component mounts (simulating API call)
  useEffect(() => {
    // In a real app, you would fetch current permissions from your backend
    const fetchPermissions = () => {
      // Mock API response
      setTimeout(() => {
        setPermissions({
          grading: true,    // Default to having grading permission
          feedback: false,
          classEditing: false
        });
      }, 300);
    };
    fetchPermissions();
  }, [taId]);

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissions(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSavePermissions = () => {
    // In a real app, you would save this to your backend
    console.log('Saving permissions:', permissions);
    alert(`Permissions updated for ${taData.name}:
    - Grading: ${permissions.grading ? 'Yes' : 'No'}
    - Feedback: ${permissions.feedback ? 'Yes' : 'No'}
    - Class Editing: ${permissions.classEditing ? 'Yes' : 'No'}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="TA Profile" />

      <div className="container mx-auto p-6">
        {/* TA Information */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">TA Information</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {taData.name}</p>
            <p><strong>Email:</strong> {taData.email}</p>
            <p><strong>Class:</strong> {taData.className}</p>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Permissions</h2>
          
          <div className="space-y-4">
            {/* Grading Permission */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="grading"
                  name="grading"
                  type="checkbox"
                  checked={permissions.grading}
                  onChange={handlePermissionChange}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="grading" className="font-medium text-gray-700">
                  Grading
                </label>
                <p className="text-gray-500">Can grade assignments and exams</p>
              </div>
            </div>

            {/* Feedback Permission */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="feedback"
                  name="feedback"
                  type="checkbox"
                  checked={permissions.feedback}
                  onChange={handlePermissionChange}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="feedback" className="font-medium text-gray-700">
                  Feedback
                </label>
                <p className="text-gray-500">Can provide student feedback and comments</p>
              </div>
            </div>

            {/* Class Editing Permission */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="classEditing"
                  name="classEditing"
                  type="checkbox"
                  checked={permissions.classEditing}
                  onChange={handlePermissionChange}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="classEditing" className="font-medium text-gray-700">
                  Class Editing
                </label>
                <p className="text-gray-500">Can modify course materials and settings</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSavePermissions}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default TAProfile;