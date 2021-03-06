'use strict';
var HttpStatus = require('http-status-codes');
const ValidationContract = require('../services/validator');
const { Plates, User, Ingredient } = require('../models/index');
const repository = require('../repository/plate-repository');
const repositoryDocs = require('../repository/docs-repository');
const md5 = require('md5');
const authService = require('../services/auth');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;


exports.create = async (req, res, next) => {

  let contract = new ValidationContract();
  contract.hasMinLen(req.body.name, 3, 'The plate name should have more than 3 caracteres');
  contract.isRequired(req.body.description, 'Plate description is required!');
  contract.isRequired(req.body.price, 'Plate price is required!');
  contract.isRequired(req.body.delivery_time, 'Plate delivery time is required!');
  contract.isRequired(req.body.delivery_type, 'Plate delivery type is required!');

  if (!contract.isValid()) {
    res.status(HttpStatus.CONFLICT).send(contract.errors()).end();
    return 0;
  }

  const token_return = await authService.decodeToken(req.headers['x-access-token'])
  const existUser = await User.findOne({ where: { id: token_return.id } });

  if (existUser.user_type !== 'chef') {
    res.status(HttpStatus.CONFLICT).send({ message: "Only chefs can create plates", error: true}).end();
    return 0;
  }
  if (existUser.verification_email_status !== 'verified') {
    res.status(HttpStatus.CONFLICT).send({ message: "Your email was not verified", error: true}).end();
    return 0;
  }
  if (existUser.verification_phone_status !== 'verified') {
    res.status(HttpStatus.CONFLICT).send({ message: "Your phone number was not verified", error: true}).end();
    return 0;
  }
  const validate_docs = await repositoryDocs.getUserDocs(existUser.id)
  if (validate_docs === null || validate_docs.state_type !== "validated") {
    res.status(HttpStatus.CONFLICT).send({ message: "Before creating a new plate you need to validate your documents!", error: true });
    return 0;
  }

  let full_data = req.body;
  let ingred, images, kitchen, receipt

  full_data.userId = existUser.id;

  if (full_data.ingredients) {
    ingred = full_data.ingredients;
    delete full_data.ingredients;
  }

  if (full_data.images) {
    images = full_data.images;
    delete full_data.images;
  }

  if (full_data.kitchen_images) {
    kitchen = full_data.kitchen_images;
    delete full_data.kitchen_images;
  }

  if (full_data.receipt_images) {
    receipt = full_data.receipt_images;
    delete full_data.receipt_images;
  }

  let plate = await Plates.create({ ...full_data });
  let ingred_create, images_create, kitchen_create, receipt_create

  if (ingred) {
    let ingred_data = []
    ingred.forEach(elem => {
      elem.plateId = plate.id;
      ingred_data.push(elem);
    })
    ingred_create = await repository.createIngredient(ingred_data)
  }

  if (images) {
    let images_data = []
    images.forEach(elem => {
      elem.plateId = plate.id;
      images_data.push(elem);
    })
    images_create = await repository.createPlateImage(images_data)
  }

  if (kitchen) {
    let kitchen_data = []
    kitchen.forEach(elem => {
      elem.plateId = plate.id;
      kitchen_data.push(elem);
    })
    kitchen_create = await repository.createKitchenImage(kitchen_data)
  }

  if (receipt) {
    let receipt_data = []
    receipt.forEach(elem => {
      elem.plateId = plate.id;
      receipt_data.push(elem);
    })
    receipt_create = await repository.createReceiptImage(receipt_data)
  }

  let payload = {};

  payload.status = HttpStatus.CREATED;
  payload.plate = plate;
  payload.ingredients = ingred_create;
  payload.images = images_create;
  payload.kitchen_images = kitchen_create;
  payload.receipt_images = receipt_create;
  res.status(payload.status).send(payload);
}

exports.list = async (req, res, next) => {
  let retorno
  if (req.query.page && req.query.pageSize) {
    retorno = await repository.listPlates({page: req.query.page, pageSize: req.query.pageSize})
  } else {
    retorno = await repository.listPlates({page: 1, pageSize: 10})
  }
  res.status(HttpStatus.ACCEPTED).send(retorno);
}

exports.listNear = async (req, res, next) => {
  let retorno = await repository.listNear({ latitude: req.query.latitude, longitude: req.query.longitude, radiusMiles: req.query.radius })
  res.status(HttpStatus.ACCEPTED).send(retorno);
}

exports.edit = async (req, res, next) => {
  try {
    let existPlate = await repository.findPlate(req.params.id);
    if (!existPlate) {
      res.status(HttpStatus.CONFLICT).send({ message: "we couldn't find your plate", status: HttpStatus.CONFLICT});
      return 0;
    }
    let newReceiptImages = existPlate.ReceiptImages;

    existPlate.name = req.body.name || existPlate.name;
    existPlate.description = req.body.description || existPlate.description;
    existPlate.price = req.body.price  || existPlate.price;
    existPlate.delivery_time = req.body.delivery_time || existPlate.delivery_time;
    existPlate.delivery_type = req.body.delivery_type || existPlate.delivery_type;
    await existPlate.save();

    await repository.updateReceiptImage(req.body.ReceiptImages)
    await repository.updateKitchenImage(req.body.KitchenImages)
    await repository.updatePlateImage(req.body.PlateImages)
    await repository.updateIngredient(req.body.Ingredients)

    const updatedPlate = await repository.findPlate(req.params.id);

    res.status(200).send({ message: 'Plate successfully updated!', data: updatedPlate });
  } catch (e) {
    res.status(500).send({
      message: 'Failed to process your request'
    });
  }
};

exports.getPlate = async (req, res, next) => {
  try {
    const existPlate = await repository.getPlate(req.params.id);
    res.status(200).send({ message: 'Plate find!', data: existPlate });
  } catch (e) {
    res.status(500).send({
      message: 'Failed to process your request'
    });
  }
};

exports.searchPlates = async (req, res, next) => {
  const list_plates = await Plates.findAll({
    where: {
      name: {
        [Op.like]: '%' + req.params.text + '%'
      }
    },
    attributes: ["name", "description", "price", "delivery_time"]
  });
  res.status(200).send({ message: "Plates find!", param: req.params.text, data: list_plates });
};
