import React from 'react';
import './notification.css'
export  const showErrMsg = (err) => {

    return <div className="errMsg">{err}</div>;
}

export const showSuccessMsg = (success) => {
     return <div className="successMsg">{success}</div>;
}