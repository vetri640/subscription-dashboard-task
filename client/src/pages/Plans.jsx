import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { CheckCircle2, Star } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { PageHeader } from '../components/ui/PageHeader';
import { AppCard } from '../components/ui/AppCard';
import { AppButton } from '../components/ui/AppButton';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, subRes] = await Promise.all([
          axiosInstance.get('/plans'),
          axiosInstance.get('/subscriptions/my-subscription').catch(() => ({ data: null }))
        ]);
        setPlans(plansRes.data);
        if (subRes.data && subRes.data.status === 'active') {
           setCurrentSub(subRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan) => {
    if (currentSub?.plan?._id === plan._id) return;

    try {
      setProcessingId(plan._id);
      
      const res = await loadRazorpay();
      if (!res) {
         toast.error("Razorpay SDK failed to load.");
         setProcessingId(null);
         return;
      }
      
      // 1. Create order
      const { data: { order } } = await axiosInstance.post(`/subscriptions/order/${plan._id}`);

      // 2. Open Razorpay Checkout or Mock Payment
      if (order.id.startsWith('order_mock_')) {
         toast.loading("Simulating mock payment...", { id: 'payment' });
         
         // Simulate user typing in card details and confirming...
         setTimeout(async () => {
            try {
               await axiosInstance.post('/subscriptions/verify', {
                  razorpay_order_id: order.id,
                  razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 10)}`,
                  razorpay_signature: 'mock_signature',
                  planId: plan._id
               });
               
               toast.success(`Successfully subscribed to ${plan.name}!`, { id: 'payment' });
               window.location.href = '/dashboard';
            } catch(e) {
               toast.error('Payment verification failed', { id: 'payment' });
            } finally {
               setProcessingId(null);
            }
         }, 1500);
         return;
      }

      const options = {
         key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock',
         amount: order.amount,
         currency: order.currency,
         name: "SaaSBase",
         description: `Subscription to ${plan.name}`,
         order_id: order.id,
         handler: async function (response) {
            try {
               toast.loading("Verifying payment...", { id: 'payment' });
               await axiosInstance.post('/subscriptions/verify', {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  planId: plan._id
               });
               
               toast.success(`Successfully subscribed to ${plan.name}!`, { id: 'payment' });
               window.location.href = '/dashboard';
            } catch(e) {
               toast.error('Payment verification failed', { id: 'payment' });
            } finally {
               setProcessingId(null);
            }
         },
         prefill: {
            name: userInfo?.name,
            email: userInfo?.email,
         },
         theme: {
            color: "#6366F1"
         },
         modal: {
            ondismiss: function() {
               setProcessingId(null);
            }
         }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      toast.error('Failed to initiate subscription');
      setProcessingId(null);
    }
  };

  const getButtonLabel = (plan) => {
     if (!currentSub) return "Subscribe Now";
     if (currentSub.plan._id === plan._id) return "Current Plan";
     if (currentSub.plan.price < plan.price) return "Upgrade";
     return "Downgrade";
  };

  if (loading) {
     return (
        <div className="flex items-center justify-center h-64">
           <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
     );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-20 relative">
         {/* Ambient Glow behind the text */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg bg-gradient-to-tr from-primary/30 to-secondary/30 blur-[100px] pointer-events-none -z-10" />
         
         <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 mb-6 tracking-tight pb-2"
         >
            Predictable pricing for limitless growth
         </motion.h1>
         <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-text/60 max-w-2xl mx-auto"
         >
            Choose the perfect plan for your business needs. No hidden fees, no surprise charges. Just powerful tools to scale your SaaS.
         </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
         {plans.map((plan, index) => {
            const isPopular = plan.name.toLowerCase().includes('pro');
            const buttonLabel = getButtonLabel(plan);
            const isCurrent = buttonLabel === "Current Plan";
            
            return (
               <AppCard
                  key={plan._id}
                  hover
                  className={clsx(
                     "relative flex flex-col p-8",
                     isPopular ? "border-primary/50 shadow-2xl shadow-primary/10 md:-mt-4 md:mb-4 bg-primary/5" : ""
                  )}
               >
                  {isPopular && (
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-primary/20 uppercase tracking-wider">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        Most Popular
                     </div>
                  )}

                  <div className="mb-8">
                     <h3 className="text-xl font-semibold text-text mb-2">{plan.name}</h3>
                     <div className="flex items-end gap-1">
                        <span className="text-sm text-text/60 font-medium mb-1">₹</span>
                        <span className="text-5xl font-bold tracking-tight text-text">{plan.price}</span>
                        <span className="text-text/50 text-sm mb-1">/{plan.duration}d</span>
                     </div>
                  </div>

                  <ul className="flex-1 space-y-4 mb-8">
                     {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-text/80 text-sm">
                           <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                           <span className="pt-0.5">{feature}</span>
                        </li>
                     ))}
                  </ul>

                  <AppButton
                     onClick={() => handleSubscribe(plan)}
                     disabled={isCurrent}
                     loading={processingId === plan._id}
                     variant={isCurrent ? "outline" : isPopular ? "primary" : "secondary"}
                     className="w-full h-12"
                  >
                     {buttonLabel}
                  </AppButton>
               </AppCard>
            )
         })}
      </div>
    </div>
  );
};

export default Plans;
