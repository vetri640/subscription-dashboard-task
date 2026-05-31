import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export const AppButton = ({ 
  children, 
  variant = 'primary', 
  loading = false, 
  icon: Icon,
  className,
  disabled,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 focus:ring-primary",
    secondary: "bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/25 hover:shadow-secondary/40 focus:ring-secondary",
    outline: "bg-transparent border border-white/10 hover:bg-white/5 text-text focus:ring-white/20",
    ghost: "bg-transparent hover:bg-white/5 text-text/80 hover:text-text focus:ring-white/20",
    danger: "bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20 focus:ring-danger"
  };

  return (
    <button 
      className={clsx(baseStyles, variants[variant], className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};
