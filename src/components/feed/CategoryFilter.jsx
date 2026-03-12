import React from "react";
import { cn } from "@/lib/utils";
import { Brain, Eye, Sparkles, Atom, Flower2, Pill, Telescope, LayoutGrid } from "lucide-react";

const CATEGORIES = [
  { key: "all", label: "All", icon: LayoutGrid },
  { key: "consciousness", label: "Consciousness", icon: Brain },
  { key: "remote_viewing", label: "Remote Viewing", icon: Eye },
  { key: "parapsychology", label: "Parapsychology", icon: Sparkles },
  { key: "neuroscience", label: "Neuroscience", icon: Atom },
  { key: "meditation", label: "Meditation", icon: Flower2 },
  { key: "psychedelics", label: "Psychedelics", icon: Pill },
  { key: "uap_anomalous", label: "UAP & Anomalous", icon: Telescope },
];

const CATEGORY_STYLES = {
  all: "bg-slate-800/60 border-slate-600/40 text-slate-300 hover:border-slate-500",
  consciousness: "bg-violet-950/40 border-violet-500/30 text-violet-300 hover:border-violet-400",
  remote_viewing: "bg-cyan-950/40 border-cyan-500/30 text-cyan-300 hover:border-cyan-400",
  parapsychology: "bg-amber-950/40 border-amber-500/30 text-amber-300 hover:border-amber-400",
  neuroscience: "bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:border-emerald-400",
  meditation: "bg-rose-950/40 border-rose-500/30 text-rose-300 hover:border-rose-400",
  psychedelics: "bg-fuchsia-950/40 border-fuchsia-500/30 text-fuchsia-300 hover:border-fuchsia-400",
  uap_anomalous: "bg-orange-950/40 border-orange-500/30 text-orange-300 hover:border-orange-400",
};

const CATEGORY_ACTIVE = {
  all: "bg-slate-700/80 border-slate-400 text-white shadow-lg shadow-slate-500/20",
  consciousness: "bg-violet-900/60 border-violet-400 text-white shadow-lg shadow-violet-500/20",
  remote_viewing: "bg-cyan-900/60 border-cyan-400 text-white shadow-lg shadow-cyan-500/20",
  parapsychology: "bg-amber-900/60 border-amber-400 text-white shadow-lg shadow-amber-500/20",
  neuroscience: "bg-emerald-900/60 border-emerald-400 text-white shadow-lg shadow-emerald-500/20",
  meditation: "bg-rose-900/60 border-rose-400 text-white shadow-lg shadow-rose-500/20",
  psychedelics: "bg-fuchsia-900/60 border-fuchsia-400 text-white shadow-lg shadow-fuchsia-500/20",
  uap_anomalous: "bg-orange-900/60 border-orange-400 text-white shadow-lg shadow-orange-500/20",
};

export default function CategoryFilter({ activeCategory, onCategoryChange, articleCounts }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(({ key, label, icon: Icon }) => {
        const isActive = activeCategory === key;
        const count = key === "all" ? articleCounts.total : (articleCounts[key] || 0);
        
        return (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300",
              isActive ? CATEGORY_ACTIVE[key] : CATEGORY_STYLES[key]
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {count > 0 && (
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                isActive ? "bg-white/20" : "bg-white/10"
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}