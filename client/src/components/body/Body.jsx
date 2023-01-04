import React, {Component} from 'react';
import {Routes, Route} from 'react-router-dom'
import Login from "./auth/Login";
class Body extends Component {
    render() {
        return (
           <section>
              <Routes>
                  <Route  path="/login" element={<Login />}/>
              </Routes>
           </section>
        );
    }
}

export default Body;