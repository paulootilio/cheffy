'use strict';
const { PlateCategory, Plates, Ingredient, PlateImage, KitchenImage, ReceiptImage } = require('../models/index');

exports.findExist = async (data) => {
  const existCategory = await PlateCategory.findOne({ where: { name: data } });
  return existCategory;
}

exports.createCategory = async (data) => {
  const category = await PlateCategory.create({ ...data });
  return category;
}

exports.listCategories = async () => {
  const categories = await PlateCategory.findAll();
  return categories;
}

exports.categoriesListPlates = async (data) => {
  const categories = await Plates.findAll({
    where: { categoryId: data },
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
  return categories;
}

exports.editCategory = async (id, data) => {
  const category = await PlateCategory.findByPk(id);
  category.name = data.name;
  category.description = data.description;
  category.url = data.url;
  await category.save();
  return category;
}
