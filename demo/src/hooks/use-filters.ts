import { useState, useEffect } from 'react';

// TODO
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createFilter, FilterInstance } from '../../../dist/index.esm';

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
