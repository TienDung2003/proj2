import { Layout, Menu } from "antd";
import React, { useState, useMemo } from "react";
import { getItem } from "../../utils";
import {
    UserOutlined,
    AppstoreOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import * as OrderService from "../../services/OrderService";
import * as ProductService from "../../services/ProductService";
import * as UserService from "../../services/UserService";
import CustomizedContent from "./CustomizedContent";
import { useSelector } from "react-redux";
import { useQueries } from "@tanstack/react-query";
import Loading from "../../components/LoadingComponent/Loading";
import AdminOrder from "../../components/AdminOrder/AdminOrder";
import { Navigate } from "react-router-dom";
import { PictureOutlined } from "@ant-design/icons";
import AdminSlide from "../../components/AdminSlide/AdminSlide";
const { Sider, Content } = Layout;

const AdminPage = () => {
    const user = useSelector((state) => state?.user);
    const [keySelected, setKeySelected] = useState("");
    const [collapsed, setCollapsed] = useState(false);

    // Call APIs
    const getAllOrder = async () => {
        try {
            const res = await OrderService.getAllOrder(user?.access_token);
            return { data: res?.data, key: "orders" };
        } catch {
            return { data: [], key: "orders" };
        }
    };

    const getAllProducts = async () => {
        try {
            const res = await ProductService.getAllProduct();
            return { data: res?.data, key: "products" };
        } catch {
            return { data: [], key: "products" };
        }
    };

    const getAllUsers = async () => {
        try {
            const res = await UserService.getAllUser(user?.access_token);
            return { data: res?.data, key: "users" };
        } catch {
            return { data: [], key: "users" };
        }
    };

    const queries = useQueries({
        queries: [
            { queryKey: ["products"], queryFn: getAllProducts, staleTime: 1000 * 60 },
            { queryKey: ["users"], queryFn: getAllUsers, staleTime: 1000 * 60 },
            { queryKey: ["orders"], queryFn: getAllOrder, staleTime: 1000 * 60 },
        ],
    });


    const memoCount = useMemo(() => {
        const result = {};
        queries.forEach((query) => {
            result[query?.data?.key] = query?.data?.data?.length || 0;
        });
        return result;
    }, [queries]);

    const isLoading = queries.some((q) => q.isPending);

    const items = [
        getItem("Người dùng", "users", <UserOutlined />),
        getItem("Sản phẩm", "products", <AppstoreOutlined />),
        getItem("Đơn hàng", "orders", <ShoppingCartOutlined />),
        getItem("Slide", "slides", <PictureOutlined />),
    ];

    const handleOnCLick = ({ key }) => {
        setKeySelected(key);
    };

    const COLORS = {
        users: ["#e66465", "#9198e5"],
        products: ["#a8c0ff", "#3f2b96"],
        orders: ["#11998e", "#38ef7d"],
    };

    const renderPage = (key) => {
        switch (key) {
            case "users":
                return <AdminUser />;
            case "products":
                return <AdminProduct />;
            case "orders":
                return <AdminOrder />;
            case "slides":
                return <AdminSlide />;
            default:
                return null;
        }
    };

    if (!user) return <Loading isLoading />;
    if (!user?.isAdmin) return <Navigate to="/notfound" />;

    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart />
            <Layout style={{ minHeight: "100vh" }}>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    width={256}
                    style={{
                        background: "#fff",
                        boxShadow: "1px 0 2px rgba(0,0,0,0.1)",
                    }}
                >
                    <Menu
                        mode="inline"
                        items={items}
                        onClick={handleOnCLick}
                        selectedKeys={[keySelected]}
                    />
                </Sider>
                <Layout>
                    <Content style={{ padding: "15px" }}>
                        <Loading isLoading={isLoading}>
                            {!keySelected && (
                                <CustomizedContent
                                    data={memoCount}
                                    colors={COLORS}
                                    setKeySelected={setKeySelected}
                                />
                            )}
                            {renderPage(keySelected)}
                        </Loading>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default AdminPage;
