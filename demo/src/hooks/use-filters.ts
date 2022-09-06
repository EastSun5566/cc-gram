import { useState, useEffect } from 'react';
import { filter } from '../filter';

interface useFiltersOptions {
  initialValue?: string;
  selectors?: string;
}

export const useFilters = ({
  initialValue = '',
  selectors,
}: useFiltersOptions = {}): [
  string,
  React.Dispatch<React.SetStateAction<string>>
] => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    filter.applyFilter(selectors);
  }, [value]);

  return [value, setValue];
};

export default useFilters;
