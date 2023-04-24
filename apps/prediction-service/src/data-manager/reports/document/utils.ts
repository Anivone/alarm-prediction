export const parseDate = (date: string): string | undefined =>
  new Date(date).toDateString() === "Invalid Date"
    ? undefined
    : new Date(date).toISOString();

export const extractRelevantContent = (
  contentDateString: string,
  content: string
) =>
  content.slice(content.indexOf(contentDateString) + contentDateString.length);
