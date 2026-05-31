import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import clsx from 'clsx';
import { LayoutDashboard, CreditCard, User, ShieldCheck, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import axiosInstance from '../../api/axiosInstance';
import { motion } from 'framer-motion';

export const Sidebar = () => {
  const { isAdmin } = useAuth();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error(err);
    }
    dispatch(logout());
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Plans', path: '/plans', icon: CreditCard },
    { name: 'My Subscription', path: '/dashboard', icon: ShieldCheck }, // Pointing to dashboard where details are
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin', path: '/admin/subscriptions', icon: ShieldCheck });
  }

  return (
    <aside className="w-64 border-r border-white/5 bg-background flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
          S
        </div>
        <span className="font-bold text-xl tracking-tight text-text">SaaSBase</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group",
              isActive 
                ? "text-primary bg-primary/10" 
                : "text-text/70 hover:text-text hover:bg-white/5"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active" 
                    className="absolute inset-0 bg-primary/10 rounded-xl" 
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={clsx("w-5 h-5 relative z-10", isActive ? "text-primary" : "text-text/50 group-hover:text-text/80")} />
                <span className="relative z-10">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text/70 hover:text-danger hover:bg-danger/10 transition-colors group"
        >
          <LogOut className="w-5 h-5 text-text/50 group-hover:text-danger" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};
