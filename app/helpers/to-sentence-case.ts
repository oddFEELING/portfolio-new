/**
 * Converts a string to sentence case.
 * @param str - The string to convert to sentence case.
 * @returns The string in sentence case.
 */
export const toSentenceCase = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
