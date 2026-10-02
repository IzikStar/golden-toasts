import { User } from '@/types';
import { api } from './api';
import { Credentials } from '@/types';

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    signup: build.mutation<{ accessToken: string }, Credentials>({
      query: (credentials) => ({
        url: 'users',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    editUser: build.mutation<User, { userId: string; newUser: Partial<User> }>({
      query: ({ userId, newUser }) => ({
        url: `users/${userId}`,
        method: 'PUT',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: build.mutation<number, string>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getAllUsers: build.query<User[], void>({
      query: () => ({
        url: 'users',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    getUserById: build.query<User, string>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    getCriminals: build.query<User[], void>({
      query: () => ({
        url: 'users/criminals',
        method: 'GET',
      }),
      providesTags: ['Accusation', 'User'],
    }),
    getCurrentPeriodToastsAmount: build.query<number, string>({
      query: (userId) => ({
        url: `users/${userId}/current-period-toasts-amount`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useSignupMutation,
  useGetAllUsersQuery,
  useGetCriminalsQuery,
  useEditUserMutation,
  useGetCurrentPeriodToastsAmountQuery,
  useDeleteUserMutation,
  useGetUserByIdQuery,
} = userApi;
