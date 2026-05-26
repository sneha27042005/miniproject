import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { IntroPage } from "./pages/IntroPage";
import { StudentLogin } from "./pages/StudentLogin";
import { StudentRegister } from "./pages/StudentRegister";
import { StudentDashboard } from "./pages/StudentDashboard";
import { ClientDashboard } from "./pages/ClientDashboard";
import { ClientLogin } from "./pages/ClientLogin";
import { ClientRegister } from "./pages/ClientRegister";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminLogin } from "./pages/AdminLogin";

export const router = createBrowserRouter([
  {
    path: "/intro",
    Component: IntroPage,
  },
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/student",
    Component: StudentLogin,
  },
  {
    path: "/student/register",
    Component: StudentRegister,
  },
  {
    path: "/student/dashboard",
    Component: StudentDashboard,
  },
  {
    path: "/client",
    Component: ClientLogin,
  },
  {
    path: "/client/register",
    Component: ClientRegister,
  },
  {
    path: "/client/dashboard",
    Component: ClientDashboard,
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
]);