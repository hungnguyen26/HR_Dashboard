const express = require('express');
const router = express.Router();

const controller = require("../controllers/attendance.controller");

router.get('/', controller.index);

router.get('/create', controller.createAttendance);

router.post('/create', controller.createAttendancePost);

router.get('/edit/:id', controller.updateAttendance);

router.patch('/edit/:id', controller.updateAttendancePatch);

router.delete('/delete/:id', controller.deleteAttendance);

module.exports = router;