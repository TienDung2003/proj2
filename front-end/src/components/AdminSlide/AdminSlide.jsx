import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Space, Popconfirm, Select } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { WrapperUploadFile } from './style';
import { getBase64 } from '../../utils';
import * as SlideService from '../../services/SlideService';
import * as ProductService from '../../services/ProductService';
import * as message from '../../components/Message/Message';

const AdminSlide = () => {
    const user = useSelector((state) => state.user);

    const [stateSlide, setStateSlide] = useState({
        name: '',
        image: '',
        product: '',
    });

    // Lấy danh sách sản phẩm
    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: ProductService.getAllProduct,
    });

    // Lấy danh sách slide
    const { data: slides, refetch } = useQuery({
        queryKey: ['slides'],
        queryFn: SlideService.getAllSlides,
    });

    const handleOnChangeName = (e) => {
        setStateSlide((prev) => ({
            ...prev,
            name: e.target.value,
        }));
    };

    const handleOnChangeProduct = (value) => {
        setStateSlide((prev) => ({
            ...prev,
            product: value,
        }));
    };

    const handleOnChangeImage = async ({ fileList }) => {
        const file = fileList[0];
        if (file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            setStateSlide((prev) => ({
                ...prev,
                image: file.preview,
            }));
        }
    };

    const handleCreateSlide = async () => {
        try {
            const payload = {
                name: stateSlide.name,
                image: stateSlide.image,
                product: stateSlide.product || undefined,
            };
            const res = await SlideService.createSlide(payload, user?.access_token);
            if (res.status === 'OK') {
                message.success('Tạo slide thành công!');
                setStateSlide({ name: '', image: '', product: '' });
                refetch(); // refresh danh sách
            }
            console.log('pay', payload);
        } catch (error) {
            message.error('Tạo slide thất bại!');
            console.log('er', error);

        }
    };

    const handleDeleteSlide = async (id) => {
        try {
            await SlideService.deleteSlide(id, user?.access_token);
            message.success('Xóa slide thành công');
            refetch();
        } catch (err) {
            message.error('Xóa thất bại');
        }
    };

    const columns = [
        {
            title: 'Tên slide',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (img) => (
                <img src={img} alt="slide" style={{ width: 80, height: 60, objectFit: 'cover' }} />
            ),
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (product) => product?.name || 'Không có',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa?"
                        onConfirm={() => handleDeleteSlide(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const dataTable = slides?.map((slide) => ({ ...slide, key: slide._id })) || [];

    return (
        <div style={{ padding: 20 }}>
            <h2>Quản lý Slide</h2>

            <div style={{ marginBottom: 16 }}>
                <label>Tên slide:</label>
                <Input value={stateSlide.name} onChange={handleOnChangeName} />
            </div>

            <div style={{ marginBottom: 16 }}>
                <label>Chọn ảnh:</label>
                <WrapperUploadFile onChange={handleOnChangeImage} maxCount={1}>
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </WrapperUploadFile>
                {stateSlide.image && (
                    <img
                        src={stateSlide.image}
                        alt="preview"
                        style={{
                            height: 60,
                            width: 60,
                            objectFit: 'cover',
                            marginLeft: 10,
                        }}
                    />
                )}
            </div>

            <div style={{ marginBottom: 16 }}>
                <label>Sản phẩm liên kết:</label>
                <Select
                    value={stateSlide.product}
                    onChange={handleOnChangeProduct}
                    style={{ width: '100%' }}
                    placeholder="Chọn sản phẩm"
                    options={
                        products?.data?.map((p) => ({
                            label: p.name,
                            value: p._id,
                        })) || []
                    }
                />
            </div>

            <Button type="primary" onClick={handleCreateSlide} style={{ marginBottom: 24 }}>
                Tạo Slide
            </Button>

            <Table
                columns={columns}
                dataSource={dataTable}
                pagination={{ pageSize: 5 }}
                bordered
            />
        </div>
    );
};

export default AdminSlide;
