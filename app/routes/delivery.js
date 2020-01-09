'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controlers/delivery-controler');

router.get('/', controller.list);   
router.get('/:id', controller.getById);
router.post('/edit/:id', controller.edit);
router.post('/accept/:id', controller.accept);
router.post('/createdelivery/:id', controller.createDelivery);//TODO implement de create delivery
router.post('/pickuporder/:id', controller.pickupDelivery);//TODO implement the pickup service
router.post('/complete/:id', controller.completeDelivery);


module.exports = router;