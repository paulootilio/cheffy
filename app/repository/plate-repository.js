'use strict';
const { Plates, User, Ingredient, PlateImage, KitchenImage, ReceiptImage, PlateCategory } = require('../models/index');

exports.createIngredient = async (data) => {
  try {
    const response = await Ingredient.bulkCreate(data);
    return response;
  } catch (e) {
    console.log("Error: ", e);
    return { message: "Fail to save ingredient", error: e };
  }
}

exports.updateIngredient = async (data) => {
  try {
    const response = await Ingredient.bulkCreate(data, { updateOnDuplicate: ["name", "purchase_date"] });
    return response;
  } catch (e) {
    console.log("Error: ", e);
    return { message: "Fail to update ingredient", error: e };
  }
}

exports.createPlateImage = async (data) => {
  try {
    const response = await PlateImage.bulkCreate(data);
    return response;
  } catch (e) {
    console.log("Error: ", e);
    return { message: "Fail to save ingredient", error: e };
  }
}

exports.updatePlateImage = async (data) => {
  try {
    const response = await PlateImage.bulkCreate(data, { updateOnDuplicate: ["name", "url"] });
    return response;
  } catch (e) {
    console.log("Error: ", e);
    return { message: "Fail to update ingredient", error: e };
  }
}

exports.createKitchenImage = async (data) => {
  try {
    const response = await KitchenImage.bulkCreate(data);
    return response;
  } catch (e) {
    console.log("Error: ", e);
    return { message: "Fail to save ingredient", error: e };
  }
}

exports.updateKitchenImage = async (data) => {
  try {
    const response = await KitchenImage.bulkCreate(data, { updateOnDuplicate: ["name", "url"] });
    return response;
  } catch (e) {
    console.log("Error: ", e);
    return { message: "Fail to update ingredient", error: e };
  }
}

exports.createReceiptImage = async (data) => {
  try {
    const response = await ReceiptImage.bulkCreate(data);
    return response;
  } catch (e) {
    console.log("Error: ", e);
    return { message: "Fail to save ingredient", error: e };
  }
}

exports.updateReceiptImage = async (data) => {
  try {
    const response = await ReceiptImage.bulkCreate(data, { updateOnDuplicate: ["name", "url"] });
    return response;
  } catch (e) {
    console.log("Error: ", e);
    return { message: "Fail to update ingredient", error: e };
  }
}

exports.listNear = async (data) => {
  let { latitude, longitude, radiusMiles } = data;
  let query = "SELECT U.id AS user_id, ( 3959 * acos( cos( radians("+latitude+") ) * cos( radians( location_lat ) ) " +
    "* cos( radians( location_lon ) - radians("+longitude+") ) + sin( radians("+latitude+") ) * sin(radians(location_lat)) ) ) AS distance," +
    " P.id AS plate_id, P.delivery_type, P.name, P.price, P.description, P.delivery_time " +
    "FROM Users as U LEFT JOIN Plates as P on U.user_type = 'chef' WHERE U.id = P.userId " +
    "HAVING distance < "+radiusMiles+" ORDER BY distance LIMIT 0 , 20;";
  try {
    const response = await ReceiptImage.sequelize.query(query, { raw: true });
    let resultado = JSON.stringify(response);
    resultado = JSON.parse(resultado);
    return resultado[0];
  } catch (e) {
    console.log("Error: ", e);
    return { message: "Fail the plates", error: e };
  }
}

exports.findPlate = async (data) => {
  try {
    const existPlate = await Plates.findByPk(data, {
      attributes: [ 'id', 'name', 'description', 'price', 'delivery_time', 'sell_count' ],
      include: [
        {
          model: PlateCategory,
          as: 'category',
          attributes: [ 'name', 'description', 'url' ]
        },
        {
          model: Ingredient,
          attributes: [ 'id', 'name', 'purchase_date' ]
        },
        {
          model: PlateImage,
          attributes: [ 'id', 'name', 'url' ]
        },
        {
          model: KitchenImage,
          attributes: [ 'id', 'name', 'url' ]
        },
        {
          model: ReceiptImage,
          attributes: [ 'id', 'name', 'url' ]
        },
      ]
    });
    return existPlate;
  } catch (e) {
    console.log("Error: ", e);
    return { message: "Fail to get Plate!", error: e };
  }
}

exports.getPlate = async (data) => {
  try {
    const existPlate = await Plates.findByPk(data, {
      attributes: [ 'id', 'name', 'description', 'price', 'delivery_time', 'sell_count' ],
      include: [
        {
          model: PlateCategory,
          as: 'category',
          attributes: [ 'name', 'description', 'url' ]
        },
        {
          model: Ingredient,
          attributes: [ 'name', 'purchase_date' ]
        },
        {
          model: PlateImage,
          attributes: [ 'name', 'url' ]
        },
        {
          model: KitchenImage,
          attributes: [ 'name', 'url' ]
        },
        {
          model: ReceiptImage,
          attributes: [ 'name', 'url' ]
        },
      ]
    });
    return existPlate;
  } catch (e) {
    console.log("Error: ", e);
    return { message: "Fail to get Plate!", error: e };
  }
}

exports.listPlates = async (data) => {
  if (data.page == 1) {
    try {
      const existPlates = await Plates.findAll({
          include: [
            {
              model: PlateImage,
              attributes: [ 'name', 'url' ]
            }
          ],
          attributes: [ 'id', 'name', 'description', 'price', 'delivery_time', 'sell_count' ],
          order: [ ['id', 'DESC'] ],
          limit: parseInt(data.pageSize)
        });
        return existPlates;
      } catch (e) {
        console.log("Error: ", e);
        return { message: "Fail to get Plates!", error: e };
      }
  }

  try {
    let skiper = data.pageSize * (data.page - 1)
    const existPlates = await Plates.findAll({
        include: [
          {
            model: PlateImage,
            attributes: [ 'name', 'url' ]
          }
        ],
        attributes: [ 'id', 'name', 'description', 'price', 'delivery_time', 'sell_count' ],
        order: [ ['id', 'DESC'] ],
        offset: parseInt(skiper),
        limit: parseInt(data.pageSize),
      });
      return existPlates;
    } catch (e) {
      console.log("Error: ", e);
      return { message: "Fail to get Plates!", error: e };
    }
}
