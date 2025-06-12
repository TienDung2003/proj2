import React, { Fragment, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { routes } from "./routes";
import { isJsonString } from "./utils";
import { jwtDecode } from 'jwt-decode';

import * as UserService from "./services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { resetUser, updateUser } from "./redux/slices/userSlice";
import Loading from "./components/LoadingComponent/LoadingComponent";
import Footer from "./components/FooterComponent/Footer";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const isLoggedIn = !!(
    user?.access_token || localStorage.getItem("access_token")
  );
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const { storageData, decoded } = handleDecoded();
      if (decoded?.id) {
        await handleGetDetailsUser(decoded?.id, storageData);
      }
      setIsInitialized(true); // ✅ Mark đã khởi tạo user xong
      setIsLoading(false);
    };
    init();
  }, []);
  const handleDecoded = () => {
    let storageData =
      user?.access_token || localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      let storageRefreshToken = localStorage.getItem("refresh_token");
      const refreshToken = JSON.parse(storageRefreshToken);
      const decodedRefreshToken = jwtDecode(refreshToken);
      if (decoded?.exp < currentTime.getTime() / 1000) {
        if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
          const data = await UserService.refreshToken(refreshToken);
          config.headers[
            "Authorization"
          ] = `Bearer ${data?.access_token}`;
        } else {
          dispatch(resetUser());
        }
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storageRefreshToken);
    const res = await UserService.getDetailsUser(id, token);
    dispatch(
      updateUser({
        ...res?.data,
        access_token: token,
        refreshToken: refreshToken,
      })
    );
  };
  if (!isInitialized) {
    return <Loading isLoading />;
  }
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              if (
                isLoggedIn &&
                ["/sign-in", "/sign-up"].includes(route.path)
              ) {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<Navigate to="/" replace />}
                  />
                );
              }

              if (
                route.path === "/system/admin" && isInitialized &&
                !user.isAdmin
              ) {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <Navigate to="not-found" replace />
                    }
                  />
                );
              }

              const Page = route.page;

              const isCheckAuth =
                !route.isPrivated || user.isAdmin;
              const Layout = route.isShowHeader
                ? DefaultComponent
                : Fragment;

              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                      {/* <Footer /> */}
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </Loading>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
