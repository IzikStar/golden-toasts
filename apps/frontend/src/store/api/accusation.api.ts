import { AccusationData } from '@/types';
import { api } from './api';

export const accusationApi = api.injectEndpoints({
  endpoints: (build) => ({
    createAccusation: build.mutation<
      AccusationData,
      Omit<
        AccusationData,
        'id' | 'crimeToast' | 'accusedUser' | 'reporter' | 'updatedAt'
      >
    >({
      query: (accusation) => ({
        url: 'accusations',
        method: 'POST',
        body: accusation,
      }),
      invalidatesTags: ['Accusation', 'PendingToasts'],
    }),
    deleteAccusation: build.mutation<number, string>({
      query: (accusationId) => ({
        url: `accusations/${accusationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Accusation', 'PendingToasts'],
    }),
    getUserAccusations: build.query<AccusationData[], string>({
      query: (userId) => ({
        url: `accusations/user/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Accusation', 'Toast'],
    }),
    getReporterAccusations: build.query<AccusationData[], string>({
      query: (adminId) => ({
        url: `accusations/admin/${adminId}`,
        method: 'GET',
      }),
      providesTags: ['Accusation', 'Toast'],
    }),
  }),
});

export const {
  useCreateAccusationMutation,
  useDeleteAccusationMutation,
  useGetReporterAccusationsQuery,
  useGetUserAccusationsQuery,
} = accusationApi;
