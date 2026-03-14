import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Calendar,
  LayoutDashboard,
  ClipboardList
} from 'lucide-react';
import './Header.css';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
  localStorage.removeItem('token'); // ✅ clear JWT
  logout();                         // clear context
  navigate('/login');
  setIsMobileMenuOpen(false);
};


  const isActive = (path: string) => location.pathname === path;

  const studentLinks = [
    { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/student/events', label: 'Events', icon: Calendar },
    { path: '/student/my-registrations', label: 'My Registrations', icon: ClipboardList },
  ];

  const facultyLinks = [
    { path: '/faculty/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/faculty/events', label: 'My Events', icon: Calendar },
    { path: '/faculty/create-event', label: 'Create Event', icon: ClipboardList },
  ];

  const links = user?.role === 'faculty' ? facultyLinks : studentLinks;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="logo-icon">
            <GraduationCap size={28} />
          </div>
          <div className="logo-text">
            <span className="logo-title">KRMU</span>
            <span className="logo-subtitle">Event Management</span>
          </div>
        </Link>

        {user && (
          <>
            <nav className={`header-nav ${isMobileMenuOpen ? 'open' : ''}`}>
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon size={18} />
                  <span>{link.label}</span>
                </Link>
              ))}
              
              <div className="nav-divider" />
              
              <div className="nav-user-info">
                <User size={18} />
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
              </div>
              
              <button className="nav-logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </nav>

            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </>
        )}

        {!user && (
          <nav className="header-nav auth-nav">
            <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </nav>
        )}
      </div>
      
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />}
    </header>
  );
};
