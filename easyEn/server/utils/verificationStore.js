const verificationCode = new Map();

export const storeVerificationCode = (userId, code, expriresAt) =>{
    verificationCode.set(userId, {code, expriresAt});
};

export const getVerificationCode = (userId) =>{
    return verificationCode.get(userId);
}

export const removeVerificationCode = (userId) =>{
    return verificationCode.delete(userId);

}