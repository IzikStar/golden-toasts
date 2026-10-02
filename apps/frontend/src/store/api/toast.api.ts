import { ToastData, User, UserWithToastsCount } from '@/types';
import { api } from './api';

export const toastApi = api.injectEndpoints({
  endpoints: (build) => ({
    createToast: build.mutation<
      ToastData,
      { toast: Omit<ToastData, 'id' | 'creator'>; invites: User['id'][] }
    >({
      query: (toast) => ({
        url: 'toasts',
        method: 'POST',
        body: toast,
      }),
      invalidatesTags: ['Toast', 'Invite'],
    }),
    editToast: build.mutation<
      ToastData,
      { toastId: string; newToast: Partial<ToastData> }
    >({
      query: ({ toastId, newToast }) => ({
        url: `toasts/${toastId}`,
        method: 'PUT',
        body: newToast,
      }),
      invalidatesTags: ['Toast', 'Invite'],
    }),
    deleteToast: build.mutation<number, string>({
      query: (toastId) => ({
        url: `toasts/${toastId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Toast', 'Accusation', 'Invite'],
    }),
    getAllToasts: build.query<ToastData[], void>({
      query: () => ({
        url: 'toasts',
        method: 'GET',
      }),
      providesTags: ['Toast', 'PendingToasts'],
    }),
    getPendingToasts: build.query<ToastData[], void>({
      query: () => ({
        url: 'toasts/waiting-for-approval',
        method: 'GET',
      }),
      providesTags: ['Toast', 'PendingToasts'],
    }),
    getFutureToasts: build.query<ToastData[], string>({
      query: (userId) => ({
        url: `toasts/future-toasts/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Toast', 'PendingToasts', 'FutureToasts'],
    }),
    getUserToasts: build.query<ToastData[], string>({
      query: (userId) => ({
        url: `toasts/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Toast', 'PendingToasts'],
    }),
    getRecord: build.query<number, void>({
      query: () => ({
        url: 'toasts/record',
        method: 'GET',
      }),
      providesTags: ['Toast'],
    }),
    getCurrentPeriodToastsAmount: build.query<
      { users: UserWithToastsCount[]; total: number },
      void
    >({
      query: () => ({
        url: `toasts/current-period-toasts-amount`,
        method: 'GET',
      }),
      providesTags: ['Toast', 'User', 'Accusation'],
    }),
  }),
});

export const {
  useCreateToastMutation,
  useDeleteToastMutation,
  useEditToastMutation,
  useGetAllToastsQuery,
  useGetCurrentPeriodToastsAmountQuery,
  useGetFutureToastsQuery,
  useGetPendingToastsQuery,
  useGetUserToastsQuery,
  useGetRecordQuery,
} = toastApi;
