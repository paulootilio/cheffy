'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controlers/user-controler');
const authService = require("../services/auth");


router.get('/', authService.authorize, controller.getUser);
router.post('/', controller.create);
router.post('/login', controller.authenticate);
router.get('/balance', authService.authorize, controller.getUserBalance);
router.get('/balance/history', authService.authorize, controller.getUserBalanceHistory);
router.post('/verifyphone', authService.authorize, controller.verifyPhone);
router.post('/confirmphone', authService.authorize, controller.checkPhone);
router.post('/confirmemail', authService.authorize, controller.verifyEmailToken);
router.post('/resend-emailtoken', authService.authorize, controller.resendEmailToken);

router.post('/verifypassword', authService.authorize, controller.verifyChangePassword);
router.post('/confirmchangepassword', authService.authorize, controller.confirmChangePassword);
router.post('/changepassword', authService.authorize, controller.changePassword);

router.put('/edit', authService.authorize, controller.put);

router.put('/balance', authService.authorize, controller.getUserBalance);
//router.put('/balance/history', authService.authorize, controller.getUserBalanceHistory);


module.exports = router;
