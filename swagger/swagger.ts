export const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'APIs Document',
        description: 'swagger document for store api assessment'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local server'
        }
    ],
    components: {
        schemas: {},
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
    tags: [
        {
            name: 'Products'
        }
    ],
    paths: {
        "/find-products-by-ids": {
            "post": {
                tags: ['Products'],
                description: "Returns products details with given array of product id",
                operationId: 'getProductsByIds',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    description: "Ids of the products to be retrieved",
                    content: {
                        "application/json": {
                            schema: {
                                required: ["productIds"],
                                type: "object",
                                properties: {
                                    productIds: {
                                        type: "array",
                                        example: ['0000', '0001']
                                    }
                                }
                            }
                        }
                    },
                    "required": true
                },
                responses: {
                    "200": {
                        description: "A list of products",
                        "content": {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        matchingProducts: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    productId: {
                                                        type: "string"
                                                    },
                                                    name: {
                                                        type: "string"
                                                    },
                                                    price: {
                                                        type: "number"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        description: "Missing product id",
                        content: {}
                    }
                }
            }
        },
        "/upsert-products": {
            "put": {
                tags: ['Products'],
                description: "Insert, update or restore products",
                operationId: 'upsertProducts',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    description: "Products to be upserted",
                    content: {
                        "application/json": {
                            schema: {
                                required: ["products"],
                                type: "object",
                                properties: {
                                    products: {
                                        type: "array",
                                        example: [{
                                            "productId": "0000",
                                            "name": "item - 0000",
                                            "price": 1
                                        },
                                        {
                                            "productId": "0001",
                                            "name": "item - 0001",
                                            "price": 200
                                        }]
                                    }
                                }
                            }
                        }
                    },
                    "required": true
                },
                responses: {
                    "200": {
                        description: "message indicating upsert successful",
                        "content": {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        status: {
                                            type: "string"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        description: "Invalid input",
                        content: {}
                    }
                }
            }
        },
        "/delete-products-by-ids": {
            "post": {
                tags: ['Products'],
                description: "Delete products with given array of product id",
                operationId: 'deleteProductsById',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    description: "Ids of the products to be deleted",
                    content: {
                        "application/json": {
                            schema: {
                                required: ["productIds"],
                                type: "object",
                                properties: {
                                    productIds: {
                                        type: "array",
                                        example: ['0000', '0001']
                                    }
                                }
                            }
                        }
                    },
                    "required": true
                },
                responses: {
                    "200": {
                        description: "message indicating deletion successful",
                        "content": {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        status: {
                                            type: "string"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        description: "Invalid input",
                        content: {}
                    }
                }
            }
        }
    }
}