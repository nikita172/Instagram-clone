import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Home from "./pages/home/Home";
import Signin from "./pages/signin/Signin";
import Signup from "./pages/signup/Signup";
import PasswordReset from "./pages/passwordReset/PasswordReset";
import SigninWithFacebook from "./pages/signinWithFacebook/SigninWithFacebook";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/signin",
    element: <Signin />
  },
  {
    path: "/signin/facebook",
    element: <SigninWithFacebook />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/:id/:resetString",
    element: <PasswordReset />
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App;
