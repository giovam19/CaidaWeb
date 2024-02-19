const bcrypt = require('bcryptjs');

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

function validateLogin(rows, pass) {
    const data = emptyOrRows(rows);

    if ( data == [] || data.length == 0) {
        return {isError: true, user: null, message: "Email no encontrado."};
    }
    
    const {id, username, email, password} = data[0];
    const validPass = bcrypt.compareSync(pass, password);

    if (validPass) {
        return { isError: false, user: {id, username, email}, message: "Usuario logeado"};
    }

    return { isError: true, user: null, message: "Contraseña incorrecta!" };
}

module.exports = {
    emptyOrRows,
    validateLogin
}