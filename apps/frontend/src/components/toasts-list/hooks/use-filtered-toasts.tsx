import { ToastData } from '@/types';
import { useMemo } from 'react';

const useFilteredToasts = (toasts: ToastData[], searchTerm: string) => {
  const filteredToasts = useMemo(() => {
    if (!searchTerm.trim()) {
      return toasts;
    }

    const searchLower = searchTerm.toLowerCase().trim();

    const filterToast = (toast: ToastData) => {
      const searchableFields = [
        toast.title,
        toast.reason,
        toast.location,
        toast.customLocation,
        toast.creator.username,
        toast.foods?.join(' '),
        toast.drinks?.join(' '),
      ];

      return searchableFields.some((field) =>
        field?.toLowerCase().includes(searchLower)
      );
    };

    const sortToasts = (a: ToastData, b: ToastData) => {
      const searchFields = [
        { getter: (toast: ToastData) => toast.title, priority: 1 },
        { getter: (toast: ToastData) => toast.creator.username, priority: 2 },
        { getter: (toast: ToastData) => toast.reason, priority: 3 },
        { getter: (toast: ToastData) => toast.location, priority: 4 },
        { getter: (toast: ToastData) => toast.customLocation, priority: 5 },
      ];

      for (const { getter } of searchFields) {
        const aValue = getter(a)?.toLowerCase() || '';
        const bValue = getter(b)?.toLowerCase() || '';

        const aStarts = aValue.startsWith(searchLower);
        const bStarts = bValue.startsWith(searchLower);

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        const aIncludes = aValue.includes(searchLower);
        const bIncludes = bValue.includes(searchLower);

        if (aIncludes && !bIncludes) return -1;
        if (!aIncludes && bIncludes) return 1;
      }

      return 0;
    };

    return toasts.filter(filterToast).sort(sortToasts);
  }, [toasts, searchTerm]);

  return filteredToasts;
};

export default useFilteredToasts;
