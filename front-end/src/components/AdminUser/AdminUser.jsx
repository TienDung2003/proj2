import { Button, Form, Space } from "antd";
import React from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import Loading from "../LoadingComponent/LoadingComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import { getBase64 } from "../../utils";
import { useEffect } from "react";
import { message } from "antd";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const AdminUser = () => {
    const [rowSelected, setRowSelected] = useState("");
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const user = useSelector((state) => state?.user);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const [stateUserDetails, setStateUserDetails] = useState({
        name: "",
        email: "",
        phone: "",
        isAdmin: false,
        avatar: "",
        address: "",
    });

    const [form] = Form.useForm();

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = UserService.updateUser(id, { ...rests }, token);
        return res;
    });

    const mutationDeletedMany = useMutationHooks((data) => {
        const { token, ...ids } = data;
        const res = UserService.deleteManyUser(ids, token);
        return res;
    });

    const mutationDeleted = useMutationHooks((data) => {
        const { id, token } = data;
        const res = UserService.deleteUser(id, token);
        return res;
    });

    const handleDelteManyUsers = (ids) => {
        mutationDeletedMany.mutate(
            { ids: ids, token: user?.access_token },
            {
                onSettled: () => {
                    queryClient.invalidateQueries(["users"]);
                },
            }
        );
    };

    const fetchGetDetailsUser = async (rowSelected, access_token) => {
        const res = await UserService.getDetailsUser(rowSelected, access_token);
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
                address: res?.data?.address,
                avatar: res.data?.avatar,
            });
        }

    };

    useEffect(() => {
        form.setFieldsValue(stateUserDetails);
    }, [form, stateUserDetails]);

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true);
            fetchGetDetailsUser(rowSelected, user?.access_token);
            setIsLoadingUpdate(false);
        }
    }, [rowSelected, isOpenDrawer]);

    const handleDetailsUser = () => {
        setIsOpenDrawer(true);
    };

    const {
        data: dataUpdated,
        isPending: isLoadingUpdated,
        isSuccess: isSuccessUpdated,
        isError: isErrorUpdated,
    } = mutationUpdate;
    const {
        data: dataDeleted,
        isPending: isLoadingDeleted,
        isSuccess: isSuccessDeleted,
        isError: isErrorDeleted,
    } = mutationDeleted;
    const {
        data: dataDeletedMany,
        isPending: isLoadingDeletedMany,
        isSuccess: isSuccessDeletedMany,
        isError: isErrorDeletedMany,
    } = mutationDeletedMany;

    const queryClient = useQueryClient();
    const users = queryClient.getQueryData(["users"]);
    const isFetchingUser = useIsFetching(["users"]);
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined
                    style={{
                        color: "red",
                        fontSize: "30px",
                        cursor: "pointer",
                    }}
                    onClick={() => setIsModalOpenDelete(true)}
                />
                <EditOutlined
                    style={{
                        color: "orange",
                        fontSize: "30px",
                        cursor: "pointer",
                    }}
                    onClick={handleDetailsUser}
                />
            </div>
        );
    };

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
            title: "Name",
            dataIndex: "name",
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps("name"),
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps("email"),
        },
        {
            title: "Address",
            dataIndex: "address",
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps("address"),
        },
        {
            title: "Admin",
            dataIndex: "isAdmin",
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
            onFilter: (value, record) => record.isAdmin === value,
        },
        {
            title: "Phone",
            dataIndex: "phone",
            sorter: (a, b) => a.phone - b.phone,
            ...getColumnSearchProps("phone"),
        },
        {
            title: "Action",
            dataIndex: "action",
            render: renderAction,
        },
    ];
    const dataTable =
        users?.data?.length > 0 &&
        users?.data?.map((user) => {
            return {
                ...user,
                key: user._id,
                isAdmin: user.isAdmin ? "TRUE" : "FALSE",
            };
        });

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === "OK") {
            message.success("Xóa người dùng thành công");
            handleCancelDelete();
        } else if (isErrorDeleted) {
            message.error("Xóa người dùng thất bại");
        }
    }, [isSuccessDeleted]);

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
            message.success("Xóa tất cả người dùng thành công");
        } else if (isErrorDeletedMany) {
            message.error("Xóa tất cả người dùng thất bại");
        }
    }, [isSuccessDeletedMany]);

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: "",
            email: "",
            phone: "",
            isAdmin: false,
        });
        form.resetFields();
    };

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === "OK") {
            message.success("Cập nhật thông tin người dùng thành công");
            handleCloseDrawer();
        } else if (isErrorUpdated) {
            message.error("Cập nhật thông tin người dùng thất bại");
        }
    }, [isSuccessUpdated]);

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleDeleteUser = () => {
        mutationDeleted.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryClient.invalidateQueries(["users"]);
                },
            }
        );
    };

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetails({
            ...stateUserDetails,
            avatar: file.preview,
        });
    };
    const onUpdateUser = () => {
        mutationUpdate.mutate(
            { id: rowSelected, token: user?.access_token, ...stateUserDetails },
            {
                onSettled: () => {
                    queryClient.invalidateQueries(["users"]);
                },
            }
        );
    };

    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>
            <div style={{ marginTop: "20px" }}>
                <TableComponent
                    enableRowSelection={true}
                    handleDelteMany={handleDelteManyUsers}
                    columns={columns}
                    data={dataTable}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelected(record.key);
                            },
                        };
                    }}
                />
            </div>
            <DrawerComponent
                title="Chi tiết người dùng"
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
                width="90%"
            >
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        onFinish={onUpdateUser}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your name!",
                                },
                            ]}
                        >
                            <InputComponent
                                value={stateUserDetails["name"]}
                                onChange={handleOnchangeDetails}
                                name="name"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your email!",
                                },
                            ]}
                        >
                            <InputComponent
                                value={stateUserDetails["email"]}
                                onChange={handleOnchangeDetails}
                                name="email"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your  phone!",
                                },
                            ]}
                        >
                            <InputComponent
                                value={stateUserDetails.phone}
                                onChange={handleOnchangeDetails}
                                name="phone"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Adress"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your  address!",
                                },
                            ]}
                        >
                            <InputComponent
                                value={stateUserDetails.address}
                                onChange={handleOnchangeDetails}
                                name="address"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Avatar"
                            name="avatar"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your image!",
                                },
                            ]}
                        >
                            <WrapperUploadFile
                                onChange={handleOnchangeAvatarDetails}
                                maxCount={1}
                            >
                                <Button>Select File</Button>
                                {stateUserDetails?.avatar && (
                                    <img
                                        src={stateUserDetails?.avatar}
                                        style={{
                                            height: "60px",
                                            width: "60px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            marginLeft: "10px",
                                        }}
                                        alt="avatar"
                                    />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent
                title="Xóa người dùng"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteUser}
            >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc xóa tài khoản này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    );
};

export default AdminUser;
