//layouts
import LayoutAuth from "../Layouts/LayoutAuth";
import LayoutBasic from "../Layouts/LayoutBasic";

//pages user auth
import Chat from "../components/Chat";

const routes = [
  {
    path: "/sign-in",
    component: LayoutBasic,
    exact: true,
  },
  {
    path: "/",
    component: LayoutAuth,
    exact: false,
    routes: [
      {
        path: "/chat/:id",
        component: Chat,
        eaxct: true,
      },
    ],
  },
];

export default routes;
