"use strict";
var HttpStatus = require("http-status-codes");
const { Order, OrderItem, User } = require("../models/index");


exports.createOrderItens = async (data) => {
  let recovery_data = data.map((item) => {
    item.chef_location = item.chef_location['dataValues'].location
    item.walletId = item.walletId[0]['dataValues'].id
    return item
  });
  const response = await OrderItem.bulkCreate(recovery_data);

}
