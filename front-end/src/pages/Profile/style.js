import styled from "styled-components";
import { Upload } from 'antd';
export const WrapperHeader = styled.h1`
 color: var(--primary-color);
    font-size: 26px;
    marginbottom: 20px;
`

export const WrapperContentProfile = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  width: 600px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 10px;
  gap: 30px;
`

export const WrapperLabel = styled.label`
  color: #000;
  font-size: 12px;
  line-height: 30px;
  font-weight: 600;
  width: 60px;
  text-align: left;
`

export const WrapperInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const WrapperUploadFile = styled(Upload)`
  & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  & .ant-upload-list.ant-upload-list-text {
      display: none;
  }
`