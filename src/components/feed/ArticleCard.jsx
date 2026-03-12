import React, { useState } from "react";
import { ExternalLink, Clock, Tag, Globe } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CATEGORY_BADGE = {
  consciousness: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  remote_viewing: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  parapsychology: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  neuroscience: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  meditation: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  psychedelics: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
  uap_anomalous: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  general: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

const PLACEHOLDER_GRADIENTS = [
  "from-violet-600/30 to-indigo-900/30",
  "from-cyan-600/30 to-blue-900/30",
  "from-amber-600/30 to-orange-900/30",
  "from-emerald-600/30 to-teal-900/30",
  "from-rose-600/30 to-pink-900/30",
  "from-fuchsia-600/30 to-purple-900/30",
];

function getSourceLogo(article) {
  const url = article.source_url || article.link;
  if (url) {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (_) {}
  }
  return null;
}

export default function ArticleCard({ article, index, onClick }) {
  const [logoError, setLogoError] = useState(false);
  const pubDate = article.pub_date ? new Date(article.pub_date) : null;
  const gradientIdx = (index || 0) % PLACEHOLDER_GRADIENTS.length;
  const hasImage = article.image_url && article.image_url.length > 5;
  const logoUrl = getSourceLogo(article);

  return (
    <div
      className="group block cursor-pointer"
      onClick={onClick}
    >
      <div className="relative bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          {hasImage ? (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br flex items-center justify-center",
              PLACEHOLDER_GRADIENTS[gradientIdx],
              hasImage ? "hidden" : "flex"
            )}
          >
            <div className="text-4xl opacity-30">🧠</div>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

          {/* Source badge with logo */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
            {logoUrl && !logoError ? (
              <img
                src={logoUrl}
                alt=""
                className="w-4 h-4 rounded-sm object-contain bg-white/10"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Globe className="w-3 h-3 text-white/50" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
              {article.source}
            </span>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border",
              CATEGORY_BADGE[article.category] || CATEGORY_BADGE.general
            )}>
              {(article.category || "general").replace(/_/g, " ")}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-semibold text-slate-100 leading-snug mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors duration-300">
            {article.title}
          </h3>

          {article.description && (
            <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {article.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3 h-3" />
              <span className="text-xs">
                {pubDate ? format(pubDate, "MMM d, yyyy") : "Recent"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs font-medium">Expand</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
              {article.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}