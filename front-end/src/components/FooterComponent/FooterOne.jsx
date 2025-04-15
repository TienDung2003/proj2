import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const FooterOne = () => {
    return (
        <footer className="footer py-120">
            <div className="container container-lg">
                <div className="footer-item-wrapper d-flex align-items-start justify-content-between flex-wrap">
                    <div className="footer-item">
                        <div className="footer-item__logo mb-24">
                            <Link to="/">
                                <img src="assets/images/logo/logo_trans.png" alt="Logo" />
                            </Link>
                        </div>
                        <p className="mb-24">
                            We're E-Shop, an innovative team of online shopping.
                        </p>
                        <div className="flex-align gap-16 mb-16">
                            <span className="icon-wrapper">
                                <i className="ph-fill ph-map-pin" />
                            </span>
                            <span className="text-md text-gray-900">
                                01 Dai Co Viet, Ha Ba Trung, Ha Noi, Vietnam
                            </span>
                        </div>
                        <div className="flex-align gap-16 mb-16">
                            <span className="icon-wrapper">
                                <i className="ph-fill ph-phone-call" />
                            </span>
                            <div className="flex-column">
                                <Link to="/tel:+00123456789" className="text-md text-gray-900 hover-text-main-600">
                                    +00 123 456 789
                                </Link>
                                <Link to="/tel:+00987654012" className="text-md text-gray-900 hover-text-main-600">
                                    +00 987 654 012
                                </Link>
                            </div>
                        </div>
                        <div className="flex-align gap-16">
                            <span className="icon-wrapper">
                                <i className="ph-fill ph-envelope" />
                            </span>
                            <Link to="/mailto:support24@marketpro.com" className="text-md text-gray-900 hover-text-main-600">
                                support24@marketpro.com
                            </Link>
                        </div>
                    </div>
                    <div className="footer-item">
                        <h6 className="footer-item__title">Information</h6>
                        <ul className="footer-menu">
                            {['Become a Vendor', 'Affiliate Program', 'Privacy Policy', 'Our Suppliers', 'Extended Plan', 'Community'].map((item, index) => (
                                <li key={index} className="mb-16">
                                    <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-item">
                        <h6 className="footer-item__title">Customer Support</h6>
                        <ul className="footer-menu">
                            {['Help Center', 'Contact Us', 'Report Abuse', 'Submit and Dispute', 'Policies & Rules', 'Online Shopping'].map((item, index) => (
                                <li key={index} className="mb-16">
                                    <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-item">
                        <h6 className="footer-item__title">My Account</h6>
                        <ul className="footer-menu">
                            {['My Account', 'Order History', 'Shopping Cart', 'Compare', 'Help Ticket', 'Wishlist'].map((item, index) => (
                                <li key={index} className="mb-16">
                                    <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-item">
                        <h6 className="footer-item__title">Shop on The Go</h6>
                        <p className="mb-16">E-Shop App is available. Get it now</p>

                        <ul className="flex-align gap-16">
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform, index) => (
                                <li key={index}>
                                    <Link to={`/${platform}.com`} className="social-icon">
                                        <i className={`ph-fill ph-${platform}-logo`} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterOne;
