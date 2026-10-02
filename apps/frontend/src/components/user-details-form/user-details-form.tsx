import { useState } from 'react';
import {
  User as UserIcon,
  Settings,
  Save,
  X,
  RefreshCw,
  Trash2,
  LogOutIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  RootState,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetUserByIdQuery,
} from '@/store';
import { User } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BasicInfoSection,
  DeleteUserModal,
  PasswordResetSection,
  PermissionsSection,
} from './components';
import { useUserDetailsForm, useUserPermissions } from './hooks';
import { AdminAction } from './types';
import { LoadingSpinner } from '../loading-spinner';
import { ErrorDisplay } from '../error-display';
import { clearToken } from '@/store/slices/auth-slice';

export const UserDetailsForm: React.FC = () => {
  const { userId: paramUserId } = useParams<{ userId: User['id'] }>();
  const currentUser = useSelector(({ auth }: RootState) => auth.decodedToken);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    data: userData,
    isLoading,
    error,
  } = useGetUserByIdQuery(paramUserId ?? currentUser?.id ?? '', {
    skip: !paramUserId && (!currentUser || !currentUser.id),
  });

  const [editUser] = useEditUserMutation();
  const [deleteUserMutation] = useDeleteUserMutation();

  const permissions = useUserPermissions(currentUser, userData);

  const {
    isEditing,
    setIsEditing,
    showResetPassword,
    setShowResetPassword,
    formData,
    setFormData,
    handleInputChange,
    loading,
    setLoading,
    resetForm,
  } = useUserDetailsForm(userData);

  const handleSave = async () => {
    if (!userData) {
      return;
    }
    setLoading(true);
    try {
      const updateData: Partial<User & { password: string }> = {};

      if (
        permissions.editUsername &&
        formData.username.trim() !== userData.username
      ) {
        updateData.username = formData.username.trim();
      }

      if (
        permissions.resetPassword &&
        showResetPassword &&
        formData.newPassword.trim()
      ) {
        updateData.password = formData.newPassword.trim();
      }

      if (Object.keys(updateData).length > 0) {
        await editUser({
          userId: userData.id,
          newUser: updateData,
        }).unwrap();
        toast.success('הפרטים נשמרו בהצלחה');
      } else {
        toast.info('אין שינוי לשמירה');
      }

      setIsEditing(false);
      setShowResetPassword(false);
      setFormData((prev) => ({ ...prev, newPassword: '' }));
    } catch (e) {
      const msg =
        (e as { data: { message: string } }).data.message ||
        'אופס! משהו השתבש, לא הצלחנו לעדכן את הפרטים...';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    dispatch(clearToken());
    navigate('/login');
  };

  const handleDeleteUser = async () => {
    if (!userData || !permissions.deleteUser) {
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteUserMutation(userData.id).unwrap();
      toast.success('המשתמש נמחק בהצלחה');
      setShowDeleteModal(false);
      logout();
    } catch (e) {
      const msg =
        (e as { data: { message: string } }).data.message ||
        'אופס! משהו השתבש, לא הצלחנו למחוק את המשתמש...';
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAdminAction = async (type: AdminAction, nextValue: boolean) => {
    if (!permissions.editAdminFields || !userData) {
      return;
    }

    const patch: Partial<User> = {};

    if (type === AdminAction.TOGGLE_ADMIN) {
      patch.isAdmin = nextValue;
    }
    if (type === AdminAction.TOGGLE_PNG) {
      patch.isPersonaNonGrata = nextValue;
    }

    try {
      await editUser({ userId: userData.id, newUser: patch }).unwrap();
      toast.success('הפעולה בוצעה בהצלחה');
    } catch (e) {
      const msg =
        (e as { data: { message: string } }).data.message ||
        'אופס! משהו השתבש, לא הצלחנו לבצע את הפעולה...';
      toast.error(msg);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (error || !userData) {
    return <ErrorDisplay />;
  }

  return (
    <>
      <div className="p-6" dir="rtl">
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    פרטי משתמש
                  </h1>
                  <p className="text-white/70">צפייה ועריכת פרטי המשתמש</p>
                </div>
              </div>
              {!isEditing ? (
                <div className="flex flex-col lg:flex-row gap-3">
                  {permissions.deleteUser && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <Settings className="w-5 h-5" />
                        ערוך פרטים
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                        מחק פרופיל
                      </button>
                      <button
                        onClick={() => logout()}
                        className="flex items-center gap-2 bg-gradient-to-r from-red-400 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <LogOutIcon className="w-5 h-5" />
                        התנתק
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {loading ? 'שומר...' : 'שמור'}
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                    בטל
                  </button>
                  {permissions.deleteUser && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                      מחק פרופיל
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <BasicInfoSection
                  userData={userData}
                  isEditing={isEditing}
                  canEditUsername={permissions.editUsername}
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
                <PasswordResetSection
                  canResetPassword={permissions.resetPassword}
                  showResetPassword={showResetPassword}
                  setShowResetPassword={setShowResetPassword}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  isEditing={isEditing}
                />
              </div>
              <div className="space-y-6">
                <PermissionsSection
                  userData={userData}
                  canEditAdminFields={permissions.editAdminFields}
                  onAdminAction={handleAdminAction}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        isLoading={deleteLoading}
      />
    </>
  );
};
