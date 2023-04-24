import path from "path";

export const getDataFilePath = (filename: string) =>
  path.join(process.cwd(), "data", filename);