export type ClassNameValue =
  | ClassNameArray
  | string
  | ((currentResult: ClassNameResult) => ClassNameResult)
  | boolean
  | null
  | undefined;

export type ClassNameArray = Array<ClassNameValue>;

export type ClassNameResult = string;
