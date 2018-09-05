import csv from 'csvtojson';
import 'promise-polyfill/src/polyfill';
import fs from 'fs';

export const loadDataFromFile = (file) => {
  const extArr = file.split('.');
  const ext = extArr.pop().toLowerCase();
  const responseBodyMethod = {json: 'json', csv: 'text'}[ext];

  return new Promise((resolve, reject) => {
    fs.readFile(file, { encoding: 'utf-8' }, (err, res) => {
      if (err) {
        return reject(err);
      }

      if (ext === 'json') {
        return resolve(res);
      }

      return csv()
        .fromString(res)
        .then((json) => {
          resolve(json);
        });
    });
  });
}

export default loadDataFromFile;
