import axios from 'axios';

export const fetchCartByUser = async (userId) => {
    console.log("URL gọi đến:", `${process.env.REACT_APP_API_URL}/cart/${userId}`)

    const res = await axios.get(`${process.env.REACT_APP_API_URL}/cart/${userId}`);
    console.log('res.data', res.data);

    return res.data;

};

export const saveCartToDB = async ({ userId, cartItems }) => {
    console.log(`${process.env.REACT_APP_API_URL}/api/cart/save`);

    const res = await axios.post(`${process.env.REACT_APP_API_URL}/cart/save`, {
        userId,
        cartItems,
    });
    return res.data;
};


// export const clearCart = async (userId, access_token) => {
//     console.log('cde', `${process.env.REACT_APP_API_URL}/cart/clear/${userId}`);

//     const res = await axios.delete(`${process.env.REACT_APP_API_URL}/cart/clear/${userId}`, {
//         headers: {
//             token: `Bearer ${access_token}`,
//         },
//     });
//     return res.data;
// };
export const clearCart = async (access_token) => {
    console.log('cde', access_token);

    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/cart/clear`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return res.data;
};

export const removeFromCart = async ({ productId, token }) => {
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/cart/remove`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: { productId } // axios.delete cần dùng `data` để gửi body
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || { status: 'ERR', message: error.message };
    }
};

export const removeMultipleFromCart = async (token, productIds) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/cart/remove-multiple`,
            { productIds },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: error.message };
    }
};