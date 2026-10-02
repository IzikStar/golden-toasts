import { FC, useState } from 'react';
import { AccusationData } from '@/types';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserCard } from '../user';
import { DeleteAccusationModal } from './components';
import { Toast } from '../toast';

type Props = {
  accusation: AccusationData;
};

export const Accusation: FC<Props> = ({ accusation }) => {
  const { reporter, reason, updatedAt, crimeToast } = accusation;

  const [isAccusationOpen, setIsAccusationOpen] = useState(false);

  const formattedDate = new Date(updatedAt).toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      dir="rtl"
      className={cn(
        `w-full ${
          !isAccusationOpen && 'h-fit'
        } bg-red-900 text-red-100 border border-red-700 rounded-2xl shadow-md transition-all duration-300`
      )}
      onClick={() => setIsAccusationOpen((prev) => !prev)}
    >
      <div
        className={`flex items-start justify-between px-6 py-4 ${
          crimeToast && 'cursor-pointer'
        }`}
      >
        <div className="flex flex-col gap-1 flex-grow">
          <h2 className="text-xl font-bold text-red-300">האשמה</h2>
          <div className="w-fit">
            <span className="text-sm text-red-200">מאשים: </span>
            <UserCard
              user={reporter}
              variant="inline"
              className="text-sm text-red-100"
            />
          </div>
          <p className="text-sm text-red-200">תאריך האשמה: {formattedDate}</p>
          {crimeToast && (
            <p className="text-sm text-red-300 font-medium">
              שתייה שלא בוצעה: {crimeToast.title}
            </p>
          )}
          {reason && (
            <p className="text-sm mt-1">
              <strong className="text-red-300">{`סיבת האשמה: `}</strong>
              {reason}
            </p>
          )}
        </div>
        <div onClick={(event) => event.stopPropagation()}>
          <DeleteAccusationModal
            id={accusation.id}
            reporter={accusation.reporter}
            reason={reason}
          />
        </div>

        {crimeToast && (
          <ChevronDown
            tabIndex={0}
            className={cn(
              'text-red-300 transition-transform duration-300 mt-1 hover:text-red-500',
              isAccusationOpen && 'rotate-180'
            )}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setIsAccusationOpen((prev) => !prev);
              }
            }}
          />
        )}
      </div>
      {crimeToast && (
        <div
          onClick={(event) => event.stopPropagation()}
          className={cn(
            'flex flex-col gap-4 text-sm',
            isAccusationOpen
              ? 'transition-all duration-500 px-6 pb-6 opacity-100 h-auto pointer-events-auto'
              : 'opacity-0 h-0 pointer-events-none transition-none'
          )}
        >
          {isAccusationOpen && (
            <>
              {reason && (
                <div>
                  <strong className="text-red-300">סיבת האשמה:</strong> {reason}
                </div>
              )}
              {crimeToast && (
                <div className="flex flex-col gap-3">
                  <strong className="text-red-300">
                    פרטי השתייה שלא בוצעה:
                  </strong>
                  <Toast toast={crimeToast} />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
