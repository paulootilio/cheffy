module.exports = (sequelize, DataTypes) => {
  const Plate = sequelize.define('Plates', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    delivery_time: DataTypes.DOUBLE,
    sell_count: DataTypes.DOUBLE,
    delivery_type: {
      type: DataTypes.ENUM('free', 'paid'),
      defaultValue: 'paid',
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'PlateCategory',
        key: 'id'
      }
    },
  });
  Plate.associate = function(models) {
    Plate.belongsTo(models.User, {foreignKey: 'userId', as: 'user', onDelete: 'cascade'})
    Plate.belongsTo(models.PlateCategory, {foreignKey: 'categoryId', as: 'category', onDelete: 'cascade'})
    Plate.hasMany(models.Ingredient)
    Plate.hasMany(models.PlateImage)
    Plate.hasMany(models.KitchenImage)
    Plate.hasMany(models.ReceiptImage)
  }
  return Plate;
}
