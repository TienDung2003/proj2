import React from 'react'
import { WrapperInputStyle } from './style'

const InputForm = (props) => {
    const { placeholder = 'Nhập text', onChange, value, ...rests } = props
    const handleOnchangeInput = (e) => {
        onChange?.(e.target.value)
    }
    return (
        <WrapperInputStyle placeholder={placeholder} value={value} {...rests} onChange={handleOnchangeInput} />
    )
}

export default InputForm    