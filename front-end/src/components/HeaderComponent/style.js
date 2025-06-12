import { Row } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    background-color: #3397f3;
    align-items: center;
    flex-wrap: nowrap;
    width: 100%;
    padding: 10px 0;
`;

export const WrapperTextHeader = styled.div`
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    display: block;
    text-align: right;
    margin-right: 40px;
    &:hover {
        opacity: 0.5;
    }
`;

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    margin-left: 20px;
    max-width: 200px;
    padding: 2px;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
        background-color: rgba(39, 39, 42, 0.12);
    }
`;

export const WrapperHeaderCart = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1px 2px;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
        background-color: rgba(39, 39, 42, 0.12);
    }
`;

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
    margin-left: 5px;
    white-space: nowrap;
`;

export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: rgb(26, 148, 255);
    }
`;
