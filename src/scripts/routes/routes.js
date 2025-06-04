import HomePage from "../pages/home/BerandaPage";
import AboutPage from "../pages/about/aboutPage";
import DetailPage from "../pages/detail/detailPage";
import TambahPage from "../pages/add/FormInputPage";
import LoginPage from "../pages/login/loginPage";
import SignUpPage from "../pages/register/registerPage";

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/detail/:id": new DetailPage(),
  "/tambah": new TambahPage(),
  "/login": new LoginPage(),
  "/register": new SignUpPage(),
};

export default routes;
