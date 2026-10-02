import { ErrorType } from '@/types';

const getStatusFromError = (error: ErrorType): number | undefined => {
  if (typeof error === 'object' && error !== null) {
    if ('status' in error && typeof error.status === 'number') {
      return error.status;
    }
    if (
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response
    ) {
      return error.response.status as number;
    }
  }
  return undefined;
};

export const getErrorMessage = (error: ErrorType): string => {
  const status = getStatusFromError(error);

  switch (status) {
    case 400:
      return 'בקשה שגויה. אנא בדוק את הפרטים שהזנת';
    case 401:
      return 'שם משתמש או סיסמא שגויים';
    case 403:
      return 'אין לך הרשאה לבצע פעולה זו';
    case 404:
      return 'המשאב המבוקש לא נמצא';
    case 409:
      return 'שם המשתמש כבר קיים במערכת';
    case 422:
      return 'הפרטים שהזנת אינם תקינים';
    case 429:
      return 'יותר מדי ניסיונות. אנא נסה שוב מאוחר יותר';
    case 500:
      return 'שגיאה פנימית בשרת. אנא נסה שוב מאוחר יותר';
    case 502:
      return 'השרת אינו זמין כרגע. אנא נסה שוב מאוחר יותר';
    case 503:
      return 'השירות אינו זמין כרגע. אנא נסה שוב מאוחר יותר';
    case 504:
      return 'תם הזמן הקצוב לבקשה. אנא נסה שוב';
    default:
      return 'אירעה שגיאה לא צפויה. אנא נסה שוב';
  }
};

export const getAuthErrorMessage = (
  error: ErrorType,
  action: 'login' | 'signup'
): string => {
  const status = getStatusFromError(error);

  switch (status) {
    case 401:
      return action === 'login'
        ? 'שם משתמש או סיסמא שגויים'
        : 'פרטי ההרשמה שגויים';
    case 409:
      return action === 'signup'
        ? 'שם המשתמש כבר תפוס. בחר שם משתמש אחר'
        : 'קיימת בעיה עם הנתונים';
    case 422:
      return action === 'login'
        ? 'פרטי ההתחברות אינם תקינים'
        : 'פרטי ההרשמה אינם תקינים';
    default:
      return getErrorMessage(error);
  }
};
