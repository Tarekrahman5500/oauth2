import React, {Component} from 'react';
import {Link} from 'react-router-dom'
class Header extends Component {
    render() {
        return (
           <header>
                <div className="logo">
               <h1><Link to="/">Test Project</Link></h1>
            </div>
               <ul>
                   <li><Link to="/"><i className="fa-sharp fa-solid fa-cart-shopping"></i> Cart</Link></li>
                    <li><Link to="/login"><i className="fa-solid fa-user"></i> Sign in</Link></li>
               </ul>
           </header>
        );
    }
}

export default Header;