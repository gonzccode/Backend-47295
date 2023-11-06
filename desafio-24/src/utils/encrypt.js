const bcrypt = require("bcrypt");

const createHashValue = async (value) => {
    const salt = await bcrypt.genSalt();
    return bcrypt.hashSync(value, salt);
};

const isValidPassword = async (pwd, encryptedPwd) => {
    const validValue = await bcrypt.compareSync(pwd, encryptedPwd);
    return validValue;
};

module.exports = {
    createHashValue,
    isValidPassword
};