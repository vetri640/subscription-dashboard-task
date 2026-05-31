import clsx from 'clsx';

export const LoadingSkeleton = ({ className, ...props }) => {
  return (
    <div 
      className={clsx("animate-pulse bg-white/5 rounded-md", className)} 
      {...props}
    />
  );
};
