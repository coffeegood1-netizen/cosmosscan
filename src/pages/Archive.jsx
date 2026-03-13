import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Search, Archive as ArchiveIcon, Clock, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/feed/AnimatedBackground";

const ARTICLES_PER_PAGE = 30;

export default function Archive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles-archive"],
    queryFn: () => base44.entities.Article.list("-pub_date", 3000),
    initialData: [],
  });

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(a =>
      a.title?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q) ||
      a.source?.toLowerCase().includes(q) ||
      a.tags?.some(t => t.toLowerCase().includes(q)) ||
      a.category?.toLowerCase().includes(q)
    );
  }, [articles, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE);

  const handleSearch = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);
    if (left > 1) { pages.push(1); if (left > 2) pages.push("..."); }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages) { if (right < totalPages - 1) pages.push("..."); pages.push(totalPages); }
    return pages;
  };

  return (
    <div className="min-h-screen text-white relative">
      <AnimatedBackground />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-black/50 rounded-2xl my-6 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/Home" className="text-white/50 hover:text-white transition-colors text-sm">← Back</Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <ArchiveIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Article Archive</h1>
              <p className="text-sm text-white/60">{articles.length} total articles — fully searchable</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search by title, source, category, or tags..."
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/60 text-sm"
          />
          {searchQuery && (
            <button onClick={() => handleSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs">
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="text-xs text-white/40 mb-4">
          {searchQuery ? `${filtered.length} results for "${searchQuery}"` : `Showing page ${currentPage} of ${totalPages}`}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Article list */}
        <div className="space-y-2">
          {paginated.map((article, i) => (
            <a
              key={article.id || i}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white/90 group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {article.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{article.source}</span>
                  {article.pub_date && (
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(article.pub_date), "MMM d, yyyy")}</span>
                  )}
                  {article.category && (
                    <span className="bg-white/10 px-2 py-0.5 rounded-full capitalize">{article.category.replace(/_/g, " ")}</span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-8">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {getPages().map((page, i) =>
              page === "..." ? (
                <span key={`e-${i}`} className="px-2 text-white/30">…</span>
              ) : (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === currentPage ? "bg-indigo-600 text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
                  {page}
                </button>
              )
            )}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}