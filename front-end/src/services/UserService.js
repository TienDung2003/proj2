import axios from "axios";

export const axiosJWT = axios.create();

export const loginUser = async (data) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/user/sign-in`,
            data
        );
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const loginWithGoogle = async (tokenId) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/user/login-with-google`,
            { tokenId }
        );
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const signupUser = async (data) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/user/sign-up`,
            data
        );
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}/user/get-details/${id}`,
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};

export const logoutUser = async () => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/log-out`
    );
    return res.data;
};

export const refreshToken = async (refreshToken) => {
    // console.log("refreshToken", refreshToken);
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/refresh-token`,
        {},
        {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        }
    );
    return res.data;
};

export const updateUser = async (id, data, access_token) => {
    const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL}/user/update/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};

export const getAllUser = async (access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}/user/get-all`,
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};

export const deleteUser = async (id, access_token) => {
    const res = await axiosJWT.delete(
        `${process.env.REACT_APP_API_URL}/user/delete-user/${id}`,
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};

export const deleteManyUser = async (data, access_token) => {
    const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}/user/delete-many`,
        data,
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    );
    return res;
};
