import React from 'react';

import "./Sidebar.css";
import profileImg from "./assets/kenny.jpg";
import sandIcon from "./assets/sandIcon.png"
const Sidebar = (props) => {
    return ( 
        <div className="Sidebar">
            <div className="sidebar-container">
                <h2>Your Account</h2>
                <div>
                    <img className="profileImg" src={profileImg} alt="user's profile picture"/>
                    <h3>
                        Your address <b>{props.accounts}</b>
                    </h3>
                    <div className="accBalance">
                        <h3>
                            Your SAND balance : <span><img className="sandIcon" src={sandIcon} /></span> <b>{props.sandBalance}</b>
                        </h3>
                        <h3>
                            Your LAND balance : <b>{props.landBalance}</b>
                        </h3>
                    </div>
                </div>
                
            </div>
        </div>
     );
}
 
export default Sidebar;