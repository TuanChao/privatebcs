export default class LocalStorage {
  public static get = (key: string) => {
    return localStorage.getItem(key);
  };

  public static set = (key: string, value: string) => {
    return localStorage.setItem(key, value);
  };

  public static remove = (key: string) => {
    return localStorage.removeItem(key);
  };
}
