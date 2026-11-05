import React from 'react';
import { Sparkles, Activity, HeartHandshake, Droplets, BookMarked, CheckCircle2 } from 'lucide-react';

interface StageProgressBarProps {
  currentStage: number; // 1 to 6
  onSelectStage: (stage: number) => void;
  completedStages: number[];
}

export const STAGES = [
  { id: 1, name: 'Brahma Muhurtha', short: 'Dawn Hour', icon: Sparkles },
  { id: 2, name: '7 Chakras Cleansing', short: 'Chakras', icon: Activity },
  { id: 3, name: "Ho'oponopono Prayer", short: 'Prayer', icon: HeartHandshake },
  { id: 4, name: 'Water Alchemy', short: 'Water', icon: Droplets },
  { id: 5, name: '10 Magic Blessings', short: 'Blessings', icon: BookMarked },
  { id: 6, name: 'Sacred Completion', short: 'Complete', icon: CheckCircle2 },
];

export const StageProgressBar: React.FC<StageProgressBarProps> = ({
  currentStage,
  onSelectStage,
  completedStages,
}) => {
  return (
    <div className="w-full bg-stone-50/80 border-b border-emerald-900/10 py-3 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <nav aria-label="Stages Progress" className="flex items-center justify-between gap-1 sm:gap-2">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = currentStage === stage.id;
            const isCompleted = completedStages.includes(stage.id);

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => onSelectStage(stage.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-900 text-white shadow-md ring-2 ring-emerald-600/30 font-semibold'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200/80 font-medium'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-medium'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`Go to Stage ${stage.id}: ${stage.name}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isActive
                        ? 'bg-white text-emerald-950'
                        : isCompleted
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {isCompleted && !isActive ? '✓' : stage.id}
                  </div>
                  <span className="text-xs tracking-tight hidden lg:inline font-sans">
                    {stage.name}
                  </span>
                  <span className="text-xs tracking-tight lg:hidden font-sans">
                    {stage.short}
                  </span>
                </button>

                {/* Connecting Line */}
                {idx < STAGES.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 hidden sm:block transition-colors shrink ${
                      isCompleted ? 'bg-emerald-500' : 'bg-stone-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
