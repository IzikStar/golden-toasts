export const recordStyles = {
  mainContainer:
    'relative w-[90%] lg:w-full h-[90%] min-h-fit py-2 ' +
    'bg-gradient-to-br from-dusk-600/80 via-sunset-700/60 to-dusk-500/70 ' +
    'rounded-2xl shadow-lg ring-2 ring-sunset-600 ' +
    'animate-fade-soft',

  decorativeBadge:
    'absolute top-0 left-0 w-20 h-16 max-w-[28%] max-h-[20%] min-w-fit ' +
    'bg-white bg-opacity-30 rounded-tl-2xl rounded-br-2xl ' +
    'flex justify-center items-center',

  recordScoreText: 'text-white text-2xl font-bold text-center leading-none',

  contentWrapper:
    'relative w-full h-full flex flex-col items-center justify-start px-4',

  headerSection:
    'flex w-full h-24 max-h-[15%] mb-5 items-center justify-between ' +
    'text-3xl font-bold text-center leading-none',

  currentScoreText:
    'flex max-w-[80%] items-center justify-center text-center align-middle font-bold [-webkit-text-stroke:0.2px_black]',

  usersListContainer:
    'w-[95%] max-h-[85%] mb-[2%] pr-2 overflow-y-auto space-y-2 scrollbar-theme',

  usersListStyle: {
    direction: 'ltr' as const,
  },

  userRowBase:
    'flex justify-between items-center p-2 rounded-lg overflow-x-auto scrollbar-theme',

  userRowStyle: {
    direction: 'rtl' as const,
  },

  firstPlaceBackground: 'bg-medal-first',
  secondPlaceBackground: 'bg-medal-second',
  thirdPlaceBackground: 'bg-medal-third',
  otherPlacesBackground: 'bg-medal-other',

  userScoreText: 'text-xl font-extrabold p-1',

  loadingContainer:
    'flex flex-col items-center justify-start h-full px-4 animate-pulse space-y-4',
  loadingHeader: 'h-16 bg-gray-300 rounded w-3/4',
  loadingRow: 'h-6 bg-gray-300 rounded w-full',

  errorContainer: 'h-full mx-auto w-[90%] flex items-center justify-center overflow-y-auto scrollbar-theme',
  errorText: 'w-3/4',

  noDataText: 'mt-4 text-white text-center',

  ratingIconBase:
    'relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg ring-2 ring-offset-2 ring-offset-white',

  firstPlaceIcon: 'bg-gold-medal ring-gold-medal',

  secondPlaceIcon: 'bg-silver-medal ring-silver-medal',

  thirdPlaceIcon: 'bg-bronze-medal ring-bronze-medal',

  ratingIconContent: 'drop-shadow-sm animate-pulse',

  firstPlaceIconContent: 'text-gold-900',

  secondPlaceIconContent: 'text-silver-700',

  thirdPlaceIconContent: 'text-bronze-900',

  ratingBadge:
    'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white',

  firstPlaceBadge: 'bg-gold-500',

  secondPlaceBadge: 'bg-silver-600',

  thirdPlaceBadge: 'bg-bronze-600',

  ratingBadgeText: 'text-xs font-bold text-white',
};
