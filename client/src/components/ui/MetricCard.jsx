import { AppCard } from './AppCard';
import clsx from 'clsx';

export const MetricCard = ({ title, value, icon: Icon, trend, trendLabel, iconColor = "text-primary" }) => {
  return (
    <AppCard className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text/60 mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-text tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={clsx("p-2 rounded-lg bg-white/5", iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {(trend || trendLabel) && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          {trend && (
            <span className={clsx(
              "font-medium",
              trend > 0 ? "text-success" : trend < 0 ? "text-danger" : "text-text/60"
            )}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
          {trendLabel && <span className="text-text/50">{trendLabel}</span>}
        </div>
      )}
    </AppCard>
  );
};
