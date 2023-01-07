import React, {useState} from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import {showErrMsg, showSuccessMsg} from '../../utils/notification/Notifications'
import {isEmpty, isEmail, isLength, isMatch} from '../../utils/validation/validation'

const initialState = {
    name: '',
    email: '',
    password: '',
    cf_password: '',
    err: '',
    success: '',
}


const Register = () => {
    const [user, setUser] = useState(initialState)
    const {name, email, password, cf_password, err, success} = user
    const handleChangeInput = e => {
        const {name, value} = e.target
        setUser({...user, [name]: value, err: '', success: ''})
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (isEmpty(name) || isEmpty(password))
            return setUser({...user, err: 'Fill all fields correctly', success: ''})
        if (!isEmail(email))
            return setUser({...user, err: 'Invalid email', success: ''})
        if (isLength(password))
            return setUser({...user, err: 'Password must be 6 digits', success: ''})
        if (!isMatch(password, cf_password))
            return setUser({...user, err: 'Password did not match', success: ''})
        try {

            const res = await axios.post(`http://localhost:5000/users/register`, {name, email, password})
             setUser({...user, err: '', success: res.data.message})
            localStorage.setItem('firstLogin', true)

            console.log(res)
        } catch (err) {
            /*err.response.data.message &&
            setUser({...user, err: err.response.data.message, success: ''})
            console.log(err)*/
        }
    }
    return (
        <div className="login_page">
            <h2>Register</h2>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Enter Your Name"
                           value={name} onChange={handleChangeInput}/>
                </div>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="Enter Email Address"
                           value={email} onChange={handleChangeInput}/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter Password"
                           value={password} onChange={handleChangeInput}/>
                </div>
                <div>
                    <label htmlFor="cf_password"> Conform Password</label>
                    <input type="password" id="cf_password" name="cf_password" placeholder="Conform Password"
                           value={cf_password} onChange={handleChangeInput}/>
                </div>
                <div className="row">
                    <button type="submit">SignIn</button>
                </div>
            </form>
            <p>Already an account?<Link to="/login">Login</Link></p>
        </div>
    );
};

export default Register;