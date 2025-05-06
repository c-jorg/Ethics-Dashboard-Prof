import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";

const LogoutConfirmation = () => {
  const navigate = useNavigate();
  const [isSideNavOpen, setIsSideNavOpen] = React.useState(false);

  const handleLogout = () => {
    // Clear localStorage on logout
    localStorage.removeItem('professorData');
    console.log("Logging out...");
    navigate("/");
  };

  const TopNav = () => (
    <div className="fixed top-0 left-0 w-full bg-blue-500 h-20 flex items-center justify-between px-6 z-40">
      <button
        onClick={() => setIsSideNavOpen(!isSideNavOpen)}
        className="text-white hover:bg-blue-400 p-2 rounded transition-colors"
      >
        {isSideNavOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="font-lusitana text-white text-xl">Ethics Dashboard</div>

      <div className="w-10" /> {/* Spacer to maintain centering */}
    </div>
  );

  const SideNav = () => (
    <div
      className={`fixed top-0 left-0 h-full bg-blue-500 transition-all duration-300 ${
        isSideNavOpen ? 'w-64' : 'w-0'
      } overflow-hidden z-30 pt-20`}
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
  );

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <SideNav />

      {/* Main Content - Simplified Centered Dialog */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          {/* Logout Icon */}
          <div className="mb-6 flex justify-center">
            <LogOut size={32} className="text-blue-500" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Confirm Logout
          </h2>

          <p className="text-gray-600 mb-8">
            Are you sure you want to log out of your Ethics Dashboard account?
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              Yes, Logout
            </button>
            <button
              onClick={() => navigate("/prof-dashboard")}
              className="border border-blue-500 text-blue-500 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;