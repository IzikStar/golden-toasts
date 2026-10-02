import { AccusationsList } from '@/components/accusations-list';
import { PersonaNonGrataSection } from '@/components/persona-non-grata-section';
import { RootState, useGetUserByIdQuery } from '@/store';
import { useGetUserAccusationsQuery } from '@/store/api/accusation.api';
import { User } from '@/types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export const UserAccusations = () => {
  const { userId: paramUserId } = useParams<{ userId: User['id'] }>();
  const currentUser = useSelector(({ auth }: RootState) => auth.decodedToken);
  const {
    data: userAccusation,
    isLoading,
    error,
  } = useGetUserAccusationsQuery(paramUserId ?? currentUser?.id ?? '', {
    skip: !paramUserId && (!currentUser || !currentUser.id),
  });
  const { data: userData } = useGetUserByIdQuery(
    paramUserId ?? currentUser?.id ?? '',
    {
      skip: !paramUserId && (!currentUser || !currentUser.id),
    }
  );

  return (
    !error && (
      <div
        style={{ direction: 'rtl' }}
        className="md:h-screen flex justify-evenly items-center md:flex-row flex-col"
      >
        <div className="md:w-[45%] md:h-[85%] w-full flex justify-center items-start pt-10 md:pt-0 h-[50rem]">
          <AccusationsList
            accusations={userAccusation ?? []}
            isLoading={isLoading}
            showAddButton={!!paramUserId}
            title={paramUserId ? 'פשעים' : 'הפשעים שלי'}
          />
        </div>
        {userData?.isPersonaNonGrata && (
          <div className="md:w-[45%] md:h-[85%] w-full flex justify-center items-start pt-10 md:pt-0 h-[50rem]">
            <PersonaNonGrataSection
              username={userData.username}
              isCurrentUser={!paramUserId}
            />
          </div>
        )}
      </div>
    )
  );
};
