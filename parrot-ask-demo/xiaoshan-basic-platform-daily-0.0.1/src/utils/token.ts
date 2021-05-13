import Cookies from "js-cookie";
const TokenKey = "TOKEN";
const RefreshTokenKey = "REFRESHTOKEN";
const QrLogined = "QR_LOGINED";
const LastLoginMode = "LAST_LOGIN_MODE";
// interface Token {
//   get: () => String | undefined;
//   set: (val: String, expires?: number) => void;
//   remove: () => void;
//   getRefresh: () => String | undefined;
//   setRefresh: (val: String, expires?: number) => void;
//   removeRefresh: () => void;
// }
export const token = {
  get: () => {
    return localStorage.getItem(TokenKey);
    // return Cookies.get(TokenKey);
  },
  set: (val: String, expires?: number) => {
    localStorage.setItem(TokenKey, val.toString());
    // Cookies.set(TokenKey, val, { expires });
  },
  remove: () => {
    localStorage.removeItem(TokenKey);
    // Cookies.remove(TokenKey);
  },
  getRefresh: () => {
    return localStorage.getItem(RefreshTokenKey);
    // return Cookies.get(RefreshTokenKey);
  },
  setRefresh: (val: String, expires?: number) => {
    localStorage.setItem(RefreshTokenKey, val.toString());
    // Cookies.set(RefreshTokenKey, val, { expires });
  },
  removeRefresh: () => {
    localStorage.removeItem(RefreshTokenKey);
    // Cookies.remove(RefreshTokenKey);
  },
  getQrLogined: () => {
    return localStorage.getItem(QrLogined);
    // return Cookies.get(TokenKey);
  },
  setQrLogined: (val: String) => {
    localStorage.setItem(QrLogined, val.toString());
    // Cookies.set(TokenKey, val, { expires });
  },
  removeQrLogined: () => {
    localStorage.removeItem(QrLogined);
    // Cookies.remove(TokenKey);
  },

  getLastLoginMode: () => {
    return localStorage.getItem(LastLoginMode);
    // return Cookies.get(TokenKey);
  },
  setLastLoginMode: (val: String) => {
    localStorage.setItem(LastLoginMode, val.toString());
    // Cookies.set(TokenKey, val, { expires });
  },
  removeLastLoginMode: () => {
    localStorage.removeItem(LastLoginMode);
    // Cookies.remove(TokenKey);
  },
};
export { Cookies };
