'use client'

interface ProgressStepsProps {
  steps: string[]
  currentStep: number
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="py-3 px-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-1">
      <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mr-2">
        Progress
      </span>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className={`w-[22px] h-[22px] rounded-full text-[11px] font-semibold flex items-center justify-center transition-all duration-300 ${
              i < currentStep
                ? 'bg-tertiary-500 text-white'
                : i === currentStep
                  ? 'bg-tertiary-500/15 text-tertiary-600 dark:text-tertiary-400 border-2 border-tertiary-500'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
            }`}
          >
            {i < currentStep ? '✓' : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-5 h-0.5 rounded-sm transition-all duration-300 ${
                i < currentStep
                  ? 'bg-tertiary-500'
                  : 'bg-gray-200 dark:bg-slate-700'
              }`}
            />
          )}
        </div>
      ))}
      <span className="text-[11px] text-gray-500 dark:text-slate-400 ml-2">
        {steps[currentStep] || 'Complete'}
      </span>
    </div>
  )
}
