import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../store/authSlice';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { MdPerson, MdEmail, MdLock, MdSave } from 'react-icons/md';

const Profile = () => {
  const { userInfo } = useAuth();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.put('/auth/profile', {
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password })
      });
      
      dispatch(updateUserInfo(res.data));
      setFormData({ ...formData, password: '', confirmPassword: '' });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text">Profile Settings</h1>
        <p className="text-text/60 mt-1">Manage your account details and preferences.</p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center shadow-lg text-white text-3xl font-bold">
            {userInfo?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">{userInfo?.name}</h2>
            <p className="text-text/60">{userInfo?.email}</p>
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              {userInfo?.role}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text/80">Full Name</label>
              <div className="relative">
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50 text-lg" />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full glass-input pl-10 pr-4 py-3"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-text/80">Email Address</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50 text-lg" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full glass-input pl-10 pr-4 py-3 opacity-70"
                  placeholder="john@example.com"
                  disabled // Email typically shouldn't be changed without verification, but we allow it if required. Disabled for UI safety here.
                />
              </div>
              <p className="text-xs text-text/40">Email cannot be changed.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text/80">New Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50 text-lg" />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full glass-input pl-10 pr-4 py-3"
                  placeholder="Leave blank to keep current"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text/80">Confirm New Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50 text-lg" />
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full glass-input pl-10 pr-4 py-3"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><MdSave className="text-xl" /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
