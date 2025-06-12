import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
    height: 64px;
    width: 64px;
`

export const WrapperStyleColImage = styled(Col)`
    flex-basis: unset;
    display: flex;
`

export const WrapperStyleNameProduct = styled.h1`
    color: rgb(36, 36, 36);
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    word-break: break-word;
`

export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120, 120, 120)
`
export const WrapperDiscription = styled.div`
    max-height: 80px;
  overflow: hidden;
`

export const WrapperPriceProduct = styled.div`
    background: rgb(250, 250, 250);
    gap: 8px;
    display: flex;
    align-items: center;
`
export const WrapperOriginalPriceTextProduct = styled.div`
font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    color: rgb(128, 128, 137);
    `
export const WrapperCurrentPriceTextProduct = styled.div`

    font-size: 24px;
    line-height: 150%;
   font-weight: bold;
    font-weight: 600;
   
    color: rgb(255, 66, 78);
`
export const WrapperDiscountTextProduct = styled.div`
font-weight: 400;
    font-size: 12px;
    line-height: 150%;
    padding: 0px 4px;
    background: rgb(245, 245, 250);
    border-radius: 8px;
    
`
export const WrapperAddressProduct = styled.div`
    span.address {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsisl
    };
    span.change-address {
        color: rgb(11, 116, 229);
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
        &:hover {
    color: darkblue;
  }
    }
`

export const WrapperQualityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    width: 120px;
    border: 1px solid #ccc;
    border-radius: 4px;
`

export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 40px;
        border-top: none;
        border-bottom: none;
        .ant-input-number-handler-wrap {
            display: none !important;
        }
    };
`

export const ChangeAddress = styled.span`
  color: blue;
 
  cursor: pointer;
  padding: 5px;

  &:hover {
    color: red;
  }
`;
