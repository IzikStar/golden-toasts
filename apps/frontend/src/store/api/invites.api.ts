import { InviteData } from '@/types';
import { api } from './api';

export const invitesApi = api.injectEndpoints({
  endpoints: (build) => ({
    createInvite: build.mutation<
      InviteData,
      Omit<InviteData, 'id' | 'isConfirmed' | 'invitee' | 'toast'>
    >({
      query: (invite) => ({
        url: 'invites',
        method: 'POST',
        body: {
          receiverId: invite.inviteeId,
          toastId: invite.toastId,
        },
      }),
      invalidatesTags: ['Invite', 'FutureToasts'],
    }),
    deleteInvite: build.mutation<number, string>({
      query: (InviteId) => ({
        url: `invites/${InviteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invite', 'FutureToasts'],
    }),
    updateInviteStatus: build.mutation<
      InviteData,
      { inviteId: string; isConfirmed: boolean }
    >({
      query: ({ inviteId, isConfirmed }) => ({
        url: `/invites/${inviteId}`,
        method: 'PUT',
        body: { isConfirmed },
      }),
      invalidatesTags: ['Invite', 'FutureToasts'],
    }),
    getReceiverPendingInvites: build.query<InviteData[], string>({
      query: (userId) => ({
        url: `/invites/receiver/${userId}/pending`,
        method: 'GET',
      }),
      providesTags: ['Invite'],
    }),
    getSenderInvites: build.query<InviteData[], string>({
      query: (userId) => ({
        url: `invites/sender/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Invite'],
    }),
    getInvitesByRelatedToast: build.query<InviteData[], string>({
      query: (toastId) => ({
        url: `invites/toast/${toastId}`,
        method: 'GET',
      }),
      providesTags: ['Invite'],
    }),
  }),
});

export const {
  useCreateInviteMutation,
  useDeleteInviteMutation,
  useGetInvitesByRelatedToastQuery,
  useGetReceiverPendingInvitesQuery,
  useGetSenderInvitesQuery,
  useUpdateInviteStatusMutation,
} = invitesApi;
