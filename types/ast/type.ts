export type CodeMetadata = {
  repoId: string;
  path: string;
  type: "file" | "symbol";
  symbolName?: string;
  symbolType?: "function" | "class";
  startLine?: number;
  endLine?: number;
  content?: string;
};