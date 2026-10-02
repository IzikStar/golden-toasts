export const crimeListStyles = {
  container: `
    h-[90%] lg:w-full w-[90%]
    bg-gradient-to-br from-red-900/90 to-black/50
    backdrop-blur-xl
    ring-4 ring-red-600/100
    rounded-[5%] py-[5%] px-[2%]
    flex flex-col
    overflow-hidden
    animate-fade-soft
  `,
  title: `
    text-3xl font-bold text-white mt-2
    mb-6 tracking-wide text-center 
    drop-shadow
  `,
  listWrapper: `
    flex-1 overflow-y-auto space-y-4 pr-3 p-1
    scrollbar-styled h-[90%]
  `,
  errorWrapper: `
    flex-1 overflow-y-auto space-y-4 pr-3 p-1
    scrollbar-styled h-[90%] flex items-center justify-center
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
  emojiPulse: 'inline-block animate-pulse',
  skeleton: {
    list: 'space-y-2',
    item: `
      p-4 bg-black/30 border border-red-6-- rounded-2xl
      shadow-md transition-all duration-300
    `,
    itemHeader: 'h-6 bg-gray-300 rounded mb-2 animate-pulse dark:bg-gray-700',
    itemBody: 'h-4 bg-gray-300 rounded w-3/4 animate-pulse dark:bg-gray-700',
  },
};
