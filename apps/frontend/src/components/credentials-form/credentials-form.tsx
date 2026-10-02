import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../input';
import { toast } from 'sonner';
import { ArrowLeftIcon } from 'lucide-react';

type CredentialsFormProps = {
  onSubmit: (username: string, password: string) => Promise<void>;
  formName: 'login' | 'signup';
  isLoading?: boolean;
  submitError?: string | null;
};

export const CredentialsForm = ({
  onSubmit,
  formName,
  isLoading = false,
  submitError = null,
}: CredentialsFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  const navigate = useNavigate();

  const validateUsername = (value: string) => {
    if (!value.trim()) {
      return 'שם משתמש הוא שדה חובה';
    }
    if (value.length < 3) {
      return 'שם משתמש חייב להכיל לפחות 3 תווים';
    }

    const hebrewAndDigitsRegex =
      /^[\u0590-\u05FF\d\s\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+$/;
    if (!hebrewAndDigitsRegex.test(value)) {
      return 'שם משתמש חייב להכיל רק אותיות בעברית';
    }

    const words = value.trim().split(/\s+/);
    if (words.length < 2) {
      return 'שם משתמש חייב להכיל לפחות שתי מילים';
    }

    const hasHebrewLetters = words.some((word) => /[\u0590-\u05FF]/.test(word));
    if (!hasHebrewLetters) {
      return 'שם משתמש חייב להכיל לפחות אות עברית אחת';
    }

    return null;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return 'סיסמא היא שדה חובה';
    }
    if (value.length < 8) {
      return 'סיסמא חייבת להכיל לפחות 8 תווים';
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;
    if (!passwordRegex.test(value)) {
      return 'הסיסמא חייבת להכיל לפחות אות אנגלית אחת גדולה, אחת קטנה, וספרה אחת';
    }
    return null;
  };

  const validateConfirmPassword = (value: string, originalPassword: string) => {
    if (!value) {
      return 'אישור סיסמא הוא שדה חובה';
    }
    if (value !== originalPassword) {
      return 'הסיסמאות לא תואמות';
    }
    return null;
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUsername(value);
    setUsernameError(validateUsername(value));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));

    if (formName === 'signup' && confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword, value));
    }
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(validateConfirmPassword(value, password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usernameValidation = validateUsername(username);
    const passwordValidation = validatePassword(password);
    let confirmPasswordValidation = null;

    if (formName === 'signup') {
      confirmPasswordValidation = validateConfirmPassword(
        confirmPassword,
        password
      );
    }

    setUsernameError(usernameValidation);
    setPasswordError(passwordValidation);
    if (formName === 'signup') {
      setConfirmPasswordError(confirmPasswordValidation);
    }

    if (usernameValidation || passwordValidation || confirmPasswordValidation) {
      return;
    }

    try {
      await onSubmit(username, password);
    } catch (error) {
      toast((error as Error).message);
    }
  };

  const hasValidationErrors =
    usernameError || passwordError || confirmPasswordError;
  const isSubmitDisabled = isLoading || !!hasValidationErrors;

  return (
    <div className="flex items-center justify-center h-screen text-white">
      <div
        dir="ltr"
        className="bg-orange-300 max-h-[95vh] rounded-3xl backdrop-blur-sm p-8 
                   border border-white border-opacity-20 transition-all duration-300 
                   transform shadow-warm hover:shadow-2xl hover:scale-105 w-96
                   overflow-hidden"
      >
        <div
          className="max-h-[calc(95vh-4rem)] overflow-y-auto scrollbar-theme 
                     [scrollbar-gutter:stable_both-edges] -m-8 p-8"
        >
          <div className="flex flex-col gap-6" dir="rtl">
            <h2
              className="text-2xl md:text-3xl text-white/80 font-medium 
                           leading-relaxed max-w-4xl mx-auto drop-shadow-md"
            >
              {formName === 'login' ? 'התחברות' : 'הרשמה'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <Input
                type="text"
                label="שם משתמש"
                placeholder="שם משתמש..."
                value={username}
                error={usernameError}
                onChange={handleUsernameChange}
              />

              <Input
                type="password"
                label="סיסמא"
                placeholder="סיסמא..."
                value={password}
                error={passwordError}
                onChange={handlePasswordChange}
              />

              {formName === 'signup' && (
                <Input
                  type="password"
                  label="אישור סיסמא"
                  placeholder="אישור סיסמא..."
                  value={confirmPassword}
                  error={confirmPasswordError}
                  onChange={handleConfirmPasswordChange}
                />
              )}

              {submitError ? (
                <div
                  className="bg-red-50 border border-red-200 rounded-md p-2 
                               text-red-700 text-xs text-center"
                >
                  {submitError}
                </div>
              ) : (
                <div className="h-8" />
              )}

              <div className="flex flex-col items-center justify-end h-[7rem] gap-8">
                <Button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="group relative w-full bg-gradient-to-r 
                             from-sunrise-500 to-sunset-600 text-white py-4 px-8 my-2 
                             rounded-2xl font-bold text-lg shadow-warm hover:shadow-xl 
                             transform hover:scale-105 transition-all duration-300 
                             overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r 
                                   from-transparent via-white to-transparent opacity-0 
                                   group-hover:opacity-20 transform -skew-x-12 
                                   -translate-x-full group-hover:translate-x-full 
                                   transition-all duration-700"
                  />
                  <span className="relative flex items-center justify-center gap-3">
                    <span>
                      {isLoading
                        ? formName === 'login'
                          ? 'מתחבר...'
                          : 'נרשם...'
                        : formName === 'login'
                        ? 'התחברות'
                        : 'הרשמה'}
                    </span>
                    <span
                      className="text-4xl group-hover:translate-x-1 
                                     transition-transform duration-300"
                    >
                      <ArrowLeftIcon />
                    </span>
                  </span>
                </Button>

                <div className="text-center">
                  <span className="text-sm text-white">
                    {formName === 'login'
                      ? 'אין לך חשבון? '
                      : 'יש לך כבר חשבון? '}
                    <span
                      onClick={() =>
                        navigate(formName === 'login' ? '/register' : '/login')
                      }
                      className="text-sunset-600 font-bold hover:underline cursor-pointer"
                    >
                      {formName === 'login' ? 'הרשמה' : 'התחברות'}
                    </span>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
