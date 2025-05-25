import { RouteObject } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";

const productRoutes: RouteObject[] = [
  {
    path: "/admin/products",
    element: <ProductList />,
  },
  {
    path: "/admin/products/:id",
    element: <ProductDetail />,
  },
];

export default productRoutes;
