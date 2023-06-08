import { config } from "dotenv";
import express, {
    Application,
    NextFunction,
    Request, response,
    Response,
} from "express";
import morgan from "morgan";
import passport from "passport";
import { resolve, join } from "path";
import * as bodyparser from "body-parser"
import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import {ExtendedRoutesConfig, ExtendedSpecConfig, generateRoutes, generateSpec, ValidateError} from "tsoa";
import {createConnection, getManager, getRepository} from "typeorm";
import { getConnectionOptions } from "./config/database";
import { authenticateUser } from "./middlewares/auth";
import { RegisterRoutes } from "./routes/routes";
import {get} from "lodash";
import {Contract} from "./entities";

// @ts-ignore
config(resolve(__dirname, "../.env"));

const PORT = process.env.PORT || 4000;

const app: Application = express();


app.use(bodyparser.json())
// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use(passport.initialize());
// tslint:disable-next-line:only-arrow-functions
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Authorization")
    res.setHeader("Access-Control-Allow-Headers", "*")
    next();
});

authenticateUser(passport);

// create TSOA specs and routes
 /* (async () => {
   const specOptions: ExtendedSpecConfig = {
     entryFile: "src/server.ts",
     specVersion: 3,
     outputDirectory: "public",
     controllerPathGlobs: ["src/controllers/!**!/!*.ts"],
     noImplicitAdditionalProperties: "throw-on-extras",
   };

  const routeOptions: ExtendedRoutesConfig = {
     entryFile: "src/server.ts",
    routesDir: "src/routes",
    noImplicitAdditionalProperties: "throw-on-extras",
  };

  await generateSpec(specOptions);

  await generateRoutes(routeOptions);
    })();
*/
app.use(
  "/docs/api",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

RegisterRoutes(app);

app.use("/docs/code", express.static(join(__dirname, "../out")));

app.use(express.static(join(__dirname, "..", "frontend/build")));
// app.use((_, res, __) => {
//   res.sendFile(join(__dirname, "..", "frontend/build", "index.html"));
// });

app.use(function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {

  if (err instanceof ValidateError) {
    console.warn(
      `Caught Validation Error for ${req.path}:`,
      err.fields
    );
    return res.status(err.status || 422).json({
      message: err.message || "Validation Failed",
      details: err.fields,
    });
  }

  if (err instanceof Error) {
    console.warn(`Caught Validation Error for ${req.path}:`, err);
    return res.status(500).json({
      message: "Internal Server Error",
      details: err.message,
    });
  }

  next();
});

// app.use(function notFoundHandler(_req, res: Response) {
//   res.status(404).send({
//     message: "Not Found",
//   });
// });

createConnection(getConnectionOptions())
  .then(async (_connection) => {
      app.listen(PORT, () => {
          console.log("Server is running on", PORT);
      });
      let [entities, count] = await getRepository(Contract).findAndCount();
      if (count === 0)
          _connection.query(`
              INSERT INTO "contract" ("id", "name", "description", "longDescription", "price", "countInStock", "discount",
                                      "size", "sold", "createdAt", "updatedAt")
              VALUES (1, 'gas', 'Тариф «Стандартный»',
                      'Пакет снабжения газом и технического обслуживания газоиспользующего оборудования', '389', 999, 0,
                      'small', 0, '2023-06-07 01:35:10', '2023-06-07 01:35:13');
              INSERT INTO "contract" ("id", "name", "description", "longDescription", "price", "countInStock", "discount",
                                      "size", "sold", "createdAt", "updatedAt")
              VALUES (2, 'gas', 'Тариф «Расширенный»',
                      'Пакет снабжения газом и технического обслуживания газоиспользующего оборудования', '959', 999, 0,
                      'medium', 0, '2023-06-07 01:36:37', '2023-06-07 01:36:38');
              INSERT INTO "contract" ("id", "name", "description", "longDescription", "price", "countInStock", "discount",
                                      "size", "sold", "createdAt", "updatedAt")
              VALUES (3, 'gas', 'Тариф «Максимальный»',
                      'Пакет снабжения газом и технического обслуживания газоиспользующего оборудования', '2300', 999, 0,
                      'big', 0, '2023-06-07 01:38:14', '2023-06-07 01:38:15');
          `)
  })
  .catch((error) => {
    console.log("Unable to connect to db", error);
    process.exit(1);
  });

