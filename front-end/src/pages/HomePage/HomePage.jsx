import React from 'react'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import * as SlideService from '../../services/SlideService'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'
import Footer from '../../components/FooterComponent/Footer'

const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(6)
    const [typeProducts, setTypeProducts] = useState([])
    const [slides, setSlides] = useState([])

    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await ProductService.getAllProduct(search, limit)
        return res
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
    }

    const fetchAllSlides = async () => {
        try {
            const res = await SlideService.getAllSlides()
            if (res) {
                setSlides(res)
            }
        } catch (error) {
            console.error("Lỗi khi fetch slide:", error)
        }
    }

    const { isLoading, data: products, isPreviousData } = useQuery({
        queryKey: ['products', limit, searchDebounce],
        queryFn: fetchProductAll,
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    });

    useEffect(() => {
        fetchAllTypeProduct()
        fetchAllSlides()
    }, [])

    return (
        <Loading isLoading={isLoading || loading}>
            <div style={{ width: '1270px', margin: '0 auto', minHeight: 'calc(100vh - 50px)', display: 'flex', flexDirection: 'column' }}>
                <WrapperTypeProduct>
                    {typeProducts.map((item) => {
                        return (
                            <TypeProduct name={item} key={item} />
                        )
                    })}
                </WrapperTypeProduct>

                <div style={{ flex: 1, marginTop: '20px' }}>
                    <SliderComponent products={slides.map(slide => ({
                        id: slide._id,
                        image: slide.image,
                        name: slide.name,
                        productId: slide?.product?._id || null
                    }))} />
                </div>

                <WrapperProducts style={{ marginBottom: '50px' }}>
                    {products?.data?.map((product) => {
                        return (
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
                        )
                    })}
                </WrapperProducts>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <WrapperButtonMore
                        textbutton={isPreviousData ? 'Load more' : "Xem thêm"}
                        type="outline"
                        styleButton={{
                            border: `1px solid ${products?.total === products?.data?.length ? '#f5f5f5' : '#9255FD'}`,
                            color: `${products?.total === products?.data?.length ? '#f5f5f5' : '#9255FD'}`,
                            width: '240px',
                            height: '38px',
                            borderRadius: '4px',
                            marginTop: '20px'
                        }}
                        disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                        styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && '#fff' }}
                        onClick={() => setLimit((prev) => prev + 6)}
                    />
                </div>
            </div>
            <Footer />
        </Loading>
    )
}

export default HomePage
