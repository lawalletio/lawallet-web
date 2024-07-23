interface shareDataType {
  title: string;
  description: string;
  url?: string;
}

export const share = (shareData: shareDataType): boolean => {
  if (!window.navigator.canShare(shareData)) return false;

  window.navigator.share(shareData);
  return true;
};

export const copy = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.log('Failed to copy: ', error);
    return false;
  }
};
