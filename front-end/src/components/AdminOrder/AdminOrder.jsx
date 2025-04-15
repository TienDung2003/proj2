import { Button, Space } from "antd";
import React, { useState, useRef } from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { convertPrice, getBase64 } from "../../utils";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { orderContant } from "../../contant";
import PieChartComponent from "./PieChart";
import Highlighter from "react-highlight-words";

const OrderAdmin = () => {
    const user = useSelector((state) => state?.user);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        return res;
    };

    const queryOrder = useQuery({ queryKey: ["orders"], queryFn: getAllOrder });
    const { isLoading: isLoadingOrders, data: orders } = queryOrder;

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: "User name",
            dataIndex: "userName",
            sorter: (a, b) => a.userName.length - b.userName.length,
            ...getColumnSearchProps("userName"),
        },
        {
            title: "Phone",
            dataIndex: "phone",
            sorter: (a, b) => a.phone.length - b.phone.length,
            ...getColumnSearchProps("phone"),
        },
        {
            title: "Address",
            dataIndex: "address",
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps("address"),
        },
        {
            title: "Paided",
            dataIndex: "isPaid",
            filters: [
                {
                    text: "TRUE",
                    value: "TRUE",
                },
                {
                    text: "FALSE",
                    value: "FALSE",
                },
            ],
            onFilter: (value, record) => {
                if (value === "TRUE") {
                    return record.isPaid === "TRUE";
                }
                return record.isPaid === "FALSE";
            },
        },
        {
            title: "Shipped",
            dataIndex: "isDelivered",
            filters: [
                {
                    text: "TRUE",
                    value: "TRUE",
                },
                {
                    text: "FALSE",
                    value: "FALSE",
                },
            ],
            onFilter: (value, record) => {
                if (value === "TRUE") {
                    return record.isDelivered === "TRUE";
                }
                return record.isDelivered === "FALSE";
            },
        },
        {
            title: "Payment method",
            dataIndex: "paymentMethod",

            filters: [
                {
                    text: "Thanh toán tiền mặt khi nhận hàng",
                    value: "Thanh toán tiền mặt khi nhận hàng",
                },
                {
                    text: "Thanh toán bằng paypal",
                    value: "Thanh toán bằng paypal",
                },
            ],
            onFilter: (value, record) => {
                if (value === "Thanh toán tiền mặt khi nhận hàng") {
                    return (
                        record.paymentMethod ===
                        "Thanh toán tiền mặt khi nhận hàng"
                    );
                }
                return record.paymentMethod === "Thanh toán bằng paypal";
            },
        },
        {
            title: "Total price",
            dataIndex: "totalPrice",
            sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
        },
    ];

    const dataTable =
        orders?.data?.length &&
        orders?.data?.map((order) => {
            return {
                ...order,
                key: order._id,
                userName: order?.shippingAddress?.fullName,
                phone: order?.shippingAddress?.phone,
                address: order?.shippingAddress?.address,
                paymentMethod: orderContant.payment[order?.paymentMethod],
                isPaid: order?.isPaid ? "TRUE" : "FALSE",
                isDelivered: order?.isDelivered ? "TRUE" : "FALSE",
                totalPrice: convertPrice(order?.totalPrice),
            };
        });

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{ height: 200, width: 200 }}>
                <PieChartComponent data={orders?.data} />
            </div>
            <div style={{ marginTop: "20px" }}>
                <TableComponent
                    enableRowSelection={false}
                    columns={columns}
                    isLoading={isLoadingOrders}
                    data={dataTable}
                />
            </div>
        </div>
    );
};

export default OrderAdmin;
