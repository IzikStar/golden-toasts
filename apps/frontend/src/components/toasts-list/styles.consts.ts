export const toastListStyles = {
  container: `
    h-[90%] lg:w-full w-[90%]
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
  noToastMessage: 'text-white text-2xl',
  listWrapper: `
    flex-1
    overflow-y-auto px-3
    space-y-5 
    scrollbar-theme
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
  errorWrapper: 'h-full w-full flex justify-center items-center',
  addButtonWrapper:
    'absolute lg:top-3 lg:left-3 md:top-1 md:left-1 top-3 left-3',
  dropdownContainer: 'relative mb-6 px-3',
  dropdownButton: `
    w-full text-3xl font-bold text-white tracking-wide
    bg-transparent border-2 border-sunset-400/50 rounded-2xl
    px-4 py-3 flex items-center justify-center
    hover:border-sunset-300 hover:bg-sunset-600/20
    focus:outline-none focus:ring-2 focus:ring-sunset-400
    transition-all duration-200
    drop-shadow
  `,
  dropdownButtonText:
    'flex items-center gap-2 text-center justify-center flex-1',
  dropdownArrow: `
    w-6 h-6 transition-transform duration-200
    flex-shrink-0 ml-2 absolute left-4 bg-sunset-600/80 backdrop-blur-sm shadow-lg rounded-full
  `,
  dropdownArrowOpen: 'rotate-180',
  popoverContent: `
    w-[var(--radix-popover-trigger-width)] p-0 border-0 bg-transparent shadow-none
  `,
  dropdownMenu: `
    bg-dusk-600/95 backdrop-blur-sm border border-sunset-500/50
    rounded-2xl shadow-xl ring-1 ring-sunset-600/30
    max-h-64 overflow-y-auto
  `,
  dropdownItem: `
    w-full px-4 py-3 text-lg text-white text-right
    hover:bg-sunset-600/30 hover:text-sunset-100
    
    transition-all duration-150
    border-b border-sunset-500/20 last:border-b-0
    first:rounded-t-2xl last:rounded-b-2xl
  `,
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
};
