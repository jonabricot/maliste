import { createBrowserRouter, redirect } from "react-router";
import { UsersPage } from "./pages/users";
import { client } from "./api/client";
import { LoginForm } from "./pages/login";
import { authClient } from "./api/auth-client";
import { routerUserContext } from "./auth";
import { DashboardLayout } from "./components/layout/dashboard";
import { ListsPage } from "./pages/lists";

export const router = createBrowserRouter([
  {
    path: "/",
    middleware: [userMiddleware],
    children: [
      {
        index: true,
        element: <LoginForm/>,
      },
      {
        path: "dashboard",
        middleware: [adminMiddleware],
        element: <DashboardLayout/>,
        children: [
          {
            index: true,
            element: <UsersPage/>,
            loader: async () => {
              const reponse = await client.admin.users.$get()
              return await reponse.json()
            }
          },
          {
            path: 'users',
            element: <UsersPage/>,
            loader: async () => {
              const reponse = await client.admin[":entity"].list.$get({param: {entity: 'user'}})
              return await reponse.json()
            }
          },
          {
            path: 'lists',
            element: <ListsPage/>,
            loader: async () => {
              const reponse = await client.admin[":entity"].list.$get({param: {entity: 'list'}})
              return await reponse.json()
            }
          }
        ]
      }
    ]
  },
  
]);

async function userMiddleware({ context }) {
  const session = await authClient.getSession();
  if (session && session.data && session.data.user) {
    context.set(routerUserContext, session.data.user);
  }
}

async function adminMiddleware({ context }) {
  const user = context.get(routerUserContext)
  console.log(user)
  if (!user || user.role !== "admin") {
    throw redirect('/')
  }
}