import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import {showErrMsg, showSuccessMsg} from '../../utils/notification/Notifications'

const ActivationEmail = () => {
    const {activation_token} = useParams()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if (activation_token) {
            const activationEmail = async() => {
                try {
                     const res = await axios.post(`http://localhost:5000/users/activation`, {activation_token})
                    setSuccess(res.data.message)
                } catch (err) {
                    err.response.data.message && setError(err.response.data.message)
                }
            }
            activationEmail().catch(console.dir)
        }
    },[activation_token])
    console.log(activation_token)
    return (
        <div className="active_page">
             {error && showErrMsg(error)}
            {success && showSuccessMsg(success)}
        </div>
    );
};

export default ActivationEmail;