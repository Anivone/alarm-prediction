import { IswReport } from "../../../types";
import { MONTHS, PARTS_OF_DAY, PIVOT_CONTENT_LENGTH, TIMES } from "./constants";

export class DateManager {
  public static extractDateFromReport(report: IswReport): string {
    const pivotContent = report.content.slice(0, PIVOT_CONTENT_LENGTH);
    const splitNewLines = pivotContent.split("\n").reverse();
    const extractedDate = splitNewLines.find(DateManager.isDateIncluded);
    return extractedDate ?? "";
  }

  private static isDateIncluded(text: string): boolean {
    const lowercaseText = text.toLowerCase();

    const monthIncluded = MONTHS.reduce(
      (previousValue, currentValue) =>
        previousValue || lowercaseText.includes(currentValue.toLowerCase()),
      false
    );
    const timeIncluded = TIMES.reduce(
      (previousValue, currentValue) =>
        previousValue || lowercaseText.includes(currentValue.toLowerCase()),
      false
    );
    const partIncluded = PARTS_OF_DAY.reduce(
      (previousValue, currentValue) =>
        previousValue || lowercaseText.includes(currentValue.toLowerCase()),
      false
    );

    return monthIncluded && timeIncluded && partIncluded;
  }
}
