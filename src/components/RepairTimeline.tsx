import { cn } from '@/lib/utils';
import { RepairStatus } from '@/app/lib/db';
import { Check, Clock, Settings, PackageCheck } from 'lucide-react';

export default function RepairTimeline({ status }: { status: RepairStatus }) {
  const steps = [
    { name: 'Pending', icon: Clock, key: 'Pending' },
    { name: 'In Progress', icon: Settings, key: 'In Progress' },
    { name: 'Completed', icon: PackageCheck, key: 'Completed' },
  ];

  const currentIdx = steps.findIndex(s => s.key === status);

  return (
    <div className="relative">
      <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-muted rounded-full"></div>
      <div 
        className="absolute left-6 top-2 w-0.5 bg-primary rounded-full transition-all duration-1000 ease-in-out" 
        style={{ height: `${(currentIdx / (steps.length - 1)) * 100}%` }}
      ></div>
      
      <div className="space-y-12 relative">
        {steps.map((step, idx) => {
          const isActive = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          
          return (
            <div key={step.name} className="flex items-start gap-6 group">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 shadow-sm",
                isActive ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-white text-muted-foreground border-2 border-muted"
              )}>
                {isActive && !isCurrent ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <step.icon className={cn("w-6 h-6", isCurrent && "animate-pulse")} />
                )}
              </div>
              <div className="pt-1.5">
                <p className={cn(
                  "font-bold text-lg leading-none mb-1",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {idx === 0 && "Device received and logged."}
                  {idx === 1 && "Technical repair is currently underway."}
                  {idx === 2 && "Device fixed and quality checked."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
