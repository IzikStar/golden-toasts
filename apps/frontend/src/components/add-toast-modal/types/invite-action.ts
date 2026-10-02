export enum InviteActionsEnum {
  CREATE,
  DELETE,
}

export type InviteAction = {
  type: InviteActionsEnum;
  userId: string;
  inviteId?: string;
};
