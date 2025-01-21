export const truncateString = (str: string, maxLength: number): string => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength - 3) + '...';
    }
    return str;
};
const supportsEmoji = (): boolean => {
  const isVSCode = process.env.TERM_PROGRAM === 'vscode';
  const isMacOrLinux = ['darwin', 'linux'].includes(process.platform);
  
  return isVSCode || isMacOrLinux;
}

/**
 * @param {boolean} isDirectory
 * @returns {string} 
 */
export const getFolderAndFileSymbol = (isDirectory: boolean): string => {
  return isDirectory 
    ? (supportsEmoji() ? '📁' : '[D]') 
    : (supportsEmoji() ? '📄' : '[F]');
}