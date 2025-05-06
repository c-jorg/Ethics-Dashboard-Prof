// src/types/class.ts
export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface ClassData {
  classId: string;
  className: string;
  professorId: string;
  students: Student[];
}

// src/services/classService.ts
import { ClassData, Student } from '../types/class';

export const classService = {
  async addClass(classData: ClassData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/add-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding class:', error);
      return {
        success: false,
        message: 'Failed to add class. Please try again.',
      };
    }
  },
};

// src/hooks/useClassForm.ts
import { useState } from 'react';
import { ClassData, Student } from '../types/class';
import Papa from 'papaparse';

interface UseClassFormReturn {
  formData: Omit<ClassData, 'professorId'>;
  students: Student[];
  error: string;
  isSubmitting: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useClassForm = (professorId: string): UseClassFormReturn => {
  const [formData, setFormData] = useState({
    classId: '',
    className: '',
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      setError('Please upload a valid CSV file');
      return;
    }

    Papa.parse(file, {
      complete: (results) => {
        const validStudents = results.data
          .filter((row: any[]) => row.length === 3 && row.every(cell => cell.trim()))
          .map((row: any[]) => ({
            name: row[0].trim(),
            id: row[1].trim(),
            email: row[2].trim(),
          }));

        if (validStudents.length === 0) {
          setError('No valid student data found in CSV');
          return;
        }

        setStudents(validStudents);
        setError('');
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
      },
      skipEmptyLines: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.className || !formData.classId) {
      setError('Please fill out all fields');
      return;
    }

    if (students.length === 0) {
      setError('Please upload student data');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const classData: ClassData = {
        ...formData,
        professorId,
        students,
      };

      const result = await classService.addClass(classData);
      
      if (result.success) {
        window.location.href = '/prof-dashboard';
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to add class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    students,
    error,
    isSubmitting,
    handleInputChange,
    handleFileUpload,
    handleSubmit,
  };
};

// src/components/AddClass/FileUpload.tsx
import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => (
  <div className="mb-8">
    <label className="block mb-2 font-medium">Upload Student List (CSV)</label>
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-2 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">CSV file with Name, ID, Email columns</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept=".csv"
          onChange={onFileUpload}
        />
      </label>
    </div>
  </div>
);

// src/components/AddClass/StudentTable.tsx
import React from 'react';
import { Student } from '../../types/class';

interface StudentTableProps {
  students: Student[];
}

export const StudentTable: React.FC<StudentTableProps> = ({ students }) => (
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
);

// src/components/AddClass/AddClassForm.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { StudentTable } from './StudentTable';
import { useClassForm } from '../../hooks/useClassForm';

interface AddClassFormProps {
  professorId: string;
}

export const AddClassForm: React.FC<AddClassFormProps> = ({ professorId }) => {
  const {
    formData,
    students,
    error,
    isSubmitting,
    handleInputChange,
    handleFileUpload,
    handleSubmit,
  } = useClassForm(professorId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <FileUpload onFileUpload={handleFileUpload} />

      {students.length > 0 && <StudentTable students={students} />}

      <div>
        <label className="block mb-2 font-medium">Class Name</label>
        <input
          type="text"
          name="className"
          value={formData.className}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter class name"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Class ID</label>
        <input
          type="text"
          name="classId"
          value={formData.classId}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter class ID"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
          isSubmitting 
            ? 'bg-indigo-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isSubmitting ? 'Creating Class...' : 'Create Class'}
      </button>
    </form>
  );
};