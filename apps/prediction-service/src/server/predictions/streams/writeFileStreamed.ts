import fs from "fs";
import { getCsvFilePath } from "../../../data-manager/reports/utils/file/csv";

export const writeCsvFileStreamed = (
  rows: string[],
  columns: string,
  fileName: string
) => {
  const filePath = getCsvFilePath(`${fileName}`);

  try {
    fs.accessSync(filePath);
  } catch (error) {
    fs.writeFileSync(filePath, columns + "\n");
  }

  const writeStream = fs.createWriteStream(filePath, {
    flags: "a",
  });

  for (const row of rows) {
    writeStream.write(row + "\n");
  }

  writeStream.end(() => {
    console.log(`${fileName} has successfully been updated`);
  })

  writeStream.on("error", (err) => {
    throw err;
  });
};
