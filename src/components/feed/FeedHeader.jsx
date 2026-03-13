import React, { useState, useEffect } from "react";
import { Brain, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const DOG_IMAGE = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b34f15f21ccf40e695b356/a1d8bc737_image.png";

export default function FeedHeader({ lastUpdated, onRefresh, isRefreshing, articleCount }) {
  const [showDog, setShowDog] = useState(false);

  useEffect(() => {
    if (showDog) {
      const timer = setTimeout(() => setShowDog(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showDog]);

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div
                className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-indigo-500/30 cursor-pointer hover:scale-110 transition-transform duration-200"
                onClick={() => setShowDog(!showDog)}
              >
                <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b34f15f21ccf40e695b356/f8758b963_generated_image.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />

              {/* Dog popup */}
              {showDog && (
                <div className="absolute left-14 bottom-0 flex items-end gap-2 z-50" style={{width: '220px'}}>
                  {/* Speech bubble */}
                  <div className="relative bg-white text-slate-800 text-sm font-semibold px-3 py-2 rounded-2xl rounded-bl-none shadow-xl whitespace-nowrap">
                    Any RV News? 🔍
                    <div className="absolute -left-2 bottom-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-0" />
                  </div>
                  {/* Dog */}
                  <img
                    src={DOG_IMAGE}
                    alt="Dog"
                    className="w-24 h-24 object-contain drop-shadow-2xl"
                    style={{filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))'}}
                  />
                </div>
              )}
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

        <div className="flex flex-col items-end gap-2">
          <p className="text-sm italic text-indigo-300/70 tracking-wide hidden md:block">
            "Keep your wits about you." — Glenn Wheaton
          </p>
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
    </div>
  );
}