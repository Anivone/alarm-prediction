import { MONTHS } from "./date/constants";

export class ContentManipulator {

  public static getRelevantContent(content: string, contentDate: string) {
    const contentDateIndex = content.indexOf(contentDate);

    const relevantContentStartIndex = contentDateIndex + contentDate.length;

    return content.slice(relevantContentStartIndex);
  }

  public static getContentDate(dateString: string, extractedDate: string): string {
    const [month, dayOfMonth] = extractedDate.split(" ");
    const date = new Date(dateString);
    date.setMonth(MONTHS.indexOf(month));
    date.setDate(Number(dayOfMonth));

    return date.toISOString();
  }
}