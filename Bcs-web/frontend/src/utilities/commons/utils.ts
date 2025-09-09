export const checkInvalidValue = (value: any) => {
  return value === "" || value === undefined || value === null;
};

export const convertStringValueObject = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, String(value)]));
};

export const isVideo = (url: string): boolean => {
  const videoExtensions = [".mp4", ".mov", ".avi", ".webm"];
  return videoExtensions.some((ext) => url.includes(ext));
};
