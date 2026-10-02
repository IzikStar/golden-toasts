import { useState, useEffect } from 'react';

const HEBREW_WARNING_MESSAGES = [
  '🚨אזהרה: משתמש בעייתי באזור!🚨',
  '💀זכויות המשתמש בוטלו לצמיתות',
  '🎭פרסונה נון גרטה מזוהה!',
  '⛔החשבון נחסם על ידי הממשלה',
];
const WARNING_MESSAGE_INTERVAL = 2000;

const getRandomMessage = () => {
  const randomIndex = Math.floor(
    Math.random() * HEBREW_WARNING_MESSAGES.length
  );
  return HEBREW_WARNING_MESSAGES[randomIndex];
};

export const useWarningMessageRotation = () => {
  const [currentMessage, setCurrentMessage] = useState(
    HEBREW_WARNING_MESSAGES[0]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(getRandomMessage());
    }, WARNING_MESSAGE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return currentMessage;
};
