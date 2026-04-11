"use client";

import { cn } from "@heroui/react";
import { Check } from "lucide-react";

export type Step = {
  title: string;
};

export type StepperProps = {
  steps: Step[];
  currentStep: number;
  className?: string;
};

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step.title} className="flex items-center gap-2">
            <div className="flex shrink-0 items-center gap-1.5">
              <div
                className={cn(
                  `
                    flex size-7 shrink-0 items-center justify-center
                    rounded-full border-2 border-default text-xs font-semibold
                    transition-colors
                  `,
                  {
                    "bg-default-foreground text-default": isCurrent,
                    "bg-default text-muted": isCompleted,
                    "text-muted": !isCompleted && !isCurrent,
                  },
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? <Check className="size-3.5" /> : index + 1}
              </div>
              <span
                className={cn("text-xs transition-colors", {
                  "text-muted": !isCurrent,
                })}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  `
                    h-0.5 shrink-0 basis-10 rounded-full bg-default
                    transition-colors
                  `,
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
