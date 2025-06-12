const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateAcessToken = async (payload) => {
    const access_token = jwt.sign(
        {
            ...payload,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "30s" }
    );

    return access_token;
};

const generateRefreshToken = async (payload) => {
    const refresh_token = jwt.sign(
        {
            ...payload,
        },
        process.env.REFRESH_TOKEN,
        { expiresIn: "365d" }
    );

    return refresh_token;
};

const refreshTokenJwtService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    return reject({
                        status: "ERR",
                        message: "The authentication",
                    });
                }
                const access_token = await generateAcessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin,
                });
                resolve({
                    status: "OK",
                    message: "SUCESS",
                    access_token,
                });
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    generateAcessToken,
    generateRefreshToken,
    refreshTokenJwtService,
};
