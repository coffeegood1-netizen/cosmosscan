import React, { useState } from "react";
import { Brain, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const DOG_IMAGE = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b34f15f21ccf40e695b356/a1d8bc737_image.png";

export default function FeedHeader({ lastUpdated, onRefresh, isRefreshing, articleCount }) {
  const [showDog, setShowDog] = useState(false);

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Consciousness Feed
              </h1>
              <p className="text-sm text-white/80 mt-0.5">
                RSS aggregator for consciousness, remote viewing & frontier research
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-white/70 ml-15">
            {lastUpdated && (
              <span>Updated {format(new Date(lastUpdated), "MMM d, h:mm a")}</span>
            )}
            <span>{articleCount} articles</span>
          </div>
        </div>

        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-full px-5 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
          variant="outline"
        >
          {isRefreshing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          {isRefreshing ? "Fetching feeds..." : "Refresh Feeds"}
        </Button>
      </div>
    </div>
  );
}