"use strict";
var HttpStatus = require("http-status-codes");
const {sequelize, User } = require('../models/index');
const ValidationContract = require("../services/validator");
const orderRepository = require("../repository/order-repository");
const deliveryRepository = require("../repository/delivery-repository");
const demandService = require('../services/demands');
const NotificationServices = require('../services/notification');
exports.list = async (req, res, next) => {

  const token_return = await authService.decodeToken(req.headers['x-access-token'])
  const existUser = await User.findOne({ where: { id: token_return.id } });

  if (existUser.user_type !== 'driver' && existUser.user_type !== 'cheff') {
      res.status(HttpStatus.CONFLICT).send({ message: "Only drivers and cheffs can have deliveries", error: true}).end();
    return 0;
  }


  let deliveries = await deliveryRepository.getOrderDeliveriesByUserId(existUser.id)

  if(!deliveries){
      res.status(HttpStatus.CONFLICT).send({ message: "we couldn't find the user's deliveries", status: HttpStatus.CONFLICT});
      return 0;
  }else{
      let payload = {};
      payload.status = HttpStatus.CREATED;
      payload.deliveries = deliveries;
      res.status(payload.status).send(payload);
  }

}

exports.edit = async (req, res, next) => {
  try {
    const token_return = await authService.decodeToken(req.headers['x-access-token'])
    const existUser = await User.findOne({ where: { id: token_return.id } });
  
    if (!existUser) {
      res.status(HttpStatus.CONFLICT).send({ message: "Driver not found", error: true}).end();
      return 0;
    }    

    let orderDeliveryId = req.params.id;
    const order = await OrderDelivery.findByPk(orderDeliveryId);
    order.driverId = existUser.id;
    order.status_type = 'on_course';
    order.save();
    
    return order;
  } catch (e) {
    console.log(e)
    throw e;
  }

}

exports.createDelivery = async (req, res, next) => {
  try {
    let contract = new ValidationContract();
    contract.isRequired(req.params.id, 'The order ID is required!');
  
    if (!contract.isValid()) {
      res.status(HttpStatus.CONFLICT).send(contract.errors()).end();
      return 0;
    }

    const token_return = await authService.decodeToken(req.headers['x-access-token'])
    const existUser = await User.findOne({ where: { id: token_return.id } });
  
    if (!existUser) {
      res.status(HttpStatus.CONFLICT).send({ message: "Driver not found", error: true}).end();
      return 0;
    }    

    let orderId = req.params.id;
    let createdOrderDelivery = await repositoryOrderDelivery.createdOrderDelivery(orderId);
    
    demandService.sendToDelivery(order_id,loc,shipping)
    
    let payload = {};
    payload.status = HttpStatus.CREATED;
    payload.orderDelivery = createdOrderDelivery;
    res.status(payload.status).send(payload);

  } catch (e) {
    console.log(e)
    res.status(HttpStatus.CONFLICT).send({ message: "There was a problem ", e: true}).end();    
    throw e;
  }

}

exports.accept = async (req, res, next) => {
  try {
      const token_return = await authService.decodeToken(req.headers['x-access-token'])
      const existUser = await User.findOne({ where: { id: token_return.id } });
    
      if (!existUser) {
        res.status(HttpStatus.CONFLICT).send({ message: "Driver not found", error: true}).end();
        return 0;
      }    

      let orderDeliveryId = req.params.id;
      const order = await OrderDelivery.findByPk(orderDeliveryId);
      order.driverId = existUser.id;
      order.status_type = 'on_course';
      order.save();

      return order;
    } catch (e) {
      console.log(e)
      throw e;
    }

}

exports.completeDelivery = async (req, res, next) => {
  try {
    const token_return = await authService.decodeToken(req.headers['x-access-token'])
    const existUser = await User.findOne({ where: { id: token_return.id } });
  
    if (!existUser) {
      res.status(HttpStatus.CONFLICT).send({ message: "Driver not found", error: true}).end();
      return 0;
    }    

    try{
      let orderDeliveryId = req.params.id;
      const orderDelivery = await OrderDelivery.findByPk(orderDeliveryId);
      orderDelivery.driverId = existUser.id;
      orderDelivery.status_type = 'delivered';
      orderDelivery.dropoff_time = sequelize.literal('CURRENT_TIMESTAMP');
      orderDelivery.save();

      //Notify the Cheff
      new NotificationServices()
      .sendPushNotificationToUser(orderDelivery.chefId,
        {
          type:"delivery_com[lete",
          orderId:orderDelivery.orderId
        }
      );

      res.status(HttpStatus.ACCEPTED).send(orderDelivery).end();

    }catch(err){
      res.status(HttpStatus.CONFLICT).send({ message: "There was a problem ", error: true}).end();      
    }
    return order;
  } catch (e) {
    console.log(e)
    throw e;
  }
}

exports.pickupDelivery = async (req, res, next) => {
  try {
    const token_return = await authService.decodeToken(req.headers['x-access-token'])
    const existUser = await User.findOne({ where: { id: token_return.id } });
  
    if (!existUser) {
      res.status(HttpStatus.CONFLICT).send({ message: "Driver not found", error: true}).end();
      return 0;
    }    

    try{
      let orderDeliveryId = req.params.id;
      const orderDelivery = await OrderDelivery.findByPk(orderDeliveryId);
      orderDelivery.driverId = existUser.id;
      orderDelivery.status_type = 'picked_up';
      orderDelivery.dropoff_time = sequelize.literal('CURRENT_TIMESTAMP');
      orderDelivery.save();

      //Notify the Cheff
      new NotificationServices()
      .sendPushNotificationToUser(orderDelivery.chefId,
        {
          type:"delivery_com[lete",
          orderId:orderDelivery.orderId
        }
      );

      res.status(HttpStatus.ACCEPTED).send(orderDelivery).end();

    }catch(err){
      res.status(HttpStatus.CONFLICT).send({ message: "There was a problem ", error: true}).end();      
    }
    return order;
  } catch (e) {
    console.log(e)
    throw e;
  }
}

exports.getOrderDeliveriesByUserId = async (req, res, next) => {
  try {
      const deliveries = await OrderDelivery.findAll(
        { 
          where: { 
            driverId: token_return.id 
          } 
        });

      return deliveries;
    } catch (e) {
      console.log(e)
      throw e;
    }

}

exports.getById = async (req, res, next) => {
  try {
    const order = await repository.getById(req.params.id);
    res.status(200).send({ message: 'ORder find!', data: order });
  } catch (e) {
    res.status(500).send({
      message: 'Failed to process your request'
    });
  }
}
