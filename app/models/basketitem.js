'use strict';
module.exports = (sequelize, DataTypes) => {
  const BasketItem = sequelize.define('BasketItem', {
    plateId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Plates',
        key: 'id'
      }
    },
    quantity: DataTypes.INTEGER,
    basketId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Baskets',
        key: 'id'
      }
    },
  }, {});
  BasketItem.associate = function(models) {
    BasketItem.belongsTo(models.Basket, {foreignKey: 'basketId', as: 'basket'})
    BasketItem.belongsTo(models.Plates, {foreignKey: 'plateId', as: 'plate', onDelete: 'cascade'})
  };
  return BasketItem;
};
