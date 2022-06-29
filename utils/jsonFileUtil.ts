import {readFile, writeFile} from 'jsonfile'
import { IProduct } from "../interfaces";

const filePath = "./storage/storage.json";

export async function readAllStorageData(): Promise<IProduct[]> {
  return new Promise((resolve, reject) => {
    readFile(filePath, function (err, obj) {
      if (err) reject(err.message)
      resolve(obj)
    })
  });
}

export async function updateStorageData(updatedStorageData: IProduct[]) {
  return new Promise((resolve, reject) => {
    writeFile(filePath, updatedStorageData, (error) => {
      if (error) {
        reject(error);
      }
      resolve("success");
    });
  });
}
