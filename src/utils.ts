import { MONTHS, PARTS_OF_DAY, TIMES } from "./constants";

export const getRelevantContent = (content: string, contentDate: string) => {
  const contentDateIndex = content.indexOf(contentDate);

  const relevantContentStartIndex = contentDateIndex + contentDate.length;

  return content.slice(relevantContentStartIndex);
}

export const getContentDate = (dateString: string, extractedDateString: string): string => {
  const [month, dayOfMonth] = extractedDateString.split(" ");
  const date = new Date(dateString);
  date.setMonth(MONTHS.indexOf(month));
  date.setDate(Number(dayOfMonth));

  return date.toISOString();
}

export const extractDate = (fullDate: string): string => {
  const [date] = fullDate.split(",");
  return date;
}

export const extractFullDate = (splitText: string[]): string => {
  const dateTimeString = splitText.find((text) => isDateIncluded(text));
  if (!dateTimeString) return "";

  return dateTimeString;
}

export const isDateIncluded = (text: string): boolean => {
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