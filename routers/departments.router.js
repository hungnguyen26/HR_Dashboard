const express = require('express');
const router = express.Router();

const controller = require("../controllers/departments.controller");

router.get('/', controller.index);

router.get('/create', controller.createDepartment);

router.post('/create', controller.createDepartmentPost);

router.get('/edit/:id', controller.updateDepartment);

router.patch('/edit/:id', controller.updateDepartmentPatch);

router.delete('/delete/:id', controller.deleteDepartment);


module.exports = router;