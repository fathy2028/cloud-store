import {Routes,Route} from "react-router-dom"
import HomePage from "./pages/HomePage";
import AboutPage from './pages/AboutPage';
import ContactPage from "./pages/ContactPage";
import PolicyPage from "./pages/PolicyPage";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import DashboardPage from "./pages/user/DashboardPage";
import PrivateRoutes from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateCategory from "./pages/admin/CreateCategory";
import CreateProduct from "./pages/admin/CreateProduct";
import Users from "./pages/admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Products from "./pages/admin/Products";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Category from "./pages/Category";
import CartPage from "./pages/CartPage";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ProfileAdmin from "./pages/admin/ProfileAdmin";
import AllOrders from "./pages/admin/AllOrders";
function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/product/:id" element={<ProductDetails/>} />
      <Route path="/category/:id" element={<Category/>} />
      <Route path="/search" element={<Search/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/dashboard" element={<PrivateRoutes/>}>
      <Route path="user" element={<DashboardPage/>} />
      <Route path="user/orders" element={<Orders/>} />
      <Route path="user/profile" element={<Profile/>} />
      </Route>
      <Route path="/dashboard" element={<AdminRoute/>}>
      <Route path="admin" element={<AdminDashboard/>} />
      <Route path="admin/create-category" element={<CreateCategory/>} />
      <Route path="admin/create-product" element={<CreateProduct/>} />
      <Route path="admin/allusers" element={<Users/>} />
      <Route path="admin/products" element={<Products/>} />
      <Route path="admin/adminprofile" element={<ProfileAdmin/>} />
      <Route path="admin/allorders" element={<AllOrders/>} />
      </Route>
      <Route path="/forgotpassword" element={<ForgotPassword/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/aboutus" element={<AboutPage/>} />
      <Route path="/contactus" element={<ContactPage/>} />
      <Route path="/policy" element={<PolicyPage/>} />
      <Route path="/*" element={<PageNotFound/>} />
    </Routes>
    </>
  );
}

export default App;
