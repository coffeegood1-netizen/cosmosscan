import React, { useState } from "react";
import { ExternalLink, X, Clock, Tag, Globe } from "lucide-react";
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

// Map source names to known logo URLs (Google Favicon API as fallback)
function getSourceLogo(article) {
  if (article.source_url) {
    try {
      const domain = new URL(article.source_url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (_) {}
  }
  if (article.link) {
    try {
      const domain = new URL(article.link).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (_) {}
  }
  return null;
}

export default function ArticleModal({ article, onClose }) {
  const [logoError, setLogoError] = useState(false);
  if (!article) return null;

  const pubDate = article.pub_date ? new Date(article.pub_date) : null;
  const logoUrl = getSourceLogo(article);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header image */}
        {article.image_url && (
          <div className="relative h-52 overflow-hidden rounded-t-2xl">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6">
          {/* Source row */}
          <div className="flex items-center gap-3 mb-4">
            {logoUrl && !logoError ? (
              <img
                src={logoUrl}
                alt={article.source}
                className="w-8 h-8 rounded-md bg-white/10 object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-md bg-slate-700 flex items-center justify-center">
                <Globe className="w-4 h-4 text-slate-400" />
              </div>
            )}
            <span className="text-sm font-semibold text-slate-300">{article.source}</span>

            {article.category && (
              <span className={cn(
                "ml-auto text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border",
                CATEGORY_BADGE[article.category] || CATEGORY_BADGE.general
              )}>
                {article.category.replace(/_/g, " ")}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-white leading-snug mb-3">
            {article.title}
          </h2>

          {/* Meta */}
          {pubDate && (
            <div className="flex items-center gap-1.5 text-slate-500 mb-4">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{format(pubDate, "MMMM d, yyyy · h:mm a")}</span>
            </div>
          )}

          {/* Description */}
          {article.description && (
            <p className="text-slate-300 leading-relaxed text-sm mb-6 whitespace-pre-wrap">
              {article.description}
            </p>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 pt-4 border-t border-slate-800">
              {article.tags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800/70 px-2.5 py-1 rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onClose}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Close
            </button>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
            >
              Read Full Article
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}