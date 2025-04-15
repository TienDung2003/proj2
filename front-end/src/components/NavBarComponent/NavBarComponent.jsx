import { Checkbox, Rate } from 'antd'
import React, { useEffect, useState } from 'react'
import { WrapperContent, WrapperLableText, WrapperTextPrice } from './style'
import * as ProductService from '../../services/ProductService'

const NavBarComponent = ({ onFilterChange }) => {
    const [productTypes, setProductTypes] = useState([])
    const [selectedFilters, setSelectedFilters] = useState({
        type: [],
        rating: null,
        price: null,
    })

    useEffect(() => {
        const fetchProductTypes = async () => {
            const res = await ProductService.getAllTypeProduct()
            if (res?.status === 'OK') {
                setProductTypes(res?.data)
            }
        }
        fetchProductTypes()
    }, [])

    const handleCheckboxChange = (checkedValues) => {
        setSelectedFilters((prev) => ({ ...prev, type: checkedValues }))
        onFilterChange({ type: checkedValues })
    }

    const handleStarClick = (star) => {
        setSelectedFilters((prev) => ({ ...prev, rating: star }))
        onFilterChange({ rating: star })
    }

    const handlePriceClick = (priceRange) => {
        setSelectedFilters((prev) => ({ ...prev, price: priceRange }))
        onFilterChange({ price: priceRange })
    }

    const renderContent = (type, options) => {
        switch (type) {
            case 'checkbox':
                return (
                    <Checkbox.Group
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}
                        value={selectedFilters.type}
                        onChange={handleCheckboxChange}
                    >
                        {options.map((option, index) => (
                            <Checkbox
                                style={{
                                    marginLeft: 0,
                                    fontWeight: selectedFilters.type.includes(option)
                                        ? 'bold'
                                        : 'normal',
                                }}
                                value={option}
                                key={`checkbox-${index}`}
                            >
                                {option}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                )
            case 'star':
                return options.map((option, index) => (
                    <div
                        key={`star-${index}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            cursor: 'pointer',
                            fontWeight: selectedFilters.rating === option ? 'bold' : 'normal',
                        }}
                        onClick={() => handleStarClick(option)}
                    >
                        <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
                        <span>{`Từ ${option} sao`}</span>
                    </div>
                ))
            case 'price':
                return options.map((option, index) => (
                    <WrapperTextPrice
                        key={`price-${index}`}
                        onClick={() => handlePriceClick(option.value)}
                        style={{
                            cursor: 'pointer',
                            fontWeight: selectedFilters.price === option.value ? 'bold' : 'normal',
                        }}
                    >
                        {option.label}
                    </WrapperTextPrice>
                ))
            default:
                return <div>No options available</div>
        }
    }

    return (
        <div>
            <WrapperLableText>Danh mục sản phẩm</WrapperLableText>
            <WrapperContent>
                {renderContent('checkbox', productTypes)}
                {renderContent('star', [1, 2, 3, 4, 5])}
                {renderContent('price', [
                    { label: 'Dưới 2 triệu', value: 'under-2m' },
                    { label: '2-5 triệu', value: '2-5m' },
                    { label: 'Trên 5 triệu', value: 'above-5m' },
                ])}
            </WrapperContent>
        </div>
    )
}

export default NavBarComponent
