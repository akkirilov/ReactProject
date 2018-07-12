function validateRegister(user) { 
    const {username, email, password, passwordRepeat } = user;
    let error;
    if (!username || username.length < 3) {
        error = "Username must contains at least 3 symbols.";
    } else if (!password || !passwordRepeat || password !== passwordRepeat) {
        error = "Passwords did not match.";
    } else if (!email || !/.+@.+\..+/g.test(email)) {
        error = "Email is invalid.";
    }
    return error;
}

function validateLogin(user) { 
    const {username, email, password, passwordRepeat } = user;
    let error;
    if (!username || username.length < 3) {
        error = "Username must contains at least 3 symbols.";
    } else if (!password) {
        error = "Password is required!";
    }
    return error;
}

let userValidator = {
    validateRegister,
    validateLogin
}

export default userValidator;
