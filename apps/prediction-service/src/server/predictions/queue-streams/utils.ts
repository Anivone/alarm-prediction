import fs, { Stats } from "fs";

export const getStats = async (filePath: string): Promise<Stats> =>
  new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) reject(err);
      resolve(stats);
    });
  });
