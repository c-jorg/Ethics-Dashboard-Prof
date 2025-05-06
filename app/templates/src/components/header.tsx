import React from 'react';
import { LogOut, Home, User } from 'lucide-react'; // Import the User icon for profile
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout'); // Navigates to the logout page
  };

  const handleHome = () => {
    navigate('/prof-dashboard'); // Navigates to the Professor Dashboard
  };

  const handleProfile = () => {
    navigate('/prof-profile'); // Navigates to the Professor Profile
  };

  return (
    <div className="w-full bg-blue-500 text-white text-3xl font-semibold text-center py-4 mb-6 relative">
      {title}
      <div className="absolute top-4 right-6 flex space-x-4">
        {/* Home Button */}
        <button
          onClick={handleHome}
          className="text-white hover:bg-blue-400 p-2 rounded transition-colors"
          aria-label="Go to Home"
        >
          <Home size={24} />
        </button>
        {/* Profile Button */}
        <button
          onClick={handleProfile}
          className="text-white hover:bg-blue-400 p-2 rounded transition-colors"
          aria-label="Go to Profile"
        >
          <User size={24} />
        </button>
        {/* Log Out Button */}
        <button
          onClick={handleLogout}
          className="text-white hover:bg-blue-400 p-2 rounded transition-colors"
          aria-label="Log out"
        >
          <LogOut size={24} />
        </button>
      </div>
    </div>
  );
};

export default Header;