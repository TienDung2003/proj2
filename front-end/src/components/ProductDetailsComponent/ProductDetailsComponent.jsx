import { Col, Image, Rate, Row } from 'antd'
import React from 'react'
import { WrapperStyleImageSmall, WrapperDiscountTextProduct, WrapperDiscription, WrapperCurrentPriceTextProduct, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleTextSell, WrapperPriceProduct, WrapperOriginalPriceTextProduct, WrapperAddressProduct, WrapperQualityProduct, WrapperInputNumber, WrapperBtnQualityProduct, ChangeAddress } from './style'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct, resetOrder } from '../../redux/slices/orderSlice'
import { convertPrice, initFacebookSDK } from '../../utils'
import { useEffect } from 'react'
import * as message from '../Message/Message'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'
import PriceDetailPopup from '../PriceDetailPopup/PriceDetailPopup'
import * as CartService from '../../services/CartService';
const ProductDetailsComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [errorLimitOrder, setErrorLimitOrder] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const onChange = (value) => {
        setNumProduct(Number(value))
    }

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }

    useEffect(() => {
        initFacebookSDK()
    }, [])

    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
        if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
            setErrorLimitOrder(false)
        } else if (productDetails?.countInStock === 0) {
            setErrorLimitOrder(true)
        }
    }, [numProduct])

    useEffect(() => {
        if (order.isSucessOrder) {
            setLoading(true)
            message.success('Đã thêm vào giỏ hàng')
            setLoading(false)
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSucessOrder])

    const handleChangeCount = (type, limited) => {
        if (type === 'increase') {
            if (!limited) {
                setNumProduct(numProduct + 1)
            }
        } else {
            if (!limited) {
                setNumProduct(numProduct - 1)
            }
        }
    }


    const { isPending, data: productDetails } = useQuery({
        queryKey: ['product-details', idProduct],
        queryFn: fetchGetDetailsProduct,
        enabled: !!idProduct,

    });

    const handleAddOrderProduct = async () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname });
        } else {
            const orderItem = {
                name: productDetails?.name,
                amount: numProduct,
                image: productDetails?.image,
                price: productDetails?.price,
                product: productDetails?._id,
                discount: productDetails?.discount,
                countInstock: productDetails?.countInStock,
            };

            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id);
            const isAvailable =
                (orderRedux?.amount + numProduct) <= orderRedux?.countInstock ||
                (!orderRedux && productDetails?.countInStock > 0);

            if (isAvailable) {
                dispatch(addOrderProduct({ orderItem }));

                // Gọi API lưu vào DB
                try {
                    await CartService.saveCartToDB({
                        userId: user?.id,
                        cartItems: [...order?.orderItems, orderItem],
                    });
                    message.success('Đã thêm vào giỏ hàng');
                } catch (err) {
                    console.log('Lỗi lưu cart vào DB:', err);
                    message.error('Lỗi khi lưu giỏ hàng vào hệ thống');
                }
            } else {
                setErrorLimitOrder(true);
            }
        }
    };
    console.log('href', productDetails)
    return (
        <Loading isLoading={isPending || loading} >
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px', height: '100%' }}>
                <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                    <Image src={productDetails?.image} alt="image prodcut" preview={false} />

                </Col>
                <Col span={14} style={{ paddingLeft: '10px' }}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <div>
                        {productDetails?.description.split('.').map((line, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img width="16" height="16" src="https://salt.tikicdn.com/ts/upload/81/61/d4/92e63f173e7983b86492be159fe0cff4.png" alt="blue-check" />

                                <span>{line}</span>

                            </div>
                        ))}
                    </div>

                    <div>
                        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                        <WrapperStyleTextSell> |  Đã Bán {productDetails?.selled}</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperCurrentPriceTextProduct>
                            {convertPrice(productDetails?.price - productDetails?.price * productDetails?.discount / 100)}
                            <sup style={{
                                top: '-0.5em',
                                fontSize: '75%',
                                lineHeight: '0',
                                position: 'relative',
                                verticalAlign: 'baseline'
                            }}>
                                ₫
                            </sup>

                        </WrapperCurrentPriceTextProduct>
                        <WrapperDiscountTextProduct >-{productDetails?.discount}%</WrapperDiscountTextProduct>
                        <WrapperOriginalPriceTextProduct style={{ textDecoration: 'line-through' }}>
                            {convertPrice(productDetails?.price)}
                            <sup style={{
                                top: '-0.5em',
                                fontSize: '75%',
                                lineHeight: '0',
                                position: 'relative',
                                verticalAlign: 'baseline'
                            }}>
                                ₫
                            </sup>
                        </WrapperOriginalPriceTextProduct>
                        <PriceDetailPopup
                            originalPrice={convertPrice(productDetails?.price)}
                            salePrice={productDetails?.discount}
                            finalPrice={convertPrice(productDetails?.price - productDetails?.price * productDetails?.discount / 100)}
                        />
                    </WrapperPriceProduct>
                    <WrapperAddressProduct>
                        <span>Giao đến </span>
                        <span className='address'>{user?.address}</span> -
                        <span class='change-address' onClick={user?.access_token ? () => navigate("/order") : navigate("/sign-in")}> Đổi địa chỉ</span>

                    </WrapperAddressProduct>
                    <LikeButtonComponent
                        dataHref={process.env.REACT_APP_IS_LOCAL
                            ? "https://developers.facebook.com/docs/plugins/"
                            : window.location.href

                        }

                    />


                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                        <div style={{ marginBottom: '10px' }}>Số lượng</div>
                        <WrapperQualityProduct>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', numProduct === 1)}>
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                            <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock} min={1} value={numProduct} size="small" />
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', numProduct === productDetails?.countInStock)}>
                                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                        </WrapperQualityProduct>
                    </div>
                    <div style={{ display: 'flex', aliggItems: 'center', gap: '12px' }}>
                        <div>
                            <ButtonComponent
                                size={40}
                                styleButton={{
                                    background: 'rgb(255, 57, 69)',
                                    height: '48px',
                                    width: '220px',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}
                                onClick={handleAddOrderProduct}
                                textbutton={'Thêm vào giỏ hàng'}
                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                            ></ButtonComponent>
                            {errorLimitOrder && <div style={{ color: 'red' }}>Sản phẩm hết hàng </div>}
                        </div>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: '#fff',
                                height: '48px',
                                width: '220px',
                                border: '1px solid rgb(13, 92, 182)',
                                borderRadius: '4px'
                            }}
                            textbutton={'Mua trả sau'}
                            styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
                        ></ButtonComponent>
                    </div>
                </Col>
                <CommentComponent
                    dataHref={process.env.REACT_APP_IS_LOCAL
                        ? "https://developers.facebook.com/docs/plugins/comments#configurator"
                        : window.location.href
                    }
                    width="1270"
                />
            </Row >

        </Loading >
    )
}

export default ProductDetailsComponent