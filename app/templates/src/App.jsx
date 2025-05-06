import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProfessorDashboard from './components/profDashboard';
import AddClass from './components/addClass';

import FAQ from './components/FAQ';
import LogoutConfirmation from './components/logout';
import ClassView from './components/classView';
import Logout from './components/logout';
import Register from './components/registration';
import QuestionBank from './components/questionbank'
import AssignmentBank from './components/assignmentbank';
import ViewStudent from './components/viewstudent';
import ProfProfile from './components/prof-profile';
import TAProfile from './components/ta-profile';
import AddTAs from './components/add-ta';

import SignupForm from './components/signupform';

const router = createBrowserRouter([
  {
    path: "/", 
    element: <SignupForm />,
  },
  {
    path: "/questionbank",
    element: <QuestionBank />,
  },
  {
    path: "/assignmentbank",
    element: <AssignmentBank />,
  },
  {
    path: "/prof-dashboard",
    element: <ProfessorDashboard />,
  },
  {
    path: "/add-class",
    element: <AddClass />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },
  {
    path: "/logout",
    element: <LogoutConfirmation />,
  },
  {
  path: "/class/:classId",
  element: <ClassView />,
},
  {
    path: "/student/:studentId", 
    element: <ViewStudent />,
  },
  {
    path: "/prof-profile", 
    element: <ProfProfile />,
  },
  {
    path: "/ta-profile/:taId", 
    element: <TAProfile />,
  },
  {
    path: "/add-ta",
    element: <AddTAs />,
  }

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
