const express = require('express');
const router = express.Router();

const controller = require("../controllers/jobs.controller");

router.get('/', controller.index);

router.get('/create', controller.createJob);

module.exports = router;