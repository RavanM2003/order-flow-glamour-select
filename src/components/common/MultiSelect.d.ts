
import { ReactNode } from 'react';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  selected?: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  children?: ReactNode;
}

export default function MultiSelect(props: MultiSelectProps): JSX.Element;
