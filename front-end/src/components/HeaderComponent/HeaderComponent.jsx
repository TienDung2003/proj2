import { Col, Flex, Row } from 'antd'
import React from 'react'
import { WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import Search from 'antd/es/transfer/search'
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from "react-router-dom";

const HeaderComponent = () => {
    const navigate = useNavigate();
    const handleNavigateLogin = () => {
        navigate("/signin");
    };

    const handleNavigateProf = () => {
        navigate("/profile-user");
    };
    const handleNavigateHomePage = () => {
        navigate("/");
    };
    const handleNavigateSystem = () => {
        navigate("/system/admin");
    }

    const handleNavigateShoppingCart = () => {
        navigate("/order");
    }
    return (
        <div>
            <WrapperHeader gutter={16}>
                <Col span={6}>
                    <a href='/'><WrapperTextHeader onClick={handleNavigateHomePage}>PROJECT II</WrapperTextHeader></a>
                </Col>
                <Col span={12}>
                    <ButtonInputSearch
                        size="large"
                        textButton="Tìm kiếm"
                        placeholder="input search text"

                    //onSearch={onSearch}
                    />
                </Col>
                <Col span={6} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <WrapperHeaderAccout>
                        <UserOutlined style={{ fontSize: '30px' }} />
                        <div onClick={handleNavigateLogin} style={{ cursor: "pointer" }}>
                            <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                            <div>
                                <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                                <CaretDownOutlined />
                            </div>
                        </div>
                    </WrapperHeaderAccout>
                    <div onClick={handleNavigateShoppingCart} style={{ cursor: "pointer" }}>
                        <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff ' }} />
                        <WrapperTextHeaderSmall >Giỏ Hàng</WrapperTextHeaderSmall>
                    </div>


                </Col>
            </WrapperHeader>
        </div >
    )
}

export default HeaderComponent