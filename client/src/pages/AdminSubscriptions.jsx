import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { Search, Filter, Users, Activity, IndianRupee, Download, SearchX, MoreVertical } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { MetricCard } from '../components/ui/MetricCard';
import { AppCard } from '../components/ui/AppCard';
import { AppButton } from '../components/ui/AppButton';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, activeSubscriptions: 0, mrr: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subsRes, statsRes] = await Promise.all([
           axiosInstance.get('/admin/subscriptions'),
           axiosInstance.get('/admin/stats')
        ]);
        setSubscriptions(subsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSubs = subscriptions.filter(sub => 
    sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sub.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <PageHeader 
        title="Subscription Management"
        description="Overview of all customer subscriptions and revenue."
        action={
           <AppButton variant="outline" icon={Download}>
              Export CSV
           </AppButton>
        }
      />

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
         {loading ? (
            <>
               <LoadingSkeleton className="h-32" />
               <LoadingSkeleton className="h-32" />
               <LoadingSkeleton className="h-32" />
            </>
         ) : (
            <>
               <MetricCard title="Total Users" value={stats.totalUsers} icon={Users} iconColor="text-accent" />
               <MetricCard title="Active Subscriptions" value={stats.activeSubscriptions} icon={Activity} iconColor="text-success" />
               <MetricCard title="Monthly Recurring Revenue" value={`₹${stats.mrr}`} icon={IndianRupee} iconColor="text-primary" />
            </>
         )}
      </div>

      <AppCard className="overflow-hidden">
         <div className="p-4 md:p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
            <div className="relative w-full max-w-md">
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/40 w-4 h-4" />
               <input 
                  type="text" 
                  placeholder="Search by customer name or email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-sm rounded-xl bg-background/50 focus:bg-background"
               />
            </div>
            <AppButton variant="outline" icon={Filter} className="hidden sm:flex">
               Filter
            </AppButton>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-white/5 text-xs font-semibold uppercase tracking-wider text-text/50 bg-white/[0.01]">
                     <th className="p-4 pl-6">Customer</th>
                     <th className="p-4">Plan</th>
                     <th className="p-4">Status</th>
                     <th className="p-4">End Date</th>
                     <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5 text-sm">
                  {loading ? (
                     <tr>
                        <td colSpan="5" className="p-6">
                           <div className="space-y-4">
                              <LoadingSkeleton className="h-12 w-full" />
                              <LoadingSkeleton className="h-12 w-full" />
                              <LoadingSkeleton className="h-12 w-full" />
                           </div>
                        </td>
                     </tr>
                  ) : filteredSubs.length === 0 ? (
                     <tr>
                        <td colSpan="5" className="p-6">
                           <EmptyState 
                              icon={SearchX}
                              title="No subscriptions found"
                              description="Try adjusting your search terms or filters to find what you're looking for."
                           />
                        </td>
                     </tr>
                  ) : (
                     filteredSubs.map((sub) => (
                        <tr key={sub._id} className="hover:bg-white/[0.02] transition-colors group">
                           <td className="p-4 pl-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shadow-inner">
                                    {sub.user?.name?.charAt(0).toUpperCase()}
                                 </div>
                                 <div>
                                    <p className="font-medium text-text group-hover:text-primary transition-colors">{sub.user?.name}</p>
                                    <p className="text-xs text-text/50">{sub.user?.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="p-4 text-text/80 font-medium">{sub.plan?.name}</td>
                           <td className="p-4">
                              <StatusBadge status={sub.status} />
                           </td>
                           <td className="p-4 text-text/60">
                              {new Date(sub.endDate).toLocaleDateString(undefined, {
                                 year: 'numeric',
                                 month: 'short',
                                 day: 'numeric'
                              })}
                           </td>
                           <td className="p-4 pr-6 text-right">
                              <button className="p-2 hover:bg-white/5 rounded-lg text-text/50 hover:text-text transition-colors focus:outline-none">
                                 <MoreVertical className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </AppCard>
    </div>
  );
};

export default AdminSubscriptions;
