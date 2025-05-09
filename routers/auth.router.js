const express = require('express');
const router = express.Router();

const controller = require("../controllers/auth.controller");

router.get('/login', controller.login);

router.post('/login', controller.loginPost);

router.get("/logout", controller.logout);

router.get('/register', controller.register);


module.exports = router;