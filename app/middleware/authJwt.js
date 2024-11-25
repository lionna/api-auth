const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models');

const User = db.users;

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({
            message: 'No token provided! Need to add header!',
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!',
            });
        }
        req.userId = decoded.id;
        return next();
    });
};

const isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'admin') {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: 'Require Admin Role!',
            });
        });
    });
};

const isModerator = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'moderator') {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: 'Require Moderator Role!',
            });
        });
    });
};

const isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'moderator') {
                    next();
                    return;
                }

                if (roles[i].name === 'admin') {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: 'Require Moderator or Admin Role!',
            });
        });
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
};
module.exports = authJwt;
