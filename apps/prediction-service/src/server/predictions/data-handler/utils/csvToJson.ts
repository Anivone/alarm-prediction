import csv from "csvtojson/index";

export const csvToJson = async (
  filePath: string
): Promise<Record<string, string>[]> => await csv().fromFile(filePath);
