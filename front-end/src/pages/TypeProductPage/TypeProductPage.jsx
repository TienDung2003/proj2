import React, { useEffect, useState } from 'react'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row } from 'antd'
import { WrapperNavbar, WrapperProducts } from './style'
import { useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import NavBarComponent from '../../components/NavbarComponent/NavbarComponent'

const TypeProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)

    const { state } = useLocation()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    })
    const [filters, setFilters] = useState({
        stars: null,
        price: null,
        type: null,
    });

    const fetchProductType = async (type, page, limit, filters) => {
        setLoading(true);
        try {
            let combinedProducts = [];
            let totalItems = 0;

            if (filters.type == null) {
                // Nếu không có type filter, gọi API như bình thường
                const res = await ProductService.getProductType(type, page, limit, filters);
                if (res?.status === 'OK') {
                    combinedProducts = res?.data;
                    totalItems = res?.totalItems || res?.data?.length; // Tổng số sản phẩm
                }
            } else {
                // Nếu có type filter, duyệt qua list_type
                const list_type = filters.type;
                const promises = list_type.map((typeItem) =>
                    ProductService.getProductType(typeItem, 0, 1000, filters) // Gọi API với limit lớn để lấy tất cả sản phẩm
                );
                const results = await Promise.all(promises);

                results.forEach((res) => {
                    if (res?.status === 'OK') {
                        combinedProducts = [...combinedProducts, ...res?.data];
                        totalItems += res?.data?.length || 0; // Tổng số sản phẩm từ các loại
                    }
                });
            }
            console.log(filters);
            if (filters.rating) {
                // Lọc sản phẩm theo số sao
                combinedProducts = combinedProducts.filter((product) => product.rating >= filters.rating);
            }
            if (filters.price) {
                // Lọc sản phẩm theo giá
                if (filters.price === "above-5m") {
                    console.log('above-5m');
                    console.log(combinedProducts);
                    combinedProducts = combinedProducts.filter((product) => {
                        const price = product.price;
                        return price >= 5000000;
                    });
                    console.log(combinedProducts);
                }
                if (filters.price === "under-2m") {
                    combinedProducts = combinedProducts.filter((product) => {
                        const price = product.price;
                        return price < 2000000;
                    });
                }
                if (filters.price === "2-5m") {
                    combinedProducts = combinedProducts.filter((product) => {
                        const price = product.price;
                        return price >= 2000000 && price < 5000000;
                    });
                }
                // combinedProducts = combinedProducts.filter((product) => {
                //     const price = product.price - (product.price * product.discount) / 100;
                //     return price >= filters.price[0] && price <= filters.price[1];
                // });
            }
            totalItems = combinedProducts.length;
            console.log(totalItems);
            // Phân trang sản phẩm (slice theo `page` và `limit`)
            const startIndex = page * limit;
            const paginatedProducts = combinedProducts.slice(startIndex, startIndex + limit);

            setProducts(paginatedProducts);
            setPanigate({ ...panigate, total: totalItems }); // Cập nhật tổng số sản phẩm
        } catch (error) {
            console.error('Error fetching product types:', error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        if (state || filters.stars || filters.price || filters.type) {
            fetchProductType(state, panigate.page, panigate.limit, filters);
        }
        const content = document.querySelector('.content-container');
        if (content) {
            content.style.marginBottom = '50px'; // Đặt khoảng cách cách footer
        }
    }, [state, panigate.page, panigate.limit, filters]);

    const onChange = (current, pageSize) => {
        setPanigate({ ...panigate, page: current - 1, limit: pageSize })
    }

    const handleFilterChange = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }))
        setPanigate({ ...panigate, page: 0 }) // Reset page to 0 when applying new filters
    }

    return (
        <Loading isLoading={loading}>
            <div style={{ width: '100%', background: '#efefef', height: 'calc(100vh - 64px)' }}>
                <div style={{ width: '1270px', margin: '0 auto', height: '100%' }}>
                    <Row style={{ flexWrap: 'nowrap', paddingTop: '10px', height: 'calc(100% - 20px)' }}>
                        <WrapperNavbar span={4}>
                            <NavBarComponent onFilterChange={handleFilterChange} />
                        </WrapperNavbar>
                        <Col span={20} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <WrapperProducts>
                                {products
                                    ?.filter((pro) => {
                                        if (searchDebounce === '') {
                                            return pro
                                        } else if (pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                                            return pro
                                        }
                                    })
                                    ?.map((product) => (
                                        <CardComponent
                                            key={product._id}
                                            countInStock={product.countInStock}
                                            description={product.description}
                                            image={product.image}
                                            name={product.name}
                                            price={product.price}
                                            rating={product.rating}
                                            type={product.type}
                                            selled={product.selled}
                                            discount={product.discount}
                                            id={product._id}
                                        />
                                    ))}
                            </WrapperProducts>
                            <Pagination
                                defaultCurrent={panigate.page + 1}
                                total={panigate?.total}
                                onChange={onChange}
                                style={{ textAlign: 'center', marginTop: '10px' }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    )
}

export default TypeProductPage
