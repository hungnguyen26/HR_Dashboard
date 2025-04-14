const express = require('express');
const router = express.Router();

const controller = require("../controllers/departments.controller");

router.get('/', controller.index);

router.get('/create', controller.createDepartment);

router.post('/create', controller.createDepartmentPost);

module.exports = router;