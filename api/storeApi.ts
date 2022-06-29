import {
  upsertProducts,
  findProductsByIds,
  deleteProductsByIds
} from "../controller/storeApiController";

const apiRoutes = [
  {
    method: "PUT",
    uri: "/upsert-products",
    controller: upsertProducts,
  },
  {
    method: "POST",
    uri: "/find-products-by-ids",
    controller: findProductsByIds,
  },
  {
    method: "POST",
    uri: "/delete-products-by-ids",
    controller: deleteProductsByIds,
  }
];

export default apiRoutes;
