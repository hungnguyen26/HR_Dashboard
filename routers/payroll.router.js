const express = require('express');
const router = express.Router();

const controller = require("../controllers/payroll.controller");

router.get('/', controller.index);

router.get('/create', controller.createPayroll);

module.exports = router;