import React, { useState, useRef, useEffect } from 'react';
import './style.css';

const PriceDetailPopup = ({
    originalPrice,
    salePrice,
    finalPrice,
    note1 = 'Giá đã giảm trực tiếp từ nhà bán',
    note2 = 'Có thể thay đổi ở bước thanh toán'
}) => {
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setShowPopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="price-popup-wrapper" ref={popupRef}>
            <img
                src="https://salt.tikicdn.com/ts/upload/7b/3e/15/a6e1a274630e27840824d4aab203aaea.png"
                alt="info-icon"
                className="price-popup-icon"
                onClick={() => setShowPopup(!showPopup)}
            />

            {showPopup && (
                <div className="price-popup-content">
                    <div className="price-popup-header">
                        <span>Chi tiết giá</span>
                        <button className="price-popup-close" onClick={() => setShowPopup(false)}>×</button>
                    </div>

                    <div className="price-popup-row">
                        <span>Giá gốc</span>
                        <span className="text-line-through">{originalPrice}₫</span>
                    </div>

                    <div className="price-popup-row">
                        <span>Khuyến mãi</span>
                        <span>{salePrice}%</span>
                    </div>


                    <div className="price-popup-row">
                        <span>Giá bán</span>
                        <span className="text-green">{finalPrice}₫</span>
                    </div>

                </div>
            )}
        </div>
    );
};

export default PriceDetailPopup;
