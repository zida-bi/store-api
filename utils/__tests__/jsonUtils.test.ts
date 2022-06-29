import {
    findProducts,
    insertOrUpdateProducts,
    isProductsFormatAccurate,
    deleteProducts,
    isProductEqual,
    restoreOrAddProduct
} from '../jsonUtils';

const products = [{
    productId: 'id1',
    name: 'first product',
    price: 1,
    deleted: false
}, {
    productId: 'id2',
    name: 'another product',
    price: 12,
    deleted: true
}, {
    productId: 'id3',
    name: 'third product',
    price: 300,
    deleted: false
}, {
    productId: 'id4',
    name: 'forth product',
    price: 33,
    deleted: false
}];

describe('findProducts', () => {
    it('should return empty array if both inputs are empty array', () => {
        expect(findProducts([], [])).toEqual([]);
    });
    it('should return empty array if existng product is empty but input id list is not', () => {
        expect(findProducts([], ['id1', 'id2'])).toEqual([]);
    });
    it('should return empty array if existing product is non-empty but input id list is empty', () => {
        expect(findProducts(products, [])).toEqual([]);
    });
    it('should return empty array if the lookup id does not exist', () => {
        expect(findProducts(products, ['id100'])).toEqual([]);
    });
    it('should return the product if the id is found, and hide "deleted" object', () => {
        expect(findProducts(products, ['id3', 'id4'])).toEqual([{
            productId: 'id3',
            name: 'third product',
            price: 300
        }, {
            productId: 'id4',
            name: 'forth product',
            price: 33
        }]);
    });
    it('should not return the product if it was deleted', () => {
        expect(findProducts(products, ['id3', 'id2'])).toEqual([{
            productId: 'id3',
            name: 'third product',
            price: 300
        }]);
    });
    it('should only return the product that are found', () => {
        expect(findProducts(products, ['id345', 'id3', 'id20000'])).toEqual([{
            productId: 'id3',
            name: 'third product',
            price: 300
        }]);
    });
});

describe('insertOrUpdateProducts', () => {
    it('should return empty array if both input are empty array', () => {
        expect(insertOrUpdateProducts([], [])).toEqual([]);
    });
    it('should return same existing products if the requested products are empty', () => {
        expect(insertOrUpdateProducts(products, [])).toEqual(products);
    });
    it('should insert new product if it is not exist', () => {
        expect(insertOrUpdateProducts(products, [{ 'productId': 'id100', 'name': 'new prod', 'price': 123 }])).toEqual(
            [{
                productId: 'id1',
                name: 'first product',
                price: 1,
                deleted: false
            }, {
                productId: 'id2',
                name: 'another product',
                price: 12,
                deleted: true
            }, {
                productId: 'id3',
                name: 'third product',
                price: 300,
                deleted: false
            }, {
                productId: 'id4',
                name: 'forth product',
                price: 33,
                deleted: false
            }, { productId: 'id100', name: 'new prod', price: 123, deleted: false }]
        );
    });
    it('should ignore the "deleted" object from request while inserting', () => {
        expect(insertOrUpdateProducts(products, [{ 'productId': 'id100', 'name': 'new prod', 'price': 123, 'deleted': true }])).toEqual(
            [{
                productId: 'id1',
                name: 'first product',
                price: 1,
                deleted: false
            }, {
                productId: 'id2',
                name: 'another product',
                price: 12,
                deleted: true
            }, {
                productId: 'id3',
                name: 'third product',
                price: 300,
                deleted: false
            }, {
                productId: 'id4',
                name: 'forth product',
                price: 33,
                deleted: false
            }, { productId: 'id100', name: 'new prod', price: 123, deleted: false }]
        );
    });
    it('should restore product if it was deleted', () => {
        expect(insertOrUpdateProducts(products, [{
            productId: 'id2',
            name: 'another product',
            price: 12,
        }])).toEqual([{
            productId: 'id1',
            name: 'first product',
            price: 1,
            deleted: false
        }, {
            productId: 'id3',
            name: 'third product',
            price: 300,
            deleted: false
        }, {
            productId: 'id4',
            name: 'forth product',
            price: 33,
            deleted: false
        }, {
            productId: 'id2',
            name: 'another product',
            price: 12,
            deleted: false
        }])
    });
    it('should update product if it exist', () => {
        expect(insertOrUpdateProducts(products, [{
            productId: 'id1',
            name: 'updated product',
            price: 21,
        }])).toEqual([{
            productId: 'id2',
            name: 'another product',
            price: 12,
            deleted: true
        }, {
            productId: 'id3',
            name: 'third product',
            price: 300,
            deleted: false
        }, {
            productId: 'id4',
            name: 'forth product',
            price: 33,
            deleted: false
        }, {
            productId: 'id1',
            name: 'updated product',
            price: 21,
            deleted: false
        }])
    });
    it('should able to perform insert, restore and update at once', () => {
        expect(insertOrUpdateProducts(products,
            [{
                productId: 'id1',
                name: 'updated product',
                price: 21
            },
            {
                productId: 'id2',
                name: 'another product',
                price: 12
            },
            {
                productId: 'id3',
                name: 'third product',
                price: 300
            },
            {
                productId: 'id300',
                name: '300th product',
                price: 2223
            }]
        )).toEqual([{
            productId: 'id3',
            name: 'third product',
            price: 300,
            deleted: false
        }, {
            productId: 'id4',
            name: 'forth product',
            price: 33,
            deleted: false
        },
        {
            productId: 'id300',
            name: '300th product',
            price: 2223,
            deleted: false
        }, {
            productId: 'id1',
            name: 'updated product',
            price: 21,
            deleted: false
        },
        {
            productId: 'id2',
            name: 'another product',
            price: 12,
            deleted: false
        }])
    });
});

describe('isProductsFormatAccurate', () => {
    it('should return true if input is empty array', () => {
        expect(isProductsFormatAccurate([])).toBe(true);
    });
    it('should return false if productId is missing in one of the index', () => {
        expect(isProductsFormatAccurate([{
            productId: 'id1',
            name: 'first product',
            price: 1
        }, {
            name: 'another product',
            price: 12
        }])).toBe(false);
    });
    it('should return false if name is missing in one of the index', () => {
        expect(isProductsFormatAccurate([{
            productId: 'id1',
            name: 'first product',
            price: 1
        }, {
            productId: 'id2',
            price: 12
        }])).toBe(false);
    });
    it('should return false if price is missing in one of the index', () => {
        expect(isProductsFormatAccurate([{
            productId: 'id1',
            name: 'first product',
            price: 1
        }, {
            productId: 'id2',
            name: 'another product'
        }])).toBe(false);
    });
    it('should return false if one of the objects is empty', () => {
        expect(isProductsFormatAccurate([{
            productId: 'id1',
            name: 'first product',
            price: 1
        }, {}])).toBe(false);
    });
    it('should return false if the array contains undefined', () => {
        expect(isProductsFormatAccurate([{
            productId: 'id1',
            name: 'first product',
            price: 1
        }, undefined])).toBe(false);
    });
    it('should return false if the array contains number', () => {
        expect(isProductsFormatAccurate([{
            productId: 'id1',
            name: 'first product',
            price: 1
        }, 0])).toBe(false);
    });
    it('should return false if the array contains string', () => {
        expect(isProductsFormatAccurate([{
            productId: 'id1',
            name: 'first product',
            price: 1
        }, 'here it is'])).toBe(false);
    });
    it('should return true if the format is correct in every index', () => {
        expect(isProductsFormatAccurate([{
            productId: 'id1',
            name: 'first product',
            price: 1
        }, {
            productId: 'id2',
            name: 'another product',
            price: 12
        }])).toBe(true);
    });
});

describe('deleteProducts', () => {
    it('should return empty array if both inputs are empty array', () => {
        expect(deleteProducts([], [])).toEqual([]);
    });
    it('should return empty array if existing products is empty array', () => {
        expect(deleteProducts([], ['id1', 'id2'])).toEqual([]);
    });
    it('should return products remain unchanges if the productIds is an empty array', () => {
        expect(deleteProducts(products, [])).toEqual(products);
    });
    it('should return products remain unchanges if the productIds is not found in the existing product list', () => {
        expect(deleteProducts(products, ['id6', 'id8'])).toEqual(products);
    });
    it('should return products remain unchanges if the product is already deleted', () => {
        expect(deleteProducts(products, ['id2'])).toEqual(products);
    });
    it('should delete the product', () => {
        expect(deleteProducts(products, ['id1', 'id3'])).toEqual([{
            productId: 'id1',
            name: 'first product',
            price: 1,
            deleted: true
        }, {
            productId: 'id2',
            name: 'another product',
            price: 12,
            deleted: true
        }, {
            productId: 'id3',
            name: 'third product',
            price: 300,
            deleted: true
        }, {
            productId: 'id4',
            name: 'forth product',
            price: 33,
            deleted: false
        }]);
    });
});

describe('isProductEqual', () => {
    it('should return true if 2 inputs are identical while "deleted" is false in one of the inputs', () => {
        expect(isProductEqual({
            productId: 'id1',
            name: 'first product',
            price: 1,
            deleted: false
        },
            {
                productId: 'id1',
                name: 'first product',
                price: 1
            })).toBe(true);
    });
    it('should return false if 2 inputs are identical while "deleted" is true in one of the inputs', () => {
        expect(isProductEqual({
            productId: 'id1',
            name: 'first product',
            price: 1,
            deleted: true
        },
            {
                productId: 'id1',
                name: 'first product',
                price: 1
            })).toBe(false);
    });
    it('should return false if product id is different', () => {
        expect(isProductEqual({
            productId: 'id1',
            name: 'first product',
            price: 1
        },
            {
                productId: 'id2',
                name: 'first product',
                price: 1,
                deleted: false
            })).toBe(false);
    });
    it('should return false if name is different', () => {
        expect(isProductEqual({
            productId: 'id1',
            name: 'first product',
            price: 1
        },
            {
                productId: 'id1',
                name: 'different product',
                price: 1,
                deleted: false
            })).toBe(false);
    });
    it('should return false if price is different', () => {
        expect(isProductEqual({
            productId: 'id1',
            name: 'first product',
            price: 1
        },
            {
                productId: 'id1',
                name: 'different product',
                price: 321,
                deleted: false
            })).toBe(false);
    });
});

describe('restoreOrAddProduct', () => {
    it('should return empty array if input is empty array', () => {
        expect(restoreOrAddProduct([])).toEqual([]);
    });
    it('should set "deleted" to false for every object from the input', () => {
        expect(restoreOrAddProduct([{
            productId: 'id1',
            name: 'first product',
            price: 1
        }, {
            productId: 'id2',
            name: 'another product',
            price: 12,
            deleted: true
        }])).toEqual([{
            productId: 'id1',
            name: 'first product',
            price: 1,
            deleted: false
        }, {
            productId: 'id2',
            name: 'another product',
            price: 12,
            deleted: false
        }]);
    });
})