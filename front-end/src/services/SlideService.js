import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/slide`;

export const getAllSlides = async () => {
    const res = await axios.get(`${API_URL}/get-all`);
    return res.data.data; // đảm bảo là mảng
};

export const createSlide = async (data) => {
    console.log('data', data);

    const res = await axios.post(`${API_URL}/create`, data);
    return res.data;
};

export const updateSlide = async (id, access_token, data) => {
    const res = await axios.put(`${API_URL}/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data.data;
};

export const deleteSlide = async (id, access_token) => {
    const res = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data.data;
};
