import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import { routesData } from "./data.routes";
import { IRouterData } from "./type.routes";
import NotFound from "../components/pages/NotFound";

const renderRoutes = (routes: IRouterData[]) => {
  return (
    <>
      {routes
        ? routes.map((route: IRouterData, index: number) => {
            const Layout = route.layout || Fragment;
            const Page = route.component || Fragment;

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })
        : null}

      <Route path="*" element={<NotFound />} />
    </>
  );
};

function RoutesApp() {
  return <Routes>{renderRoutes(routesData)}</Routes>;
}

export default RoutesApp;
