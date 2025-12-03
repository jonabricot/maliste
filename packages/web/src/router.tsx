import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/home";
import { ListCreatePage, ListEditPage, ListPage } from "./pages/list";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/list/:id",
    Component: ListPage,
  },
  {
    path: "/list/create",
    Component: ListCreatePage,
  },
  {
    path: "/list/:id/edit",
    Component: ListEditPage,
  },
]);