import { Table } from "antd";
import React, { useState } from "react";
import Loading from "../LoadingComponent/Loading";
import { Excel } from "antd-table-saveas-excel";
import { useMemo } from "react";

const TableComponent = (props) => {
    const {
        selectionType = "checkbox",
        data: dataSource = [],
        isLoading = false,
        columns = [],
        handleDelteMany,
        enableRowSelection = false, // Prop để bật/tắt checkbox
    } = props;

    const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

    const newColumnExport = useMemo(() => {
        const arr = columns?.filter((col) => col.dataIndex !== "action");
        return arr;
    }, [columns]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys);
        },
    };

    const handleDeleteAll = () => {
        handleDelteMany(rowSelectedKeys);
    };

    const exportExcel = () => {
        const excel = new Excel();
        excel
            .addSheet("test")
            .addColumns(newColumnExport)
            .addDataSource(dataSource, {
                str2Percent: true,
            })
            .saveAs("Excel.xlsx");
    };

    return (
        <Loading isLoading={isLoading}>
            {!!rowSelectedKeys.length && enableRowSelection && (
                <div
                    style={{
                        color: "red",
                        fontWeight: "bold",
                        marginBottom: "10px",
                        cursor: "pointer",
                    }}
                    onClick={handleDeleteAll}
                >
                    Xóa tất cả
                </div>
            )}
            <button
                style={{
                    padding: "4px",
                    marginBottom: "10px",
                }}
                onClick={exportExcel}
            >
                Export Excel
            </button>
            <Table
                {...props}
                rowSelection={
                    enableRowSelection
                        ? {
                              type: selectionType,
                              ...rowSelection,
                          }
                        : undefined
                }
                columns={columns}
                dataSource={dataSource}
            />
        </Loading>
    );
};

export default TableComponent;
