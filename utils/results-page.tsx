import DOMPurify from "dompurify";
import ReactHtmlParser from "react-html-parser";
export const surroundWithMarkEl = (text: string, query: string) => {
  const sanitizedQuery = DOMPurify.sanitize(query);
  if (!!query) {
    return ReactHtmlParser(text.replaceAll(query, `<mark>${sanitizedQuery}</mark>`));
  }
  return text;
};