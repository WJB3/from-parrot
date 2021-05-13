export interface Dictionary {
  id: number;
  dicName: string;
  dicCode: string;
  sort?: number;
  defaultStatus?: 0 | 1;
  list?: DictionaryValue[];
}

export interface DictionaryValue {
  id: number;
  dicCode: string;
  name: string;
  photo?: string;
  sort: number;
  defaultStatus?: 0 | 1;
  useStatus: 0 | 1;
  value: any;
}
