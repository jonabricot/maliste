// import { createBrowserRouter, createContext, Link } from "react-router";
// import { HomePage } from "./pages/home";
// import { ListCreatePage, ListEditPage, ListPage } from "./pages/list";
// // import {  userMiddleware } from "./auth";
// import type { ListType } from "api/types";
// import { Button } from "./components/ui/button";
// import { LucideArrowLeft } from "lucide-react";
// import { RootLayout } from "./components/layout/root";
// import { NotFoundPage } from "./pages/404";

import { createRouter, RouterProvider } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import { useAuth } from './auth'
import { queryClient } from './api/query'
import type { QueryClient } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { NotFound } from './components/not-found'
import { Error } from './components/error'

export interface RouterContext {
  auth: ReturnType<typeof useAuth>,
  queryClient: QueryClient,
  back?: () => ReactElement
}

export const router = createRouter({
  routeTree,
  context: {
    auth: { user: null },
    queryClient,
  },
  defaultNotFoundComponent: NotFound,
  defaultErrorComponent: Error,
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


export function AppRouterProvider() {
  const auth = useAuth()

  return <RouterProvider router={router} context={{ auth }} />
}

// export const entityRouterContext = createContext<ListType|null>(null)

// export const router = createBrowserRouter([
//   {
//     path: "",
//     middleware: [userMiddleware],
//     element: <RootLayout/>,
//     children: [
//       {
//         index: true,
//         element: <HomePage/>,
//       },
//       {
//         path: 'not-found',
//         element: <NotFoundPage/>,
//       },
//       {
//         path: "list/create",
//         element: <ListCreatePage/>,
//         handle: {
//           breadcrumb: <Button variant={"link"} size="none" render={<Link to="/"/>} nativeButton={false}>
//               <LucideArrowLeft className="size-[1em]"/>Retour à l'accueil
//           </Button>
//         }
//       },
//       {
//         path: "list/:id",
//         children: [
//           {
//             index: true,
//             element: <ListPage/>,
//             handle: {
//               breadcrumb: <Button variant={"link"} size="none" render={<Link to="/"/>} nativeButton={false}>
//                   <LucideArrowLeft className="size-[1em]"/>Retour à l'accueil
//               </Button>
//             }
//           },
//           {
//             path: "edit",
//             element: <ListEditPage/>,
//             handle: {
//               breadcrumb: <Button variant={"link"} size="none" render={<Link to="/"/>} nativeButton={false}>
//                   <LucideArrowLeft className="size-[1em]"/>Retour à l'accueil
//               </Button>
//             }
//           },
//         ]
//       },
//     ]
//   },
  
// ]);

