export const invitesListStyles = {
  container: `
    h-[90%] md:w-full w-[90%]
    bg-gradient-to-br from-dusk-600/80 via-sunset-700/60 to-dusk-500/70
    backdrop-blur-sm
    shadow-lg ring-2 ring-sunset-600 
    rounded-3xl p-6
    flex flex-col
    overflow-hidden
    animate-fade-soft
    relative
  `,
  title: `
    text-3xl font-bold text-white 
    mb-6 tracking-wide text-center overflow-wrap
    drop-shadow
  `,
  emojiPulse: 'inline-block animate-pulse',
  listWrapper: `
    flex-1
    overflow-y-auto px-3
    space-y-5 
    scrollbar-theme
    h-[90%] 
  `,
  errorWrapper: 'h-full w-full flex justify-center items-center',
  searchContainer: 'mb-4 px-3',
  searchWrapper: `
    relative flex items-center
    bg-dusk-500/40 border border-sunset-400/50 rounded-2xl
    backdrop-blur-sm
    focus-within:border-sunset-300 focus-within:ring-2 ring-sunset-400/50 ring-1
    transition-all duration-200 px-3
  `,
  searchIcon: `
    w-5 h-5 text-sunset-300 absolute right-4
    pointer-events-none
  `,
  searchInput: `
    w-full px-4 py-3 pr-12 bg-transparent
    text-white placeholder-sunset-200/70
    text-lg font-medium
    border-none outline-none
    rounded-2xl
    text-right
  `,
  cardWrapper: `
    bg-black/40 backdrop-blur-sm
    rounded-2xl p-2
    ring-1 ring-red-600/40
    shadow-md
    transition-all duration-300
    hover:shadow-[0_0_2rem_rgba(255,0,50,0.5)]
    hover:bg-black/50
  `,
  noToastMessage: 'text-white text-2xl',
};
