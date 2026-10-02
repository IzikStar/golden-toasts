import { Zap } from "lucide-react";
import { getUserDisplayName } from "../utils";

const getStatusMessage = (isCurrentUser: boolean, displayName: string) => {
  const baseMessage = isCurrentUser
    ? `היי ${displayName}, בצער לא כזה רב וביגון לא כזה קודר אנו נאלצים לבשר לך על הפיכתך`
    : 'המשתמש הזה הפך';

  return `${baseMessage} לפרסונה נון גרטה!`;
};

export const StatusMessage = ({
  isCurrentUser,
  username,
}: {
  isCurrentUser: boolean;
  username: string;
}) => {
  const displayName = getUserDisplayName(username);
  const statusMessage = getStatusMessage(isCurrentUser, displayName);

  return (
    <div className="space-y-1.5 text-sm text-gray-300 mb-2">
      <p className="flex items-center justify-center gap-1">
        <Zap className="w-4 h-4 text-yellow-400" />
        <span className="text-error font-semibold">{statusMessage}</span>
        <Zap className="w-4 h-4 text-yellow-400" />
      </p>
    </div>
  );
};
