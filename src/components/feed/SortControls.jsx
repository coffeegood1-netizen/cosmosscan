import React from "react";
import { ArrowUpDown, ArrowDown, ArrowUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { key: "date_desc", label: "Newest" },
  { key: "date_asc", label: "Oldest" },
  { key: "source", label: "Source" },
];

export default function SortControls({ sortBy, onSortChange, searchQuery, onSearchChange }) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-slate-900/60 border-slate-700/50 text-slate-200 placeholder:text-slate-600 rounded-full focus:border-indigo-500/50 focus:ring-indigo-500/20"
        />
      </div>

      {/* Sort buttons */}
      <div className="flex items-center gap-1 bg-slate-900/40 rounded-full p-1 border border-slate-700/30">
        {SORT_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onSortChange(key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
              sortBy === key
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}