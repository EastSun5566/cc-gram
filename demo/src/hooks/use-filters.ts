import { useState, useEffect } from 'react';
import { cg } from '../filter';

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
    cg.applyFilter(selectors);
  }, [value]);

  return [value, setValue];
};

export default useFilters;
