export const isEmpty = value => {
    return !value;
}

export const isEmail = email => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export const isLength = password => {
    return password.length < 6;
}

export const isMatch = (password, cf_password) => {
    return password === cf_password;
}

