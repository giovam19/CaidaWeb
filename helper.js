const bcrypt = require('bcryptjs');

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

function validateLogin(data, pass) {
    if ( data == [] || data.length === 0) {
        return false;
    }

    

    const {username, password} = data[0];
    const validPass = bcrypt.compareSync(pass, password);

    return validPass;
}

module.exports = {
    emptyOrRows,
    validateLogin
}