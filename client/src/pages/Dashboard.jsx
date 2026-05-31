import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import { CreditCard, Calendar, Activity, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageHeader } from '../components/ui/PageHeader';
import { MetricCard } from '../components/ui/MetricCard';
import { AppCard } from '../components/ui/AppCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AppButton } from '../components/ui/AppButton';

const data = [
  { name: 'Jan', usage: 400 },
  { name: 'Feb', usage: 300 },
  { name: 'Mar', usage: 600 },
  { name: 'Apr', usage: 800 },
  { name: 'May', usage: 500 },
  { name: 'Jun', usage: 900 },
  { name: 'Jul', usage: 1000 },
];

const Dashboard = () => {
  const { userInfo } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await axiosInstance.get('/subscriptions/my-subscription');
        setSubscription(res.data);
      } catch (error) {
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSub();
  }, []);

  const daysRemaining = subscription 
    ? Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <PageHeader 
        title={`Welcome back, ${userInfo?.name.split(' ')[0]}`}
        description="Here is what's happening with your account today."
      />

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {loading ? (
          <>
            <LoadingSkeleton className="h-32" />
            <LoadingSkeleton className="h-32" />
            <LoadingSkeleton className="h-32" />
          </>
        ) : (
          <>
            {/* Current Plan */}
            <MetricCard
              title="Current Plan"
              value={subscription ? subscription.plan.name : 'Free Tier'}
              icon={CreditCard}
              iconColor="text-primary"
              trend={subscription ? 12 : 0}
              trendLabel="vs last month"
            />

            {/* Days Remaining */}
            <MetricCard
              title="Days Remaining"
              value={subscription ? daysRemaining : '∞'}
              icon={Calendar}
              iconColor="text-secondary"
            />

            {/* Status */}
            <AppCard className="p-5 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-text/60 mb-1">Account Status</p>
                  <div className="mt-2">
                    {subscription?.status === 'active' ? (
                       <StatusBadge status="active" />
                    ) : (
                       <StatusBadge status="cancelled" />
                    )}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 text-accent">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              
              {!subscription && (
                 <Link to="/plans" className="relative z-10 mt-4">
                   <AppButton variant="ghost" className="w-full text-xs hover:bg-primary hover:text-white transition-colors py-1.5 h-auto">
                     Upgrade to Premium <ArrowRight className="w-3 h-3 ml-1" />
                   </AppButton>
                 </Link>
              )}
            </AppCard>
          </>
        )}

      </div>

      {/* Main Charts & Activity Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Chart */}
        <AppCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-text">Usage Analytics</h3>
             <select className="bg-white/5 border border-white/10 text-text text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option className="bg-card">Last 7 months</option>
                <option className="bg-card">Last 30 days</option>
             </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                   itemStyle={{ color: '#F8FAFC', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="usage" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AppCard>

        {/* Activity Feed */}
        <AppCard className="p-6">
          <h3 className="text-lg font-bold text-text mb-6">Recent Activity</h3>
          
          <div className="space-y-6">
             {/* Timeline Item */}
             <div className="relative pl-6 border-l border-white/10">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1 ring-4 ring-card" />
                <p className="text-sm font-medium text-text">Logged in from new device</p>
                <p className="text-xs text-text/50 mt-1">2 hours ago</p>
             </div>
             {subscription && (
                <div className="relative pl-6 border-l border-white/10">
                   <div className="absolute w-3 h-3 bg-success rounded-full -left-[6.5px] top-1 ring-4 ring-card" />
                   <p className="text-sm font-medium text-text">Subscription Activated</p>
                   <p className="text-xs text-text/50 mt-1">
                      {new Date(subscription.startDate).toLocaleDateString()}
                   </p>
                </div>
             )}
             <div className="relative pl-6 border-l border-transparent">
                <div className="absolute w-3 h-3 bg-white/20 rounded-full -left-[6.5px] top-1 ring-4 ring-card" />
                <p className="text-sm font-medium text-text">Account created</p>
                <p className="text-xs text-text/50 mt-1">Just joined</p>
             </div>
          </div>
        </AppCard>

      </div>
    </div>
  );
};

export default Dashboard;
