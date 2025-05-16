const express = require('express');
const router = express.Router();

const controller = require("../controllers/account.controller");

router.get('/', controller.index);

router.get('/create', controller.createAccount);

router.post('/create', controller.createAccountPost);

router.delete('/delete/:id', controller.deleteAccount);

module.exports = router;
