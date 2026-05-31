import clsx from 'clsx';

export const StatusBadge = ({ status, className }) => {
  const styles = {
    active: "bg-success/10 text-success border-success/20",
    cancelled: "bg-danger/10 text-danger border-danger/20",
    expired: "bg-text/10 text-text/60 border-white/10",
    default: "bg-primary/10 text-primary border-primary/20",
  };

  const currentStyle = styles[status?.toLowerCase()] || styles.default;

  return (
    <span className={clsx(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      currentStyle,
      className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span className="capitalize">{status}</span>
    </span>
  );
};
