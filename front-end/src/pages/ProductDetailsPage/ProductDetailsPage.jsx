import React from "react";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { useNavigate, useParams } from "react-router-dom";
import * as ProductService from '../../services/ProductService'
import { useEffect, useState } from "react";
const ProductDetailsPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [type, setType] = useState('');
    const [name, setName] = useState('');
    const handleNavigatetype = (type) => {
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, { state: type })
    }
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await ProductService.getDetailsProduct(id); // gọi API theo id
                const product = res.data;
                if (product?.type) {
                    setType(product.type); // set type vào state
                }
                if (product?.name) {
                    setName(product.name); // set name vào state
                }
                console.log('res', product);


            } catch (error) {
                console.error('Lỗi lấy sản phẩm:', error);
            }
        };

        fetchProduct();
    }, []);
    console.log('id', id);
    console.log('namw', name);
    console.log('id', id);

    return (
        <div style={{ height: '100vh', width: '100%', background: '#efefef' }}>
            <div style={{ width: '1270px', margin: '0 auto', height: '100%' }}>
                <h5 style={{ margin: 0, padding: '20px 0', color: '#707070', boxSizing: 'border-box' }}>
                    <span
                        style={{
                            cursor: 'pointer',
                            fontWeight: 'bold',

                            transition: 'color 0.3s',
                        }}
                        onClick={() => navigate('/')}
                        onMouseEnter={(e) => e.target.style.color = '#1a73e8'}
                        onMouseLeave={(e) => e.target.style.color = '#707070'}
                    >Trang chủ</span> <span> &gt; </span>
                    <span style={{
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: '#707070',
                        transition: 'color 0.3s',
                    }}
                        onMouseEnter={(e) => e.target.style.color = '#1a73e8'}
                        onMouseLeave={(e) => e.target.style.color = '#707070'} onClick={() => handleNavigatetype(type)}> {type} </span><span> &gt; </span>{name}</h5>
                <ProductDetailsComponent idProduct={id} />


            </div>
        </div>
    );
};

export default ProductDetailsPage;