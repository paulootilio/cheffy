'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controlers/order-controler');
const authService = require("../services/auth");

router.post('/', authService.authorize, controller.create);
router.get('/list', authService.authorize, controller.list);
router.get('/get/:id', authService.authorize, controller.getOneOrder);

module.exports = router;
