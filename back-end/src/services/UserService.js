const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generateAcessToken, generateRefreshToken } = require("./JwtService");
const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser;
        try {
            const checkUser = await User.findOne({
                email: email,
            });
            if (checkUser !== null) {
                resolve({
                    status: "ERR",
                    message: "The email is already",
                });
            }
            const hash = bcrypt.hashSync(password, 10);
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone,
            });
            if (createdUser) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createdUser,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;
        try {
            const checkUser = await User.findOne({
                email: email,
            });
            if (checkUser === null) {
                return reject({
                    status: "ERR",
                    message: "The user is not defined",
                });
            }
            const comparePassword = bcrypt.compareSync(
                password,
                checkUser.password
            );

            if (!comparePassword) {
                return reject({
                    status: "ERR",
                    message: "The password or username is incorrect",
                });
            }
            const access_token = await generateAcessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });

            const refresh_token = await generateRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });

            return resolve({
                status: "OK",
                message: "SUCCESS",
                access_token,
                refresh_token,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const loginWithGoogle = (googleToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const { email, name, picture } = ticket.getPayload();

            let user = await User.findOne({ email });

            if (!user) {
                const randomPassword = Math.random().toString(36).slice(-8);
                const hashedPassword = bcrypt.hashSync(randomPassword, 10);

                user = await User.create({
                    email,
                    name,
                    password: hashedPassword, // Lưu mật khẩu để đảm bảo đồng nhất
                    avatar: picture,
                });
                console.log("user", user);
            }

            const access_token = await generateAcessToken({
                id: user.id,
                isAdmin: user.isAdmin,
            });
            const refresh_token = await generateRefreshToken({
                id: user.id,
                isAdmin: user.isAdmin,
            });

            resolve({
                status: "OK",
                message: "Đăng nhập Google thành công!",
                access_token,
                refresh_token,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            if (!checkUser) {
                return reject({ message: 'User not found' });
            }

            if (data.password) {
                data.password = await bcrypt.hash(data.password, 10);
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            });

        } catch (error) {
            console.log("service", error);
            reject(error);
        }
    }
    )
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id,
            });
            if (user === null) {
                resolve({
                    status: "ERR",
                    message: "The user is not defined",
                });
            }
            resolve({
                status: "OK",
                message: "SUCESS",
                data: user,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find().sort({
                createdAt: -1,
                updatedAt: -1,
            });
            resolve({
                status: "OK",
                message: "Success",
                data: allUser,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id,
            });
            if (checkUser === null) {
                return reject({
                    status: "ERR",
                    message: "The user is not defined",
                });
            }

            await User.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "Delete user success",
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({ _id: ids });
            resolve({
                status: "OK",
                message: "Delete user success",
            });
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    createUser,
    loginUser,
    updateUser,
    getDetailsUser,
    getAllUser,
    deleteUser,
    deleteManyUser,
    loginWithGoogle,
};
