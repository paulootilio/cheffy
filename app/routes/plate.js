'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controlers/plate-controler');
const authService = require("../services/auth");


router.post('/', controller.create);
router.get('/', controller.list);
router.post('/edit/:id', controller.edit);
router.get("/search/:text", controller.searchPlates);
router.get('/show/:id', controller.getPlate);
router.get('/near', controller.listNear);

module.exports = router;
