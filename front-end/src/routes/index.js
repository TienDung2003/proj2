import AdminPage from "../pages/AdminPage/AdminPage";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";
import HomePage from "../pages/HomePage/HomePage";
import MyOrderPage from "../pages/MyOrder/MyOrder";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import OrderSucess from "../pages/OrderSuccess/OrderSuccess";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";

export const routes = [
    {
        path: "/",
        page: HomePage,
        isShowHeader: true,
        isPrivated: false,
    },
    {
        path: "/order",
        page: OrderPage,
        isShowHeader: true,
        isPrivated: false,
    },
    {
        path: "/my-order",
        page: MyOrderPage,
        isShowHeader: true,
        isPrivated: false,
    },
    {
        path: "/details-order/:id",
        page: DetailsOrderPage,
        isShowHeader: true,
        isPrivated: false,
    },
    {
        path: "/payment",
        page: PaymentPage,
        isShowHeader: true,
        isPrivated: false,
    },
    {
        path: "/orderSuccess",
        page: OrderSucess,
        isShowHeader: true,
        isPrivated: false,
    },
    {
        path: "/products",
        page: ProductsPage,
        isShowHeader: true,
        isPrivated: false,
    },
    {
        path: "/product/:type",
        page: TypeProductPage,
        isShowHeader: true,
        isPrivated: false,
    },
    {
        path: "/sign-in",
        page: SignInPage,
        isShowHeader: false,
        isPrivated: false,
    },
    {
        path: "/sign-up",
        page: SignUpPage,
        isShowHeader: false,
        isPrivated: false,
    },
    {
        path: "/product-details/:id",
        page: ProductDetailsPage,
        isShowHeader: true,
        isPrivated: false,
    },
    {
        path: "/profile-user",
        page: ProfilePage,
        isShowHeader: true,
        isPrivated: false,
    },
    {
        path: "/system/admin",
        page: AdminPage,
        isShowHeader: false,
        isPrivated: true,
    },
    {
        path: "*",
        page: NotFoundPage,
        isPrivated: false,
    },
];
