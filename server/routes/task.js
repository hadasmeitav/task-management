const jwt = require('jsonwebtoken');
const express = require('express');
const {body, validationResult} = require('express-validator');
const {encrypt, decrypt} = require('../encryptionService');
const {Routes, Messages} = require("../interfaces");
const {tasks} = require('../db');
const {JWT_SECRET} = require('../config');

const router = express.Router();

/**
 * Method is used to authenticate each api request according to access token of the user
 */
function authenticate(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: Messages.accessDenied});
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({message: Messages.invalidToken});
        }
        req.user = user;
        next();
    });
}

router.get(Routes.tasks, authenticate, async (req, res) => {
    const userTasks = tasks.filter(task => task.userId === req.user.id);
    res.json(userTasks.map(task => ({
        id: task.id,
        description: decrypt(task.description),
        title: decrypt(task.title)
    })));
});

router.post(Routes.tasks, authenticate, body(['title', 'description']),
    async (req, res) => {
        const {title, description} = req.body;
        const task = {
            id: tasks.length + 1,
            description: encrypt(description),
            title: encrypt(title),
            userId: req.user.id
        };
        tasks.push(task);
        res.status(201).json(task);
    });

router.put(`${Routes.tasks}/:id`, authenticate, body(['title', 'description']),
    async (req, res) => {
        const {id} = req.params;
        const updateData = req.body;

        const index = tasks.findIndex(task => task.id === id && task.userId === req.user.id);
        if (index === -1) {
            return res.status(404).json({message: Messages.taskNotFound});
        }

        tasks[index] = {...tasks[index], description: encrypt(updateData.description), title: encrypt(updateData.title),};
        res.json(tasks[index]);
    }
);

router.delete(`${Routes.tasks}/:id`, authenticate,
    async (req, res) => {
        const {id} = req.params;

        const index = tasks.findIndex(task => task.id === Number(id) && task.userId === req.user.id);
        if (index === -1) {
            return res.status(404).json({message: Messages.taskNotFound});
        }

        tasks.splice(index, 1);

        res.json({message: Messages.taskRemoved});
    }
);

module.exports = router;