import express, { RequestHandler } from "express";
import bodyParser from "body-parser";
import sessionValidationMiddleware from "./middleware/sessionvalidation.middleware";
import storeApi from "./api/storeApi";
import swaggerUI from 'swagger-ui-express';
import { swaggerDocument } from './swagger/swagger';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/apis', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});

const registerProtectedRouteUrl = (
  uri: string,
  method: String,
  controller: RequestHandler
) => {
  if (method === "GET") app.get(uri, sessionValidationMiddleware, controller);
  if (method === "POST") app.post(uri, sessionValidationMiddleware, controller);
  if (method === "PATCH")
    app.patch(uri, sessionValidationMiddleware, controller);
  if (method === "PUT") app.put(uri, sessionValidationMiddleware, controller);
};

storeApi.map(({ method, uri, controller }) =>
  registerProtectedRouteUrl(uri, method, controller)
);
