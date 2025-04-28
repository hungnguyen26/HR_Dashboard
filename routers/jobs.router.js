const express = require('express');
const router = express.Router();

const controller = require("../controllers/jobs.controller");

router.get('/', controller.index);

router.get('/create', controller.createJob);

router.post('/create', controller.createJobPost);

router.get('/edit/:id', controller.updateJob);

router.patch('/edit/:id', controller.updateJobPatch);

router.delete('/delete/:id', controller.deleteJob);

module.exports = router;