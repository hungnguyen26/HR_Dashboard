const express = require('express');
const router = express.Router();

const controller = require("../controllers/employees.controller");

router.get('/', controller.index);

router.get('/create', controller.createEmployees);

router.post('/create', controller.createEmployeesPost);

router.get('/edit/:id', controller.updateEmployees);

router.post('/edit/:id', controller.updateEmployeesPost);


module.exports = router;