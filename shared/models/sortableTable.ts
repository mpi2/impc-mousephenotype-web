export type TableHeader = {
  width: number;
  label: string;
  field?: string;
  sortFn?: (any) => void;
  disabled?: boolean;
  sortField?: string;
  children?: TableHeader[];
};