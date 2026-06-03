import React from 'react';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="relative border-l border-sky-200 dark:border-slate-800 ml-4 md:ml-32 space-y-12">
      {items.map((milestone, idx) => (
        <div key={idx} className="relative pl-8 md:pl-12 group animate-in fade-in duration-300">
          {/* Timeline Dot */}
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white dark:border-slate-950 bg-sky-500 group-hover:bg-indigo-500 transition-colors duration-300" />
          
          {/* Year Label */}
          <span className="absolute left-[-110px] top-0 hidden md:block text-lg font-black text-sky-500 dark:text-sky-400">
            {milestone.year}
          </span>

          <div className="space-y-2 max-w-3xl">
            <span className="inline-block md:hidden text-sm font-bold text-sky-500 dark:text-sky-400 mb-1">
              {milestone.year}
            </span>
            <h3 className="text-lg md:text-xl font-extrabold text-on-surface dark:text-white">
              {milestone.title}
            </h3>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
              {milestone.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
