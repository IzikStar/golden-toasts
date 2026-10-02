import { useLoginMutation } from '@/store/api/auth.api';
import { useDispatch } from 'react-redux';
import { setToken } from '@/store/slices/auth-slice';
import { useNavigate } from 'react-router-dom';
import { CredentialsForm } from '@/components/credentials-form/credentials-form';
import { toast } from 'sonner';
import { useState } from 'react';
import { getAuthErrorMessage } from '@/utils';

export const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    try {
      setSubmitError(null);
      const result = await login({ username, password }).unwrap();
      dispatch(setToken(result.accessToken));
      navigate('/');
      toast.success('התחברת בהצלחה!');
    } catch (error: unknown) {
      const errorMessage = getAuthErrorMessage(error, 'login');
      setSubmitError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-sun-gradient relative overflow-hidden z-0">
      <CredentialsForm
        onSubmit={handleLogin}
        formName="login"
        isLoading={isLoading}
        submitError={submitError}
      />
    </div>
  );
};
