const verificationCode = new Map();

const storeVerificationCode = (userId, code, expriresAt) =>{
    verificationCode.set(userId, {code, expriresAt});
};

const getVerificationCode = (userId) =>{
    return verificationCode.get(userId);
}

const removeVerificationCode = (userId) =>{
    return verificationCode.delete(userId);

}