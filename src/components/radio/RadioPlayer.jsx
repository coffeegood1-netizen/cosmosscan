import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Radio, ChevronDown, Loader2, SkipForward, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const GENRES = [
  { id: "jazz", label: "Jazz", tag: "jazz", icon: "🎷" },
  { id: "classical", label: "Classical", tag: "classical", icon: "🎻" },
  { id: "news", label: "News", tag: "news", icon: "📰" },
  { id: "science", label: "Science", tag: "science", icon: "🔬" },
  { id: "paranormal", label: "Paranormal / Alt", tag: "paranormal", icon: "👁️" },
  { id: "ambient", label: "Ambient", tag: "ambient", icon: "🌊" },
  { id: "blues", label: "Blues", tag: "blues", icon: "🎸" },
];

const API_BASE = "https://de1.api.radio-browser.info";

async function fetchStations(tag) {
  const tagMap = {
    jazz: "jazz",
    classical: "classical",
    news: "news,talk news",
    science: "science,education",
    paranormal: "paranormal,coast to coast,mystery,supernatural",
    ambient: "ambient,chillout",
    blues: "blues",
  };

  const searchTag = tagMap[tag] || tag;
  const tags = searchTag.split(",");
  
  let allStations = [];
  for (const t of tags) {
    const res = await fetch(
      `${API_BASE}/json/stations/bytag/${encodeURIComponent(t.trim())}?limit=15&order=clickcount&reverse=true&hidebroken=true`,
      { headers: { "User-Agent": "ConsciousnessFeed/1.0" } }
    );
    if (res.ok) {
      const data = await res.json();
      allStations = [...allStations, ...data];
    }
  }

  // Deduplicate by stationuuid and filter for working streams
  const seen = new Set();
  return allStations.filter(s => {
    if (seen.has(s.stationuuid)) return false;
    seen.add(s.stationuuid);
    return s.lastcheckok === 1 && s.url_resolved;
  }).slice(0, 20);
}

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [activeGenre, setActiveGenre] = useState("jazz");
  const [stations, setStations] = useState([]);
  const [currentStation, setCurrentStation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStations, setShowStations] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef(null);

  // Fetch stations when genre changes
  useEffect(() => {
    setIsLoading(true);
    fetchStations(activeGenre).then(data => {
      setStations(data);
      if (data.length > 0 && (!currentStation || currentStation._genre !== activeGenre)) {
        setCurrentStation({ ...data[0], _genre: activeGenre });
      }
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [activeGenre]);

  // Update audio when station changes
  useEffect(() => {
    if (!audioRef.current || !currentStation) return;
    audioRef.current.src = currentStation.url_resolved;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentStation]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!currentStation) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const skipStation = () => {
    if (stations.length < 2) return;
    const currentIdx = stations.findIndex(s => s.stationuuid === currentStation?.stationuuid);
    const nextIdx = (currentIdx + 1) % stations.length;
    setCurrentStation({ ...stations[nextIdx], _genre: activeGenre });
  };

  const selectStation = (station) => {
    setCurrentStation({ ...station, _genre: activeGenre });
    setShowStations(false);
    if (!isPlaying) {
      setIsPlaying(true);
      setTimeout(() => audioRef.current?.play().catch(() => {}), 100);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 z-50 bg-slate-900/90 backdrop-blur-sm border border-indigo-500/30 rounded-full p-3 shadow-lg shadow-indigo-500/10 hover:border-indigo-500/50 transition-all group"
        title="Open Radio Player"
      >
        <Radio className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
        {isPlaying && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-slate-900 animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-slate-950/95 backdrop-blur-xl border border-indigo-500/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
      <audio ref={audioRef} preload="none" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Live Radio</span>
          {isPlaying && (
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          )}
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-slate-500 hover:text-slate-300 text-xs"
        >
          minimize
        </button>
      </div>

      {/* Genre selector */}
      <div className="flex gap-1 px-3 py-2 overflow-x-auto scrollbar-hide border-b border-slate-800/40">
        {GENRES.map(genre => (
          <button
            key={genre.id}
            onClick={() => { setActiveGenre(genre.id); setShowStations(false); }}
            className={cn(
              "shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all",
              activeGenre === genre.id
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                : "text-slate-500 hover:text-slate-300 border border-transparent"
            )}
          >
            {genre.icon} {genre.label}
          </button>
        ))}
      </div>

      {/* Now playing */}
      <div className="px-4 py-3">
        {isLoading ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading stations...</span>
          </div>
        ) : currentStation ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              {currentStation.favicon && (
                <img
                  src={currentStation.favicon}
                  alt=""
                  className="w-6 h-6 rounded object-contain bg-slate-800"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <p className="text-sm font-medium text-white truncate flex-1">{currentStation.name}</p>
            </div>
            <p className="text-[10px] text-slate-500 truncate">
              {currentStation.country} · {currentStation.codec} {currentStation.bitrate}kbps
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No stations found</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 px-4 pb-3">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          disabled={!currentStation}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
            isPlaying
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300"
          )}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Skip */}
        <button
          onClick={skipStation}
          disabled={stations.length < 2}
          className="text-slate-500 hover:text-slate-300 transition-colors"
          title="Next station"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Volume */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
          className="flex-1 h-1 appearance-none bg-slate-700 rounded-full cursor-pointer accent-indigo-500"
        />

        {/* Station list toggle */}
        <button
          onClick={() => setShowStations(!showStations)}
          className={cn(
            "text-slate-500 hover:text-slate-300 transition-all",
            showStations && "rotate-180"
          )}
          title="Browse stations"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Station list */}
      {showStations && (
        <div className="border-t border-slate-800/60 max-h-48 overflow-y-auto">
          {stations.length === 0 && !isLoading && (
            <p className="text-xs text-slate-500 text-center py-4">No stations available</p>
          )}
          {stations.map(station => (
            <button
              key={station.stationuuid}
              onClick={() => selectStation(station)}
              className={cn(
                "w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-slate-800/60 transition-colors",
                currentStation?.stationuuid === station.stationuuid && "bg-indigo-600/10 border-l-2 border-indigo-500"
              )}
            >
              {station.favicon ? (
                <img src={station.favicon} alt="" className="w-5 h-5 rounded object-contain bg-slate-800 shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <Radio className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-300 truncate">{station.name}</p>
                <p className="text-[9px] text-slate-600 truncate">{station.tags}</p>
              </div>
              <span className="text-[9px] text-slate-600 shrink-0">{station.bitrate}k</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}