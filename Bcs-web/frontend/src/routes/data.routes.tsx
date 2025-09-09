import MainLayout from "../components/layouts/MainLayout";
import AboutPage from "../components/pages/About";

// import GalleryPage from "src/components/pages/Gallery";
import HomePage from "../components/pages/Home";
// import OrderPage from "../components/pages/Order";
import routesName from "./enum.routes";
import { IRouterData } from "./type.routes";
// import NewsPage from "../components/pages/News";
// import Docs from "../components/pages/Docs";
import ProductPage from "../components/pages/Product";
import ProductDentail from "../components/pages/Product/ProductDentail";
import ProductBannerDetail from "src/components/pages/Product/ProductBanner/ProductBannnerDetail/ProductBanneeDetail";
// import ServicePage from "src/components/pages/Servicepage";
import ServiceDetail from "src/components/pages/Service/ServiceDetail";
import SocProduct from "src/components/pages/Home/HomeOrganisms/HomeBanner/SocProduct";
import Login from "src/components/pages/Auth/Login";
import BlankLayout from "src/components/pages/Blank/BlankLayout";
import AdminDashboard from "src/components/layouts/AdminLayout/AdminDashboard/AdminDashboard";
import AdminUser from "src/components/layouts/AdminLayout/AdminUser/AdminUser";
import AdminPoster from "src/components/layouts/AdminLayout/AdminPoster/AdminPoster";
import AdminNews from "src/components/layouts/AdminLayout/AdminNews/AdminNews";
import AdminService from "src/components/layouts/AdminLayout/AdminService/AdminService";
import AdminProduct from "src/components/layouts/AdminLayout/AdminProduct/AdminProduct";
import RequireAuth from "src/components/pages/Auth/RequireAuth";
import NewsPageProduct from "../components/pages/News";
import NewsDetail from "../components/pages/News/NewsDetail/NewsDetail";
import AdminIntroduce from "src/components/layouts/AdminLayout/AdminIntroduce/AdminIntroduce";
import AdminAboutContent from "src/components/layouts/AdminLayout/AdminAboutContent/AdminAboutContent";
import AdminNewsBanner from "src/components/layouts/AdminLayout/AdminNewsBanner";
import AdminProductBanner from "src/components/layouts/AdminLayout/AdminProductBanner";
import AdminServiceBanner from "src/components/layouts/AdminLayout/AdminServiceBanner";
import ServiceBannerDetail from "src/components/pages/Service/ServiceBanner/ServiceBannerDetail/ServiceBannerDetail";
import Servicepage from "src/components/pages/Service/Servicepage";

export const routesData: IRouterData[] = [
  {
    path: routesName.ROOT,
    layout: MainLayout,
    component: () => <HomePage/>,
  },
  // {
  //   path: routesName.GALLERY,
  //   layout: MainLayout,
  //   component: () => <GalleryPage/>,
  // },
  {
    path: routesName.ABOUT,
    layout: MainLayout,
    component: () => <AboutPage />,
  },
  // {
  //   path: routesName.ORDER,
  //   layout: MainLayout,
  //   component: () => <OrderPage />,
  // },
  {
    path: routesName.NEWS,
    layout: MainLayout,
    component: () => <NewsPageProduct />,
    
  },
  {
    path: routesName.NEWS_DETAIL,
    layout: MainLayout,
    component: () => <NewsDetail />,
    
  },
  // {
  //   path: routesName.DOCS,
  //   layout: MainLayout,
  //   component: () => <Docs />,
  // },
  {
    path: routesName.PRODUCT,
    layout: MainLayout,
    component: () => <ProductPage />,
  },
  {
    path: routesName.PRODUCT_DETAIL,
    layout: MainLayout,
    component: () => <ProductDentail />,
  },
  {
    path: routesName.PRODUCT_BANNER_DETAIL,
    layout: MainLayout,
    component: () => <ProductBannerDetail />,
  },
  {
    path: routesName.SERVICE_BANNER_DETAIL,
    layout: MainLayout,
    component: () => <ServiceBannerDetail/>,
  },
  {
    path: routesName.SERVICE,
    layout: MainLayout,
    component: () => <Servicepage />,
  },
  {
    path: routesName.SERVICE_DETAIL,
    layout: MainLayout,
    component: () => <ServiceDetail />,
  },
  {
    path: routesName.SOC_PRODUCT,
    layout: MainLayout,
    component: () => <SocProduct />,
  },
  {
    path: routesName.LOGIN,
    layout: BlankLayout,
    component: () => <Login />,
  },
 {
  path: routesName.ADMIN,
  layout: BlankLayout,
  component: () => (
    <RequireAuth>
      <AdminDashboard />
    </RequireAuth>
  ),
},
  {
    path: routesName.ADMIN_USER,
    layout: BlankLayout,
    component: () => <AdminUser/>,
  },
  {
    path: routesName.ADMIN_POSTER,
    layout: BlankLayout,
    component: () => <AdminPoster/>,
  },
  {
    path: routesName.ADMIN_NEWS,
    layout: BlankLayout,
    component: () => <AdminNews/>,
  },
  {
    path: routesName.ADMIN_SERVICE,
    layout: BlankLayout,
    component: () => <AdminService/>,
  },
  {
    path: routesName.ADMIN_PRODUCT,
    layout: BlankLayout,
    component: () => <AdminProduct/>,
  },
  {
    path: routesName.ADMIN_INTRODUCE,
    layout: BlankLayout,
    component: () => <AdminIntroduce/>,
  },
  {
    path: routesName.ADMIN_ABOUTCONTENT,
    layout: BlankLayout,
    component: () => <AdminAboutContent/>,
  },
  {
    path: routesName.ADMIN_BANNER,
    layout: BlankLayout,
    component: () => <AdminNewsBanner/>,
  },
   {
    path: routesName.ADMIN_PRODUCT_BANNER,
    layout: BlankLayout,
    component: () => <AdminProductBanner/>,
  },
  {
    path: routesName.ADMIN_SERVICE_BANNER,
    layout: BlankLayout,
    component: () => <AdminServiceBanner/>,
  },
];
