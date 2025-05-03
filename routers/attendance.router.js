const express = require('express');
const router = express.Router();

const controller = require("../controllers/attendance.controller");

router.get('/', controller.index);

router.get('/create', controller.createAttendance);

router.post('/create', controller.createAttendancePost);

module.exports = router;