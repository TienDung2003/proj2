const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleWare = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided",
            status: "ERROR",
        });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Token format is invalid",
            status: "ERROR",
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: "The authentication",
                status: "ERROR",
                error: err.message,
            });
        }
        if (user?.isAdmin) {
            next();
        } else {
            return res.status(404).json({
                message: "The authentication",
                status: "ERROR",
                error: err.message,
            });
        }
    });
};

const authUserMiddleWare = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided",
            status: "ERROR",
        });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Token format is invalid",
            status: "ERROR",
        });
    }

    const userId = req.params.id;
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: "The authentication",
                status: "ERROR",
                error: err.message,
            });
        }
        if (user?.isAdmin || user?.id === userId) {
            next();
        } else {
            return res.status(404).json({
                message: "The authentication",
                status: "ERROR",
                error: err.message,
            });
        }
    });
};

module.exports = {
    authMiddleWare,
    authUserMiddleWare,
};
