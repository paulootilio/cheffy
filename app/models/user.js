module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    country_code: DataTypes.STRING,
    phone_no: DataTypes.STRING,
    auth_token: DataTypes.STRING,
    restaurant_name: DataTypes.STRING,
    password: DataTypes.STRING,
    location: DataTypes.STRING,
    user_type: DataTypes.ENUM('user', 'chef', 'admin', 'driver'),
    imagePath: DataTypes.STRING,
    verification_code: DataTypes.STRING,
    verification_email_token: DataTypes.STRING,
    verification_email_status: DataTypes.ENUM('pending', 'verified'),
    verification_phone_token: DataTypes.STRING,
    verification_phone_status: DataTypes.ENUM('pending', 'verified'),
    status: DataTypes.INTEGER,
    user_ip: DataTypes.STRING
  });
  User.associate = function(models) {
    User.hasMany(models.Plates)
    User.hasMany(models.OrderDelivery)
    User.hasMany(models.Order)
    User.hasMany(models.ShippingAddress);
    User.hasOne(models.Documents);
    User.hasOne(models.Basket);
    User.hasOne(models.Wallet);
    User.hasOne(models.Transactions);
  }
  return User;
}
