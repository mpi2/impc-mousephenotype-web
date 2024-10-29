export type TableHeader = {
  width: number;
  label: string;
  field?: string;
  sortFn?: (any) => void;
  disabled?: boolean;
  sortField?: string;
  children?: TableHeader[];
};

export type SortType = [string | ((any) => void), "asc" | "desc"];

export type Sort = {
  field: string | undefined;
  sortFn: (any) => void | undefined;
  order: SortType[1];
};
