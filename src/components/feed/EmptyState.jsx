import React from "react";
import { Rss, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState({ onRefresh, isRefreshing }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-3xl bg-indigo-950/50 border border-indigo-500/20 flex items-center justify-center mb-6">
        <Rss className="w-10 h-10 text-indigo-400/50" />
      </div>
      <h3 className="text-xl font-semibold text-slate-300 mb-2">No articles yet</h3>
      <p className="text-slate-500 mb-6 max-w-md">
        Click the button below to fetch the latest articles from consciousness research RSS feeds.
      </p>
      <Button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? "Fetching..." : "Fetch RSS Feeds"}
      </Button>
    </div>
  );
}