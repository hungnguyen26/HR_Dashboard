const express = require('express');
const router = express.Router();

const controller = require("../controllers/account.controller");

router.get('/', controller.index);

router.get('/create', controller.createAccount);

router.post('/create', controller.createAccountPost);

router.get('/edit/:id', controller.editAccount);

router.patch('/edit/:id', controller.editAccountPatch);

router.delete('/delete/:id', controller.deleteAccount);

module.exports = router;
