import { AppCard } from './AppCard';
import clsx from 'clsx';

export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <AppCard className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-white/5 bg-transparent shadow-none">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-text/40">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-lg font-medium text-text mb-1">{title}</h3>
      <p className="text-sm text-text/50 max-w-sm mb-6">{description}</p>
      {action}
    </AppCard>
  );
};
