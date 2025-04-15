import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
    color: var(--primary-color);
    font-size: 26px;
    marginbottom: 20px;
`;

export const WrapContent = styled.div`
    display: flex;
    height: 100%;
`;
export const WrapperContentProfile = styled.div`
    display: flex;
    flex-direction: column;
    width: 700px;
    height: 400px;
    margin: 0 auto;
    padding: 30px;
    gap: 60px;
`;

export const WrapperContentAvatar = styled.div`
    display: flex;
    flex-direction: column;
    width: 400px;
    margin: 0 auto;
    padding: 30px;
`;

export const WrapperLabel = styled.label`
    color: #000;
    font-size: 14px;
    line-height: 30px;
    font-weight: 600;
    width: 60px;
    text-align: left;
`;

export const WrapperLabelAvatar = styled.label`
    color: #000;
    font-size: 14px;
    line-height: 30px;
    font-weight: 600;
`;

export const WrapperInput = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

export const WrapperAvatar = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    & .ant-upload-list-item-info {
        display: none;
    }
`;
