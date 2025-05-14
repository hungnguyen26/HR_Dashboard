const express = require('express');
const router = express.Router();

const controller = require("../controllers/payroll.controller");

router.get('/', controller.index);

router.get('/create', controller.createPayroll);

router.post('/create', controller.createPayrollPost);

router.get('/edit/:id', controller.editPayroll);

router.patch('/edit/:id', controller.editPayrollPatch);

router.delete('/delete/:id', controller.deletePayroll);

router.get('/mine', controller.minePayroll);

module.exports = router;