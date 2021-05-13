export interface CreateDictionaryDto {
  id?: number;
  dicName: string;
  dicCode: string;
  seq?: number;
}

export interface CreateDictionaryValueDto {
  id?: number;
  dicCode: string;
  name: string;
  seq?: number;
  value: number | string;
  /* 
    0:是 1:否
  */
  useStatus: 0 | 1;
}
