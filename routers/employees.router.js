const express = require('express');
const router = express.Router();

const controller = require("../controllers/employees.controller");

router.get('/', controller.index);

router.get('/create', controller.createEmployees);

module.exports = router;