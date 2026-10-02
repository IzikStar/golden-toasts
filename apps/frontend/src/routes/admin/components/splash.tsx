import React, { useEffect, useState } from 'react';

export const AdminSplash: React.FC<{ skip: () => void }> = ({ skip }) => {
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowWarning(true);
    const timer = setTimeout(() => setShowWarning(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const generateActionButton = (text: string, action: () => void) => {
    return (
      <button
        onClick={action}
        className="absolute bottom-4 left-4 bg-dusk-500 text-white px-4 py-2 rounded"
      >
        {text}
      </button>
    );
  };

  if (showWarning) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] overflow-hidden h-screen">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-white text-4xl font-bold text-center">אזהרה!</h2>
          <p className="text-white text-center">
            הקטע הבא מכיל קטעים זוהרים שעלולים לפגוע באנשים בעלי רגישות מוגברת
            לאור
          </p>
        </div>
        {generateActionButton('אישור', () => setShowWarning(false))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[9999] overflow-hidden h-screen">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-dusk-500 via-sunset-600 to-gold-400 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-0 p-0 text-center flex justify-center items-center h-[90vh] w-[90vw] overflow-y-auto scrollbar-theme">
        <h1 className="text-white text-6xl animate-wild font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 my-12 p-0 text-center">
          ברוך הבא אדמין נשגב!
          <br />
          <span className="text-4xl font-bold">תהנה מכוחך הבלתי מוגבל!</span>
        </h1>
      </div>
      {generateActionButton('דלג', skip)}
    </div>
  );
};
