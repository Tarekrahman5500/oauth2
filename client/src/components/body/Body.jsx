import React, {Component} from 'react';
import {Routes, Route} from 'react-router-dom'
import Login from "./auth/Login";
import Register from "./auth/Register";
import ActivationEmail from "./auth/ActivationEmail";
class Body extends Component {
    render() {
        return (
           <section>
              <Routes>

                  <Route  path="/login" element={<Login />}/>
                   <Route  path="/register" element={<Register />}/>
                   <Route  path="/user/activate/:activation_token" element={<ActivationEmail />}/>
              </Routes>
           </section>
        );
    }
}

export default Body;