import { Request, Response } from "express";
import { readAllStorageData, updateStorageData } from "../utils/jsonFileUtil";
import {
  findProducts,
  insertOrUpdateProducts,
  isProductsFormatAccurate,
  deleteProducts
} from '../utils/jsonUtils';

export async function findProductsByIds(req: Request, res: Response) {
  try {
    const productIds = req.body.productIds;
    if (!Array.isArray(productIds))
      return res.status(400).json({ error: 'Missing product ids' });

    const allProducts = await readAllStorageData();
    const matchingProducts = findProducts(allProducts, [...new Set(productIds)]);
    return res.status(200).json({ matchingProducts });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'System error occurred' });
  }
}

export async function upsertProducts(req: Request, res: Response) {
  try {
    const requestedProducts = req.body.products;
    if (!Array.isArray(requestedProducts))
      return res.status(400).json({ error: 'Missing products' });
    if (!isProductsFormatAccurate(requestedProducts))
      return res.status(400).json({ error: 'Invalid product data' });

    const currentProducts = await readAllStorageData();
    const newProductList = insertOrUpdateProducts(currentProducts, requestedProducts);
    await updateStorageData(newProductList);
    res.status(200).json({ status: "upsert success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'System error occurred' });
  }
}

export async function deleteProductsByIds(req: Request, res: Response) {
  try {
    const productIds = req.body.productIds;
    if (!Array.isArray(productIds))
      return res.status(400).json({ error: 'Missing product ids' });

    const allProducts = await readAllStorageData();
    const productsAfterDeletion = deleteProducts(allProducts, [...new Set(productIds)]);
    await updateStorageData(productsAfterDeletion);
    res.status(200).json({ status: "deletion success" });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'System error occurred' });
  }
}