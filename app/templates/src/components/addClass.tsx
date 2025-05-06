import React, { useState, useEffect } from 'react';
import { Menu, X, Upload, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom'; // Added import

const AddClass = () => {
  // State management
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    className: '',
    classId: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Added
  const [professorId, setProfessorId] = useState(null); // Added

  // Added useEffect to retrieve professorId
  useEffect(() => {
    const professorData = localStorage.getItem('professorData');
    if (professorData) {
      try {
        const parsedData = JSON.parse(professorData);
        setProfessorId(parsedData.id || parsedData.prof_id);
      } catch (error) {
        console.error('Error parsing professor data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  // File upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "text/csv") {
      setError('Please upload a valid CSV file');
      return;
    }

    Papa.parse(file, {
      complete: (results) => {
        const validStudents = results.data
          .filter(row => row.length === 3 && row.every(cell => cell.trim()))
          .map(row => ({
            name: row[0].trim(),
            id: row[1].trim(),
            email: row[2].trim()
          }));

        if (validStudents.length === 0) {
          setError('No valid student data found in CSV. Format should be: Name,ID,Email');
          return;
        }

        setStudents(validStudents);
        setError('');
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
      },
      skipEmptyLines: true,
      header: false
    });
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.className || !formData.classId) {
      setError('Please fill out both class name and class ID');
      return;
    }

    if (students.length === 0) {
      setError('Please upload a CSV file with student data');
      return;
    }

    if (!professorId) { // Added check
      setError('Professor ID not found. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://213.255.209.162:5000/api/add-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          class_name: formData.className,
          class_id: formData.classId,
          professor_id: professorId, // Added
          students: students
        })
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = '/prof-dashboard';
      } else {
        setError(data.message || 'Failed to add class');
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-blue-500 h-20 flex items-center justify-between px-6 z-50">
        <button
          onClick={() => setIsSideNavOpen(!isSideNavOpen)}
          className="text-white hover:bg-blue-400 p-2 rounded transition-colors"
        >
          {isSideNavOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="font-lusitana text-white text-xl">Add New Class</span>
        <div className="w-10" />
      </nav>

      {/* Side Navigation */}
      <div
        className={`fixed top-0 left-0 h-full bg-blue-500 transition-all duration-300 ${
          isSideNavOpen ? 'w-64' : 'w-0'
        } overflow-hidden z-40 pt-16`}
      >
        <div className="flex flex-col text-white">
          <div className="px-4 py-2 bg-blue-600 font-medium text-sm">Navigation</div>
          <a
            href="/prof-dashboard"
            className="px-6 py-3 text-white hover:bg-blue-400 transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>

      {/* Main Content */}
      <main className={`pt-24 px-6 transition-all duration-300 ${isSideNavOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Error Display */}
            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* File Upload */}
            <div className="mb-8">
              <label className="block mb-2 font-lusitana font-medium text-lg">Upload Student List (CSV)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-blue-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-blue-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">CSV file with Name, ID, Email columns</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            {/* Students Table */}
            {students.length > 0 && (
              <div className="mb-8 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Class Information Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-lusitana font-medium text-lg">Class Name</label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter class name"
                />
              </div>

              <div>
                <label className="block mb-2 font-lusitana font-medium text-lg">Class ID</label>
                <input
                  type="text"
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter class ID"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg text-white font-medium ${
                  isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-400 transition-colors'
                }`}
              >
                {isSubmitting ? 'Creating Class...' : 'Create Class'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddClass;
