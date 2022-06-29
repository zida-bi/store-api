import { IProduct } from "../interfaces";
import {
    intersectionBy,
    intersectionWith,
    differenceBy,
    differenceWith,
    cloneDeep
} from "lodash";

export const findProducts = (allProducts: IProduct[], productIds: string[]): IProduct[] => {
    return productIds.reduce((matchProducts: IProduct[], currentProductId: string) => {
        const foundProduct = allProducts.find((product: IProduct) => product.productId === currentProductId && !product.deleted);
        foundProduct && matchProducts.push({
            productId: foundProduct.productId,
            name: foundProduct.name,
            price: foundProduct.price
        });
        return matchProducts;
    }, []);
}

export const insertOrUpdateProducts = (currenProducts: IProduct[], requestedProducts: IProduct[]): IProduct[] => {
    const identicalProducts = intersectionWith(currenProducts, requestedProducts, isProductEqual);
    console.log({ identicalProducts: identicalProducts })

    const productsNotMentionedInRequest = differenceBy(currenProducts, requestedProducts, 'productId');
    const newProducts = differenceBy(requestedProducts, currenProducts, 'productId');

    const productsWithSameId = intersectionBy(requestedProducts, currenProducts, 'productId');
    const productsToBeUpdated = differenceWith(productsWithSameId, currenProducts, isProductEqual);
    console.log({ productsToBeUpdated: productsToBeUpdated })

    return [
        ...identicalProducts,
        ...productsNotMentionedInRequest,
        ...restoreOrAddProduct(newProducts),
        ...restoreOrAddProduct(productsToBeUpdated)
    ];
}

export const isProductsFormatAccurate = (requestedProducts: any[]) => {
    return !requestedProducts.some((product: any) => !product || !product.productId || !product.name || !product.price);
}

export const deleteProducts = (allProducts: IProduct[], productIds: string[]): IProduct[] => {
    const currentProductList = cloneDeep(allProducts);
    return productIds.reduce((currentProductList: IProduct[], id: string) => {
        const foundProduct = currentProductList.find((p: IProduct) => p.productId === id);
        foundProduct && (foundProduct.deleted = true);
        return currentProductList;
    }, currentProductList);
}

export const isProductEqual = (p1: IProduct, p2: IProduct): boolean =>
    p1.productId === p2.productId
    && p1.name === p2.name
    && p1.price === p2.price
    && (p1.deleted === false || p2.deleted === false);
export const restoreOrAddProduct = (products: IProduct[]) =>
    products.map((p: IProduct) => { p.deleted = false; return p; });