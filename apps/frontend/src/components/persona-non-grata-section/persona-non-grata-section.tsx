import { FC } from 'react';
import {
  ActionButtons,
  AnimatedBannerDisplay,
  DisclaimerText,
  PersonaNonGrataHeader,
  StatusMessage,
  WarningMessageBox,
} from './components';
import { useBannerRotation, useWarningMessageRotation } from './hooks';

type PersonaNonGrataProps = {
  username: string;
  isCurrentUser?: boolean;
};

export const PersonaNonGrataSection: FC<PersonaNonGrataProps> = ({
  username,
  isCurrentUser = true,
}) => {
  const currentBannerEmoji = useBannerRotation();
  const currentWarningMessage = useWarningMessageRotation();

  return (
    <div className="relative w-[90%] md:w-full h-[90%] rounded-3xl overflow-hidden bg-gradient-to-br from-red-900 via-black to-red-800 ring-4 ring-error shadow-2xl">
      <div className="h-full w-full scrollbar-styled [scrollbar-gutter:stable_both-edges] overflow-hidden overflow-y-auto px-3 md:px-4 py-1 max-w-screen-md mx-auto text-center transition-all duration-300">
        <div className="pb-5">
          <div className="mb-2 overflow-visible">
            <PersonaNonGrataHeader />
          </div>

          <div className="bg-black/80 border border-red-700/60 rounded-xl p-3 md:p-4 mb-2 rotate-1 shadow-xl backdrop-blur-sm">
            <WarningMessageBox message={currentWarningMessage} />
            <AnimatedBannerDisplay emoji={currentBannerEmoji} />
            <StatusMessage isCurrentUser={isCurrentUser} username={username} />

            {isCurrentUser && <ActionButtons username={username} />}
          </div>

          <DisclaimerText />
        </div>
      </div>
    </div>
  );
};

export default PersonaNonGrataSection;
