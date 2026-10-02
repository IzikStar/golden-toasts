export const styles = {
  container: 'min-h-screen bg-sun-gradient relative overflow-hidden z-0',
  background: {
    wrapper: 'absolute inset-0',
    lightTopLeft:
      'absolute top-20 left-20 w-32 h-32 bg-floating-light rounded-full animate-pulse',
    mediumTopRight:
      'absolute top-60 right-32 w-24 h-24 bg-floating-medium rounded-full animate-bounce',
    subtleBottomLeft:
      'absolute bottom-32 left-1/4 w-40 h-40 bg-floating-subtle rounded-full animate-pulse',
    lightBottomRight:
      'absolute bottom-60 right-20 w-20 h-20 bg-floating-light rounded-full animate-bounce',
  },
  content: {
    wrapper:
      'relative z-10 flex flex-col items-center justify-center h-full p-8',
  },
  heroText: {
    container: (isLoaded: boolean) =>
      `text-center mb-16 transition-all duration-1000 transform ${
        isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
      }`,
    title: 'text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg',
    gradientSpan:
      'mx-4 bg-gradient-to-b from-white to-sunrise-300 bg-clip-text text-transparent',
    subtitle:
      'text-2xl md:text-3xl text-white/80 font-medium leading-relaxed max-w-4xl mx-auto drop-shadow-md',
  },
  card: {
    container: (isLoaded: boolean) =>
      `transition-all duration-1000 delay-500 transform ${
        isLoaded
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-10 opacity-0 scale-95'
      }`,
    box: 'bg-orange-300 backdrop-blur-sm p-6 rounded-3xl shadow-warm w-full max-w-md text-center border border-white border-opacity-20 hover:shadow-2xl hover:scale-105 transition-all duration-300 transform',
    iconWrapper:
      'w-20 h-20 bg-gradient-to-br from-sunrise-400 to-sunset-500 rounded-full flex items-center justify-center mx-auto shadow-soft',
    title: 'text-2xl font-bold mb-8 text-white leading-relaxed',
    button: {
      base: 'group relative w-full bg-gradient-to-r from-sunrise-500 to-sunset-600 text-white py-4 px-8 my-2 rounded-2xl font-bold text-lg shadow-warm hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden',
      shine:
        'absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700',
      content: 'relative flex items-center justify-center gap-3',
      icon: 'text-4xl group-hover:translate-x-1 transition-transform duration-300',
    },
  },
  footer: {
    text: (isLoaded: boolean) =>
      `text-3xl md:text-4xl font-bold text-white mt-10 text-center transition-all duration-1000 delay-1000 transform ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
      }`,
  },
  shared: {
    emojiPulse: 'inline-block animate-pulse',
  },
};
