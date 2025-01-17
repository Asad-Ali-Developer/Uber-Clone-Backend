import { Express } from "express";
import logMessage from "./logMessage.service";

const listRoutes = (app: Express): void => {
  const routes: { method: string; path: string }[] = [];

  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      // Directly defined routes
      routes.push({
        method: Object.keys(middleware.route.methods)[0].toUpperCase(),
        path: middleware.route.path,
      });
    } else if (middleware.name === "router") {
      // Routes added via router
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          routes.push({
            method: Object.keys(handler.route.methods)[0].toUpperCase(),
            path: handler.route.path,
          });
        }
      });
    }
  });

  // Log the routes
  logMessage("Mapped routes:", "LOG");
  routes.forEach((route) =>
    logMessage(`[RouterExplorer] Mapped {${route.path}, {${route.method}}} route`, "LOG")
  );
};


export default listRoutes;
