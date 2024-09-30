const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { Routes, Messages }= require('../interfaces');
const { users, refreshTokens } = require('../db');
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../config');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

router.post(Routes.register, async (req, res) => {
    const {username, password} = req.body;

    if (isUserExist(username)) {
        return res.status(400).json({message: Messages.userNameAlreadyExists});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {id: uuidv4(), username, password: hashedPassword};
    users.push(user);

    res.status(201).json({message: Messages.userRegisteredSuccessfully});
});

router.post(Routes.login, async (req, res) => {
    const {username, password} = req.body;

    const user = isUserExist(username);
    if (!user) {
        return res.status(400).json({message: Messages.invalidCredentials});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({message: Messages.invalidCredentials});
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign({id: user.id, username: user.username}, JWT_REFRESH_SECRET, {expiresIn: '7d'})

    refreshTokens.push(refreshToken);

    res.json({accessToken, refreshToken});
});

router.post(Routes.token, async (req, res) => {
    const {token} = req.body;

    if (!token) {
        return res.sendStatus(401);
    }
    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403)
    }

    jwt.verify(token, JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = generateAccessToken({id: user.id, username: user.username});
        res.json({accessToken});
    });
});

const generateAccessToken = (user) => jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '15m'})
const isUserExist = (username) => users.find(user => user.username === username)

module.exports = router;

