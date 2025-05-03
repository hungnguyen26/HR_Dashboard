const express = require('express');
const router = express.Router();

const controller = require("../controllers/attendance.controller");

router.get('/', controller.index);

module.exports = router;