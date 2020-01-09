const {sequelize} = require('../models/index')

exports.findDriversInsideArea = async (latitude,longitude,radiusMiles) => {
    let strQuery = "SELECT id, ( 3959 * acos( cos( radians("+latitude+") ) * cos( radians( CAST(SUBSTRING_INDEX(location, ',', 1) AS DECIMAL(10,6)) ) ) "+
                    "* cos( radians( CAST(SUBSTRING_INDEX(location, ',', -1) AS DECIMAL(10,6)) ) - radians("+longitude+") ) + sin( radians("+latitude+")) *"+
                    " sin(radians(CAST(SUBSTRING_INDEX(location, ',', 1) AS DECIMAL(10,6)))) ) ) AS distance "+
                    "FROM Users "+
                    "where user_type='user' "+// we need to create a new enum for drivers on the db
                    "HAVING distance < "+parseInt(radiusMiles)
                    "ORDER BY distance "+
                    "LIMIT 0 , 20;";
    console.log(strQuery)
    let result = await sequelize.query(strQuery);

    return result;

}
