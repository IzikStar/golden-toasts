export const accusationsListStyles = {
  container: `
    h-[90%] md:w-full w-[90%]
    bg-gradient-to-br from-red-900/90 to-black/70
    backdrop-blur-xl
    ring-4 ring-red-600/100
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
  noToastMessage: 'text-white text-2xl',
  listWrapper: `
    flex-1
    overflow-y-auto pr-3
    space-y-5 
    scrollbar-styled
    h-[90%] 
  `,
  emojiPulse: 'inline-block animate-pulse',
  skeleton: {
    list: 'space-y-5',
    item: `
      p-4 bg-dusk-500/30 border border-sunset-500 rounded-2xl
      shadow-md transition-all duration-300 gap-2 flex flex-col
    `,
    itemHeader: 'h-6 bg-gray-300 rounded mb-2 animate-pulse dark:bg-gray-700',
    itemBody: 'h-4 bg-gray-300 rounded w-3/4 animate-pulse dark:bg-gray-700',
  },
};
