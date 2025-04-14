const express = require('express');
const router = express.Router();

const controller = require("../controllers/employees.controller");

router.get('/', controller.index);

router.get('/create', controller.createEmployees);

router.post('/create', controller.createEmployeesPost);

module.exports = router;