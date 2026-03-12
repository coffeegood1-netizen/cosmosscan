import React, { useState } from "react";
import { ChevronDown, ChevronUp, Rss, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const FEEDS = [
  // Consciousness & Noetic Sciences
  { source: "Institute of Noetic Sciences", url: "https://noetic.org", category: "consciousness", description: "Frontier scientific research on consciousness, psi phenomena, subtle energies, and human potential" },
  { source: "APA Psychology of Consciousness", url: "https://content.apa.org/journals/cns", category: "consciousness", description: "Peer-reviewed articles on psychological aspects of consciousness, metacognition, and clinical applications" },
  { source: "Psychology Today - Theory of Consciousness", url: "https://www.psychologytoday.com/us/blog/theory-consciousness", category: "consciousness", description: "Philosophy of mind, cognitive science, epistemology, and scientific theories of consciousness" },
  { source: "Science Daily - Consciousness", url: "https://www.sciencedaily.com", category: "consciousness", description: "Latest scientific research news on consciousness and the mind-brain" },
  { source: "Frontiers in Consciousness", url: "https://www.frontiersin.org/journals/consciousness", category: "consciousness", description: "Open-access peer-reviewed research on the science of consciousness" },
  { source: "Consciousness Research", url: "https://www.consciousnessresearch.com", category: "consciousness", description: "Dedicated platform aggregating research on consciousness studies" },
  { source: "The Science of Consciousness (Eva Deli)", url: "http://evadeli.blogspot.com", category: "consciousness", description: "Physics-grounded explorations unifying theoretical physics, consciousness, and cosmology" },
  // Parapsychology & Psi
  { source: "Skeptiko Podcast", url: "https://skeptiko.com", category: "parapsychology", description: "In-depth interviews exploring the science of consciousness, parapsychology, and psi research" },
  { source: "New Thinking Allowed Podcast", url: "http://www.nonlocalmind.org", category: "parapsychology", description: "Interviews with experts on parapsychology, remote viewing, consciousness survival, and ESP" },
  { source: "SPR Psi Encyclopedia", url: "https://psi-encyclopedia.spr.ac.uk", category: "parapsychology", description: "Society for Psychical Research's comprehensive encyclopedia of psi phenomena" },
  { source: "Rupert Sheldrake", url: "https://www.sheldrake.org", category: "parapsychology", description: "Research on morphic resonance, psi phenomena, and extended mind theories" },
  // Remote Viewing
  { source: "IRVA - Remote Viewing", url: "https://irva.org", category: "remote_viewing", description: "International Remote Viewing Association — standards, training, and research" },
  { source: "Farsight Chats", url: "https://feeds.captivate.fm/farsight-chats/", category: "remote_viewing", description: "Discussions on remote viewing methodology and experiments from the Farsight Institute" },
  // Neuroscience
  { source: "Scientific American", url: "https://blogs.scientificamerican.com", category: "neuroscience", description: "Science observations, analysis, and news from leading scientists" },
  { source: "Mind Matters", url: "https://mindmatters.ai", category: "neuroscience", description: "News and analysis on mind, brain, and consciousness from a non-materialist perspective" },
  // Meditation
  { source: "Tricycle - Meditation", url: "https://tricycle.org", category: "meditation", description: "Buddhist perspectives, meditation practice, and contemplative traditions" },
  { source: "Lion's Roar", url: "https://www.lionsroar.com", category: "meditation", description: "Buddhist wisdom for daily life, meditation teachings, and mindfulness" },
  // Psychedelics
  { source: "MAPS", url: "https://maps.org", category: "psychedelics", description: "Multidisciplinary Association for Psychedelic Studies — clinical research and advocacy" },
  { source: "Reality Sandwich", url: "https://realitysandwich.com", category: "psychedelics", description: "Psychedelic culture, transformative experiences, and consciousness expansion" },
  // UAP & Anomalous
  { source: "The Daily Grail", url: "https://www.dailygrail.com", category: "uap_anomalous", description: "News and commentary on anomalous phenomena, UAPs, and fringe science" },
  { source: "The Unexplained", url: "https://www.theunexplained.tv", category: "uap_anomalous", description: "Exploration of unexplained phenomena, mysteries, and the paranormal" },
];

const CATEGORY_STYLES = {
  consciousness: { bg: "bg-violet-500/10 border-violet-500/20", dot: "bg-violet-400", text: "text-violet-300", label: "Consciousness" },
  remote_viewing: { bg: "bg-cyan-500/10 border-cyan-500/20", dot: "bg-cyan-400", text: "text-cyan-300", label: "Remote Viewing" },
  parapsychology: { bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400", text: "text-amber-300", label: "Parapsychology" },
  neuroscience: { bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-400", text: "text-emerald-300", label: "Neuroscience" },
  meditation: { bg: "bg-rose-500/10 border-rose-500/20", dot: "bg-rose-400", text: "text-rose-300", label: "Meditation" },
  psychedelics: { bg: "bg-fuchsia-500/10 border-fuchsia-500/20", dot: "bg-fuchsia-400", text: "text-fuchsia-300", label: "Psychedelics" },
  uap_anomalous: { bg: "bg-orange-500/10 border-orange-500/20", dot: "bg-orange-400", text: "text-orange-300", label: "UAP & Anomalous" },
};

// Group feeds by category
const grouped = FEEDS.reduce((acc, feed) => {
  if (!acc[feed.category]) acc[feed.category] = [];
  acc[feed.category].push(feed);
  return acc;
}, {});

export default function FeedSourcesPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8 rounded-2xl border border-slate-700/40 overflow-hidden bg-slate-900/40 backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/30 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <Rss className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-white">Active RSS Sources</span>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">
            {FEEDS.length} feeds
          </span>
        </div>
        {isOpen
          ? <ChevronUp className="w-4 h-4 text-slate-500" />
          : <ChevronDown className="w-4 h-4 text-slate-500" />
        }
      </button>

      {isOpen && (
        <div className="border-t border-slate-700/40 px-5 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(grouped).map(([category, feeds]) => {
              const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.consciousness;
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>
                      {style.label}
                    </span>
                    <span className="text-xs text-white/60">({feeds.length})</span>
                  </div>
                  <div className="space-y-2">
                    {feeds.map((feed) => (
                      <div
                        key={feed.source}
                        className={cn("rounded-xl border px-4 py-3", style.bg)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium text-white">{feed.source}</span>
                          <a
                            href={feed.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0 text-slate-500 hover:text-indigo-400 transition-colors mt-0.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <p className="text-xs text-white/70 mt-1 leading-relaxed">{feed.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}