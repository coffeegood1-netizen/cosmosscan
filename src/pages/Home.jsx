import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import Marquee from "../components/feed/Marquee";
import FeedHeader from "../components/feed/FeedHeader";
import CategoryFilter from "../components/feed/CategoryFilter";
import SortControls from "../components/feed/SortControls";
import ArticleCard from "../components/feed/ArticleCard";
import EmptyState from "../components/feed/EmptyState";
import FeedSourcesPanel from "../components/feed/FeedSourcesPanel";
import AnimatedBackground from "../components/feed/AnimatedBackground";
import ArticleModal from "../components/feed/ArticleModal";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: () => base44.entities.Article.list("-pub_date", 200),
    initialData: [],
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await base44.functions.invoke("fetchRSSFeeds", {});
      toast.success(`Fetched ${res.data.total_fetched} articles from ${res.data.sources_attempted} sources`);
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    } catch (err) {
      toast.error("Failed to fetch feeds. Try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const articleCounts = useMemo(() => {
    const counts = { total: articles.length };
    articles.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [articles]);

  const filteredAndSorted = useMemo(() => {
    let result = [...articles];

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter(a => a.category === activeCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.title?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q) ||
        a.source?.toLowerCase().includes(q) ||
        a.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortBy) {
      case "date_desc":
        result.sort((a, b) => new Date(b.pub_date || 0) - new Date(a.pub_date || 0));
        break;
      case "date_asc":
        result.sort((a, b) => new Date(a.pub_date || 0) - new Date(b.pub_date || 0));
        break;
      case "source":
        result.sort((a, b) => (a.source || "").localeCompare(b.source || ""));
        break;
    }

    return result;
  }, [articles, activeCategory, sortBy, searchQuery]);

  const lastUpdated = articles.length > 0 ? articles[0]?.created_date : null;

  return (
    <div className="min-h-screen text-white relative">
      <AnimatedBackground />
      {/* Marquee */}
      <Marquee articles={articles} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-black/50 rounded-2xl my-4 backdrop-blur-sm">
        <FeedHeader
          lastUpdated={lastUpdated}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          articleCount={articles.length}
        />

        {/* Feed Sources Panel */}
        <FeedSourcesPanel />

        {/* Filters */}
        <div className="space-y-4 mb-8">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            articleCounts={articleCounts}
          />
          <SortControls
            sortBy={sortBy}
            onSortChange={setSortBy}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && articles.length === 0 && (
          <EmptyState onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        )}

        {/* No results for filter */}
        {!isLoading && articles.length > 0 && filteredAndSorted.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">No articles match your filters.</p>
            <button
              onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
              className="text-indigo-400 hover:text-indigo-300 mt-2 text-sm underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Article grid */}
        {filteredAndSorted.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map((article, idx) => (
              <ArticleCard key={article.id || idx} article={article} index={idx} onClick={() => setSelectedArticle(article)} />
            ))}
          </div>
        )}
      </div>

      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />

      {/* Footer */}
      <div className="border-t border-slate-800/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-xs text-slate-600">
            Consciousness Feed — Aggregating frontier research from {articleCounts.total || 0} articles across 16+ sources
          </p>
        </div>
      </div>
    </div>
  );
}