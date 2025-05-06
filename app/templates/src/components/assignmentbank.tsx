import React, { useState } from 'react';
import { LogOut, Home } from 'lucide-react'; // Import icons
import { useNavigate } from 'react-router-dom';
import Header from './header'; // Import the Header component

const AssignmentBank = () => {
  const navigate = useNavigate();

  // State for the assignment name
  const [assignmentName, setAssignmentName] = useState<string>('');

  // State for the list of questions (mock data for demonstration)
  const [questions, setQuestions] = useState<string[]>([
    'What is React?',
    'Explain the virtual DOM.',
    'What are hooks in React?',
    'How does useState work?',
  ]);

  // State for selected questions
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  // State for created assignments
  const [assignments, setAssignments] = useState<{ name: string; questions: string[] }[]>([]);

  // State for drag-and-drop functionality
  const [draggedQuestion, setDraggedQuestion] = useState<string | null>(null);

  // Handle assignment name input change
  const handleAssignmentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignmentName(e.target.value);
  };

  // Handle question selection
  const handleQuestionSelect = (question: string) => {
    if (selectedQuestions.includes(question)) {
      // If the question is already selected, remove it
      setSelectedQuestions(selectedQuestions.filter((q) => q !== question));
    } else {
      // If the question is not selected, add it
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  // Handle drag start
  const handleDragStart = (question: string) => {
    setDraggedQuestion(question);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault(); // Prevent default to allow drop
  };

  // Handle drop
  const handleDrop = (index: number) => {
    if (draggedQuestion === null) return;

    const newSelectedQuestions = [...selectedQuestions];
    const draggedIndex = newSelectedQuestions.indexOf(draggedQuestion);

    // Remove the dragged question from its current position
    newSelectedQuestions.splice(draggedIndex, 1);

    // Insert the dragged question at the new position
    newSelectedQuestions.splice(index, 0, draggedQuestion);

    setSelectedQuestions(newSelectedQuestions);
    setDraggedQuestion(null);
  };

  // Handle assignment creation
  const handleCreateAssignment = () => {
    if (assignmentName.trim() && selectedQuestions.length > 0) {
      // Create a new assignment
      const newAssignment = {
        name: assignmentName,
        questions: selectedQuestions,
      };

      // Add the new assignment to the list
      setAssignments([...assignments, newAssignment]);

      // Reset the form
      setAssignmentName('');
      setSelectedQuestions([]);
    } else {
      alert('Please enter an assignment name and select at least one question.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    navigate('/logout'); // Navigates to the logout page
  };

  // Handle home navigation
  const handleHome = () => {
    navigate('/prof-dashboard'); // Navigates to the Professor Dashboard
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
      {/* Header */}
      <Header title="Assignment Bank" />

      {/* Assignment Name Input */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Create Assignment</h2>
        <input
          type="text"
          value={assignmentName}
          onChange={handleAssignmentNameChange}
          placeholder="Enter assignment name..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* List of Questions */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Question Bank</h3>
        <ul className="space-y-3">
          {questions.map((question, index) => (
            <li key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <span>{question}</span>
              <button
                onClick={() => handleQuestionSelect(question)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedQuestions.includes(question)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {selectedQuestions.includes(question) ? 'Remove' : 'Add'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Selected Questions with Drag-and-Drop */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Selected Questions</h3>
        <ul className="space-y-3">
          {selectedQuestions.map((question, index) => (
            <li
              key={index}
              draggable
              onDragStart={() => handleDragStart(question)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 cursor-move"
            >
              <span>{question}</span>
              <button
                onClick={() => handleQuestionSelect(question)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Create Assignment Button */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mb-6">
        <button
          onClick={handleCreateAssignment}
          className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Create Assignment
        </button>
      </div>

      {/* List of Created Assignments */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Created Assignments</h3>
        {assignments.length > 0 ? (
          <ul className="space-y-4">
            {assignments.map((assignment, index) => (
              <li key={index} className="p-4 border rounded-lg">
                <h4 className="text-lg font-semibold mb-2">{assignment.name}</h4>
                <ul className="space-y-2">
                  {assignment.questions.map((question, qIndex) => (
                    <li key={qIndex} className="text-gray-700">
                      {question}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No assignments created yet.</p>
        )}
      </div>
    </div>
  );
};

export default AssignmentBank;