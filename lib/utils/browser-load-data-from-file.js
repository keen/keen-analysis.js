import csv from 'csvtojson';

export const loadDataFromFile = (file) => {
  const extArr = file.split('.');
  const ext = extArr.pop().toLowerCase();
  const responseBodyMethod = {json: 'json', csv: 'text'}[ext];
  return fetch(file)
      .then(res => {
        return res[responseBodyMethod]();
      })
      .then(res => {
        if (ext === 'json') {
          return res;
        }

    return csv()
      .fromString(res)
      .then((json)=>{
        return json;
      });
    });
}

export default loadDataFromFile;
