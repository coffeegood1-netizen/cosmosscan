import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Sky gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-400 to-blue-500" />

      {/* Sun */}
      <div className="absolute top-16 right-24 w-28 h-28 rounded-full bg-yellow-200 shadow-[0_0_80px_40px_rgba(253,224,71,0.5)] animate-pulse" />

      {/* Clouds */}
      <div className="absolute top-10 left-[-10%] w-[340px] h-20 animate-cloud-1">
        <div className="absolute inset-0 bg-white/80 rounded-full blur-xl" />
        <div className="absolute -top-6 left-16 w-32 h-24 bg-white/70 rounded-full blur-lg" />
        <div className="absolute -top-4 left-36 w-24 h-20 bg-white/80 rounded-full blur-lg" />
      </div>
      <div className="absolute top-24 left-[-5%] w-[260px] h-14 animate-cloud-2">
        <div className="absolute inset-0 bg-white/60 rounded-full blur-xl" />
        <div className="absolute -top-4 left-10 w-24 h-20 bg-white/70 rounded-full blur-lg" />
      </div>
      <div className="absolute top-6 right-[15%] w-[200px] h-12 animate-cloud-3">
        <div className="absolute inset-0 bg-white/70 rounded-full blur-xl" />
        <div className="absolute -top-3 left-8 w-20 h-16 bg-white/80 rounded-full blur-lg" />
      </div>
      <div className="absolute top-36 right-[-5%] w-[300px] h-16 animate-cloud-1" style={{animationDelay: '-12s'}}>
        <div className="absolute inset-0 bg-white/50 rounded-full blur-xl" />
        <div className="absolute -top-5 left-20 w-28 h-20 bg-white/60 rounded-full blur-lg" />
      </div>
      <div className="absolute top-48 left-[30%] w-[220px] h-12 animate-cloud-2" style={{animationDelay: '-8s'}}>
        <div className="absolute inset-0 bg-white/50 rounded-full blur-xl" />
        <div className="absolute -top-3 left-12 w-20 h-16 bg-white/60 rounded-full blur-lg" />
      </div>

      {/* Lava lamp blobs */}
      <div className="absolute bottom-0 left-0 right-0 top-[30%]">
        {/* Deep translucent overlay so blobs sit below the sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/30 to-slate-950/90" />

        {/* Blob 1 */}
        <div className="absolute w-96 h-96 rounded-full bg-violet-500/30 blur-3xl animate-blob-1" style={{left: '10%', bottom: '20%'}} />
        {/* Blob 2 */}
        <div className="absolute w-80 h-80 rounded-full bg-indigo-500/30 blur-3xl animate-blob-2" style={{left: '40%', bottom: '30%'}} />
        {/* Blob 3 */}
        <div className="absolute w-72 h-72 rounded-full bg-cyan-400/25 blur-3xl animate-blob-3" style={{right: '10%', bottom: '15%'}} />
        {/* Blob 4 */}
        <div className="absolute w-64 h-64 rounded-full bg-fuchsia-500/25 blur-3xl animate-blob-4" style={{left: '60%', bottom: '40%'}} />
        {/* Blob 5 */}
        <div className="absolute w-80 h-56 rounded-full bg-blue-400/20 blur-3xl animate-blob-5" style={{left: '25%', bottom: '50%'}} />
        {/* Blob 6 */}
        <div className="absolute w-56 h-72 rounded-full bg-purple-400/25 blur-3xl animate-blob-6" style={{right: '25%', bottom: '55%'}} />
      </div>

      {/* Bottom dark fade so content is readable */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-950 to-transparent" />

      <style>{`
        @keyframes cloud-1 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(110vw); }
        }
        @keyframes cloud-2 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(110vw); }
        }
        @keyframes cloud-3 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-110vw); }
        }
        .animate-cloud-1 { animation: cloud-1 60s linear infinite; }
        .animate-cloud-2 { animation: cloud-2 80s linear infinite; }
        .animate-cloud-3 { animation: cloud-3 70s linear infinite; }

        @keyframes blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(80px, -120px) scale(1.2); }
          66%       { transform: translate(-60px, 80px) scale(0.85); }
        }
        @keyframes blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(-100px, 100px) scale(1.15); }
          66%       { transform: translate(80px, -80px) scale(0.9); }
        }
        @keyframes blob-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(-80px, -100px) scale(1.1); }
          66%       { transform: translate(60px, 60px) scale(0.95); }
        }
        @keyframes blob-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-120px, 100px) scale(1.3); }
        }
        @keyframes blob-5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(100px, -60px) scale(0.8); }
          80%       { transform: translate(-80px, 100px) scale(1.2); }
        }
        @keyframes blob-6 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          30%       { transform: translate(60px, 80px) scale(1.1); }
          70%       { transform: translate(-100px, -60px) scale(0.9); }
        }
        .animate-blob-1 { animation: blob-1 18s ease-in-out infinite; }
        .animate-blob-2 { animation: blob-2 22s ease-in-out infinite; }
        .animate-blob-3 { animation: blob-3 16s ease-in-out infinite; }
        .animate-blob-4 { animation: blob-4 25s ease-in-out infinite; }
        .animate-blob-5 { animation: blob-5 20s ease-in-out infinite; }
        .animate-blob-6 { animation: blob-6 28s ease-in-out infinite; }
      `}</style>
    </div>
  );
}