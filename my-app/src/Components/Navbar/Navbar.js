import React from 'react';

import "./Navbar.css"


const Navbar = (props) => {
    
    return ( 
        <div className="Navbar">
            <div className="navbar-container">
                <h1>Granular Lending</h1>
                <button disabled={props.disabled} onClick={props.onClick}>{props.loginButtonText}</button>
            </div>
        </div>
     );
}
 
export default Navbar;