'use strict';
const { Order, OrderPayment, OrderItem, User } = require("../models/index");

exports.getById = async (orderId) => {
    try {
        const order = await Order.findByPk(orderId);

        return order;
      } catch (e) {
        console.log(e)
        throw e;
      }

  }

exports.editOrder = async (orderId,data) => {
    try {
        const order = await Order.findByPk(orderId);
        order.userId = data.userId;

        if(typeof data.basketId !== 'undefined'){
          order.basketId = data.basketId;
        }
        
        if(typeof data.state_type !== 'undefined'){
          order.state_type = data.state_type;
        }
        
        if(typeof data.total_items !== 'undefined'){
          order.total_items = data.total_items;
        }
        
        if(typeof data.shipping_fee !== 'undefined'){
          order.shipping_fee = data.shipping_fee;
        }
        
        if(typeof data.order_total !== 'undefined'){
          order.order_total = data.order_total;
        }
        
        await order.save();
        return order;
      } catch (e) {
        console.log(e)
        throw e;
      }

  }

exports.create = async (data) => {
  let doc = await Order.create({ ...data });
  return doc;
}

exports.editState = async (data, state) => {
  let order = await Order.findByPk(data);
  order.state_type = state;
  await order.save();
  return order;
}

exports.getUserOrders = async (data) => {
  let order = await Order.findAll({
    where: { userId: data },
    order: [["id", "DESC"]],
    include: [
      {
        model: OrderPayment,
        attributes: ["payment_id", "amount", "client_secret", "customer", "payment_method", "status"]
      },
      {
        model: OrderItem,
        attributes: ["plate_id", "chef_location", "name", "description", "amount", "quantity"]
      },
    ]
  });
  return order;
}

exports.getUserOrder = async (data, id) => {
  let order = await Order.findOne({
    where: { userId: data, id: id },
    include: [
      {
        model: OrderPayment,
        attributes: ["payment_id", "amount", "client_secret", "customer", "payment_method", "status"]
      },
      {
        model: OrderItem,
        attributes: ["plate_id", "chef_location", "name", "description", "amount", "quantity"]
      },
    ]
  });
  return order;
}

exports.user = async (data) => {
  try {
    const existUser = await User.findByPk(data);
    return existUser;
  } catch (e) {
    return { message: "Erro to return user!", error: e}
  }
}

exports.userLocation = async (data) => {
  try {
    const existUser = await User.findByPk(data, {
      attributes: [ 'location' ],
    });
    return existUser;
  } catch (e) {
    return { message: "Erro to return user!", error: e}
  }
}
