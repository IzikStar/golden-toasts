export const AnimatedBannerDisplay = ({ emoji }: { emoji: string }) => (
  <div className="relative mb-2 hover:scale-[1.02] transition-transform duration-300">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-yellow-600 rounded-lg blur-sm opacity-30 animate-pulse pointer-events-none" />
    <div className="relative bg-black rounded-lg p-1 ring-1 ring-white/5 overflow-visible h-40 flex items-center justify-center">
      <span
        role="img"
        aria-label="Persona Non Grata"
        className="text-7xl md:text-8xl animate-bounce select-none"
      >
        {emoji}
      </span>
    </div>
  </div>
);
