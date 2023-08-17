export function dollarFileMatchPattern(baseUrl: string, file: string): string {
  // return file.replace(/\$/g, '\\$');
  return baseUrl + file;
}
