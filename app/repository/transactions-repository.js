const {sequelize} = require('../models/index')
const Validator = require('../services/validator')

exports.saveTransaction = async (type, identifier, userId, orderPaymentId, orderItemId, amount) => {
    const validator = new Validator()

    validator.isRequired(type,"You must inform the type of this transaction (D)ebit or (C)redit")
    validator.isRequired(identifier,"Identifier is required")
    validator.isRequired(identifier,"User id is required")

    
    console.log(strQuery)
    let result = await sequelize.query(strQuery);

    return result;

}
