import { CredentialsForm } from '@/components/credentials-form/credentials-form';
import { useSignupMutation } from '@/store';
import { setToken } from '@/store/slices/auth-slice';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getAuthErrorMessage } from '@/utils';

export const Signup: FC = () => {
  const [signup, { isLoading }] = useSignupMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async (username: string, password: string) => {
    try {
      setSubmitError(null);
      const result = await signup({ username, password }).unwrap();
      dispatch(setToken(result.accessToken));
      navigate('/');
      toast.success('נרשמת בהצלחה!');
    } catch (error: unknown) {
      const errorMessage = getAuthErrorMessage(error, 'signup');
      setSubmitError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-sun-gradient relative overflow-hidden z-0">
      <CredentialsForm
        onSubmit={handleSignup}
        formName="signup"
        isLoading={isLoading}
        submitError={submitError}
      />
    </div>
  );
};
