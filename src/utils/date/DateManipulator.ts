import { MONTHS, PARTS_OF_DAY, TIMES } from "./constants";

export class DateManipulator {

  public static extractDate(fullDate: string): string {
    const [date] = fullDate.split(",");
    return date;
  }

  public static extractFullDate(splitText: string[]): string {
    const dateTimeString = splitText.find((text) => this.isDateIncluded(text));
    if (!dateTimeString) return "";

    return dateTimeString;
  }

  public static isDateIncluded(text: string): boolean {
    let result = false
    const lowercaseText = text.toLowerCase();
    MONTHS.forEach((month) => {
      if (lowercaseText.includes(month.toLowerCase())) {
        result = true;
      }
    });
    TIMES.forEach((time) => {
      if (lowercaseText.includes(time.toLowerCase())) {
        result = true;
      }
    });
    PARTS_OF_DAY.forEach((part) => {
      if (lowercaseText.includes(part.toLowerCase())) {
        result = true;
      }
    });

    return result;
  }
}