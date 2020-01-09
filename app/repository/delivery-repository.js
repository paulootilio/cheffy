'use strict';

const { OrderDelivery} = require('../models/index');

//TODO waiting OrderDelivey to be implemented
exports.createOrderDelivery = async (data,driver) => {
    // try {
    //     const order = await OrderDelivery.create({...data});
    //     return order;
    //   } catch (e) {
    //     console.log(e)
    //     throw e;
    //   }

  }

//TODO waiting OrderDelivey to be implemented
exports.edit = async (data,driver) => {
    // try {
    //     const order = await OrderDelivery.create({...data});
    //     return order;
    //   } catch (e) {
    //     console.log(e)
    //     throw e;
    //   }

  }

  //TODO waiting OrderDelivey to be implemented
exports.getOrderDeliveriesByUserId = async (driver) => {
  try {
      const order = await OrderDelivery.findAll({ where: { driverId: driver} });
      return order;
    } catch (e) {
      console.log(e)
      throw e;
    }

}

  //TODO waiting OrderDelivey to be implemented
  exports.getById = async (data,driver) => {
    // try {
    //     const order = await OrderDelivery.create({...data});
    //     return order;
    //   } catch (e) {
    //     console.log(e)
    //     throw e;
    //   }
  
  }