import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/themeSlice';
import { logout } from '../../store/authSlice';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Sun, Moon, Bell, User, Settings, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleMobileMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((state) => state.theme.mode);
  const { userInfo } = useAuth();
  const location = useLocation();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error(err);
    }
    dispatch(logout());
    navigate('/login');
  };
  
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageTitle = pathParts.length > 0 
    ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1) 
    : 'Dashboard';

  return (
    <header className="h-16 px-6 bg-card/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={toggleMobileMenu} className="md:hidden p-2 -ml-2 text-text/70 hover:text-text rounded-lg hover:bg-white/5">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center gap-2 text-sm text-text/50">
          <span>SaaSBase</span>
          <span>/</span>
          <span className="text-text font-medium">{pageTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors text-text/70 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-card" />
        </button>
        
        <button 
          onClick={() => dispatch(toggleTheme())}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors text-text/70"
        >
          {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        
        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-white/10 ml-2 relative" ref={dropdownRef}>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-text leading-tight">{userInfo?.name}</p>
            <p className="text-xs text-text/50 leading-tight capitalize">{userInfo?.role}</p>
          </div>
          
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 hover:ring-2 hover:ring-primary/50 transition-all focus:outline-none"
          >
            <span className="font-semibold text-white text-sm">
              {userInfo?.name?.charAt(0).toUpperCase()}
            </span>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-card border border-white/10 rounded-xl shadow-xl shadow-black/20 overflow-hidden z-50 origin-top-right py-1"
              >
                <div className="px-4 py-3 border-b border-white/5 sm:hidden">
                  <p className="text-sm font-medium text-text">{userInfo?.name}</p>
                  <p className="text-xs text-text/50">{userInfo?.email}</p>
                </div>
                
                <Link 
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text/70 hover:text-text hover:bg-white/5 transition-colors"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <Link 
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text/70 hover:text-text hover:bg-white/5 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </Link>
                
                <div className="h-px bg-white/5 my-1" />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
