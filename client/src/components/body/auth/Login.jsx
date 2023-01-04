import React, {useState} from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import {showErrMsg, showSuccessMsg} from '../../utils/notification/Notifications'
const initialState = {
    email: '',
    password: '',
    err: '',
    success: '',
}


const Login = () => {
    const [user, setUser] = useState(initialState)
    const {email, password, err, success} = user
    const handleChangeInput = e => {
        const {name, value} = e.target
        setUser({...user, [name]: value, err: '', success: ''})
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const res = await axios.post(`http://localhost:5000/users/login`, {email, password})
             setUser({...user, err: '', success: res.data.message})
            localStorage.setItem('firstLogin', true)
            console.log(res)
        } catch (err) {
            err.response.data.message &&
            setUser({...user, err: err.response.data.message, success: ''})
            console.log(err)
        }
    }
    return (
        <div className="login_page">
            <h2>Login</h2>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="text" id="email" name="email" placeholder="Enter Email Address"
                           value={email} onChange={handleChangeInput}/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter Password"
                           value={password} onChange={handleChangeInput}/>
                </div>
                <div className="row">
                    <button type="submit">Login</button>
                    <Link to="/forgot_password">Forgot your password</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;