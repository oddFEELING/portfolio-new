const KB = 1024;
const MB = KB * KB;
const GB = MB * KB;

/**
 * Formats a file size to a human readable format.
 * @param size - The size of the file in bytes.
 * @returns The formatted file size.
 */
export const formatFileSize = (size: number): string => {
  if (size < KB) {
    return `${size} B`;
  }
  if (size < MB) {
    return `${(size / KB).toFixed(2)} KB`;
  }
  if (size < GB) {
    return `${(size / MB).toFixed(2)} MB`;
  }
  return `${(size / GB).toFixed(2)} GB`;
};
