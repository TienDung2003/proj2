import styled from "styled-components";

export const WrapperType = styled.div`
  padding: 10px 10px;
  border-radius: 8px;
  background-color: #f0f0f0;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  
  &:hover {
   background-color: #ccc;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`