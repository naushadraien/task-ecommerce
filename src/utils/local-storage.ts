export const setItemToLocalStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getItemFromLocalStorage = <T>(key: string): T | null => {
  const stringifiedData = localStorage.getItem(key);
  if (stringifiedData) {
    const parsedData = JSON.parse(stringifiedData);
    return parsedData;
  } else {
    return null;
  }
};

export const removeItemFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
