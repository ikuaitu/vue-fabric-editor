import md5 from 'md5';
export const TRANSLATE_CONFIG = {
  appid: 'appid', //Change to your appid
  key: 'key', //Change to your key
};

export function generateSign(query, salt, appid, key) {
  const str = appid + query + salt + key;
  return md5(str);
}
