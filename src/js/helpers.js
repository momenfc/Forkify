import { TIMEOUT_SEC } from "./config";

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/*
export const getJson = async function (url) {
  try {
    const respons = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await respons.json();
    if (!respons.ok) throw new Error(`${data.message} (${respons.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};


export const sendJson = async function(url, uploadData){
  try{
  const respons = fetch(url,{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(uploadData)
  });
  const res = await Promise.race([respons, timeout(TIMEOUT_SEC)])
  const data = await res.json();
if(!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
}catch(err){
  throw err
}
}
*/

export const Ajax = async function(url, uploadData = undefined){
  try{
  const featchPro = uploadData ? fetch(url,{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(uploadData)
  }): fetch(url);
  const res = await Promise.race([featchPro, timeout(TIMEOUT_SEC)])
  const data = await res.json();
if(!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
}catch(err){
  throw err
}
}
