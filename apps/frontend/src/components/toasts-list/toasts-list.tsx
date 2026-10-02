import { ToastData } from '@/types';
import { FC, useState } from 'react';
import { Toast } from '../toast/toast';
import { toastListStyles } from './styles.consts';
import { ToastsListSkeleton } from './components';
import { AddToastOpener } from './components/add-toast-opener';
import { ErrorDisplay } from '../error-display';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { ChevronDown, Search } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useFilteredToasts from './hooks/use-filtered-toasts';

export type ToastListData = {
  toasts: ToastData[];
  title: string;
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError;
  emptyMessage?: string;
};

type Props =
  | {
      lists: ToastListData[];
      showAddButton?: boolean;
    }
  | (ToastListData & {
      showAddButton?: boolean;
    });

export const ToastsList: FC<Props> = (props) => {
  const [selectedListIndex, setSelectedListIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isMultipleListsMode = 'lists' in props;
  const lists = isMultipleListsMode
    ? props.lists
    : [
        {
          toasts: props.toasts,
          title: props.title,
          isLoading: props.isLoading,
          error: props.error,
          emptyMessage:
            props.emptyMessage || 'אין כרגע שתיות באופק... איזה מדור יבשן',
        },
      ];

  const showAddButton = props.showAddButton ?? false;
  const currentList = lists[selectedListIndex];

  const filteredToasts = useFilteredToasts(currentList.toasts, searchTerm);

  const renderToasts = () => {
    return filteredToasts.map((toast) => (
      <Toast key={toast.id} toast={toast} />
    ));
  };

  const handleListChange = (index: number) => {
    setSelectedListIndex(index);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const renderTitle = () => {
    if (lists.length <= 1) {
      return (
        <h1 className={toastListStyles.title}>
          {currentList.title}
          <span
            className={toastListStyles.emojiPulse}
            role="img"
            aria-label="toast-icon"
          >
            🍻
          </span>
        </h1>
      );
    }

    return (
      <div className={toastListStyles.dropdownContainer}>
        <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <PopoverTrigger asChild>
            <button
              className={toastListStyles.dropdownButton}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              <span className={toastListStyles.dropdownButtonText}>
                {currentList.title}
                <span
                  className={toastListStyles.emojiPulse}
                  role="img"
                  aria-label="toast-icon"
                >
                  🍻
                </span>
              </span>
              <ChevronDown
                className={
                  toastListStyles.dropdownArrow +
                  (isDropdownOpen && ' ' + toastListStyles.dropdownArrowOpen)
                }
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className={toastListStyles.popoverContent}
            align="center"
            sideOffset={8}
          >
            <div className={toastListStyles.dropdownMenu} role="listbox">
              {lists.map((list, index) => (
                <button
                  key={index}
                  className={toastListStyles.dropdownItem}
                  onClick={() => handleListChange(index)}
                  role="option"
                  aria-selected={index === selectedListIndex}
                >
                  {list.title}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  const renderSearchBar = () => {
    if (currentList.toasts.length === 0) {
      return null;
    }

    return (
      <div className={toastListStyles.searchContainer}>
        <div className={toastListStyles.searchWrapper}>
          <Search className={toastListStyles.searchIcon} />
          <input
            type="text"
            placeholder="חפש שתייה..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={toastListStyles.searchInput}
          />
        </div>
      </div>
    );
  };

  return (
    <section className={toastListStyles.container}>
      {renderTitle()}
      {renderSearchBar()}

      <div
        style={{
          direction: 'ltr',
        }}
        className={toastListStyles.listWrapper}
        aria-live="polite"
        aria-relevant="additions"
      >
        {currentList.isLoading ? (
          <ToastsListSkeleton title={currentList.title} />
        ) : currentList.error ? (
          <div className={toastListStyles.errorWrapper}>
            <ErrorDisplay />
          </div>
        ) : filteredToasts.length ? (
          renderToasts()
        ) : searchTerm ? (
          <p className={toastListStyles.noToastMessage}>
            לא נמצאו תוצאות עבור "{searchTerm}". נסה טקסט חיפוש אחר
          </p>
        ) : (
          <p className={toastListStyles.noToastMessage}>
            {currentList.emptyMessage || 'אין שתיות להצגה'}
          </p>
        )}
      </div>
      {showAddButton && (
        <div className={toastListStyles.addButtonWrapper}>
          <AddToastOpener />
        </div>
      )}
    </section>
  );
};
