import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header'; // Import the reusable Header component

const backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

type QuestionType = 'written' | 'slider';

interface Question {
  text: string;
  type: QuestionType;
}

const QuestionBank = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>('written');

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, { text: newQuestion, type: newQuestionType }]);
      setNewQuestion("");
      setNewQuestionType('written'); // Reset to default type
    }
  };

  const editQuestion = (index: number) => {
    const updatedQuestionText = prompt("Edit your question:", questions[index].text);
    if (updatedQuestionText !== null) {
      const updatedQuestions = questions.map((q, i) => 
        i === index ? { ...q, text: updatedQuestionText } : q
      );
      setQuestions(updatedQuestions);
    }
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const changeQuestionType = (index: number, newType: QuestionType) => {
    const updatedQuestions = questions.map((q, i) => 
      i === index ? { ...q, type: newType } : q
    );
    setQuestions(updatedQuestions);
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      {/* Use the Header component */}
      <Header title="Question Bank" />

      <textarea
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        placeholder="Enter your question here..."
        className="w-full max-w-lg p-4 border rounded-lg shadow-md"
      />
      <div className="mt-4">
        <label>
          <input
            type="radio"
            value="written"
            checked={newQuestionType === 'written'}
            onChange={() => setNewQuestionType('written')}
          />
          Written Response
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="slider"
            checked={newQuestionType === 'slider'}
            onChange={() => setNewQuestionType('slider')}
          />
          Slider Response
        </label>
      </div>
      <button
        onClick={addQuestion}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-400 transition-colors"
      >
        Add Question
      </button>

      <div className="mt-6 w-full max-w-lg">
        {questions.map((question, index) => (
          <div key={index} className="flex flex-col p-4 border-b">
            <div className="flex justify-between items-center">
              <span>{question.text}</span>
              <div className="space-x-2">
                <button
                  onClick={() => editQuestion(index)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteQuestion(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-2">
              <label>
                <input
                  type="radio"
                  value="written"
                  checked={question.type === 'written'}
                  onChange={() => changeQuestionType(index, 'written')}
                />
                Written Response
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  value="slider"
                  checked={question.type === 'slider'}
                  onChange={() => changeQuestionType(index, 'slider')}
                />
                Slider Response
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionBank;