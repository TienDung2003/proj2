import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Card } from 'antd';
import { Link } from 'react-router-dom';

export default function SliderComponent({ products }) {
    if (!products || products.length === 0) {
        return <div className="text-center py-6 text-gray-500">Không có slide nào để hiển thị</div>;
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <Swiper
                slidesPerView={2}
                spaceBetween={20}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                modules={[Navigation, Pagination, Autoplay]}
                className="mySwiper"
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        <Card
                            hoverable
                            cover={
                                <Link to={product.productId ? `/product-details/${product.productId}` : '#'}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                        style={{
                                            width: '100%',
                                            height: '300px',
                                            objectFit: 'cover',
                                            borderRadius: '12px',
                                        }}
                                    />
                                </Link>
                            }
                            // style={{ borderRadius: '16px', overflow: 'hidden' }}
                            // bodyStyle={{ padding: '10px', textAlign: 'center' }}
                            className="shadow-lg rounded-2xl"
                        >

                        </Card>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
