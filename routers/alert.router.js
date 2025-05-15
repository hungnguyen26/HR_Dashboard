const express = require('express');
const router = express.Router();

const controller = require("../controllers/alert.controller");

router.get('/', controller.index);

module.exports = router;
