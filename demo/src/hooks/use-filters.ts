import { useState, useEffect } from 'react';
import { createFilter, FilterInstance } from 'cc-gram';

interface useFiltersOptions {
  initialFilterName?: string;
}

export const useFilters = ({
  initialFilterName = '',
}: useFiltersOptions = {}): {
  selectedFilterName: string;
  setSelectedFilterName: React.Dispatch<React.SetStateAction<string>>;
  filter: FilterInstance;
} => {
  const [selectedFilterName, setSelectedFilterName] = useState(initialFilterName);

  const filter = createFilter({ init: false });

  useEffect(() => {
    filter.applyFilter();
  }, [selectedFilterName]);

  return {
    selectedFilterName,
    setSelectedFilterName,
    filter,
  };
};

export default useFilters;
