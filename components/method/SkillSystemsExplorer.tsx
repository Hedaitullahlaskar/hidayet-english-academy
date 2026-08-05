"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { skillSystems } from "@/content/method-data";

export function SkillSystemsExplorer() {
  const [activeId, setActiveId] = useState(skillSystems[0]!.id);
  const active = skillSystems.find((s) => s.id === activeId) ?? skillSystems[0]!;

  return (
    <div className="mt-14">
      <div
        role="tablist"
        aria-label="Skill systems"
        className="flex flex-wrap justify-center gap-2 sm:gap-3"
      >
        {skillSystems.map((system) => {
          const isActive = system.id === activeId;
          return (
            <button
              key={system.id}
              role="tab"
              id={`tab-${system.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${system.id}`}
              onClick={() => setActiveId(system.id)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
                isActive
                  ? "border-gold-500 bg-gold-600 text-navy-900 shadow-gold"
                  : "border-navy-200 bg-white text-navy-700 hover:border-gold-400 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200"
              )}
            >
              <span aria-hidden="true">{system.icon}</span>
              {system.title}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
        key={active.id}
        className="mx-auto mt-8 max-w-3xl animate-fade-up rounded-xl border border-navy-100 bg-white p-8 shadow-elevated dark:border-navy-700 dark:bg-navy-800"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-100 text-3xl dark:bg-navy-700" aria-hidden="true">
            {active.icon}
          </span>
          <div>
            <h3 className="font-display text-xl font-semibold text-navy-900 dark:text-white">
              {active.title}
            </h3>
            <p className="mt-1.5 text-navy-600 dark:text-navy-300">{active.summary}</p>
          </div>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {active.details.map((detail) => (
            <li key={detail} className="flex items-start gap-2.5 text-sm text-navy-700 dark:text-navy-200">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success-text dark:text-success" />
              <span className="leading-relaxed">{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
