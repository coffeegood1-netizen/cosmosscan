import React, { useState, useRef } from "react";
import { ExternalLink, Radio } from "lucide-react";

const CATEGORY_COLORS = {
  consciousness: "text-violet-400",
  remote_viewing: "text-cyan-400",
  parapsychology: "text-amber-400",
  neuroscience: "text-emerald-400",
  meditation: "text-rose-400",
  psychedelics: "text-fuchsia-400",
  uap_anomalous: "text-orange-400",
  general: "text-slate-400",
};

export default function Marquee({ articles, onArticleClick }) {
  const [isPaused, setIsPaused] = useState(false);
  const featured = articles.filter(a => a.is_featured).slice(0, 20);

  if (featured.length === 0) return null;

  // Duplicate for seamless loop
  const items = [...featured, ...featured];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950/50 to-slate-950 border-y border-indigo-500/20">
      {/* Glow edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10" />
      
      {/* Live indicator */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 bg-slate-950/90 pr-3 pl-2 py-1 rounded-full border border-indigo-500/30">
        <Radio className="w-3 h-3 text-red-500 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Live</span>
      </div>

      <div
        className="flex items-center py-3"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex items-center gap-8 whitespace-nowrap"
          style={{
            animation: `marquee ${featured.length * 5}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {items.map((article, idx) => (
            <button
              key={`${article.id || idx}-${idx}`}
              onClick={() => onArticleClick && onArticleClick(article)}
              className="flex items-center gap-3 group shrink-0 px-3 cursor-pointer"
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${CATEGORY_COLORS[article.category] || 'text-slate-400'}`}>
                {article.source}
              </span>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors max-w-[400px] truncate">
                {article.title}
              </span>
              <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
              <span className="text-slate-700">•</span>
            </button>

          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}