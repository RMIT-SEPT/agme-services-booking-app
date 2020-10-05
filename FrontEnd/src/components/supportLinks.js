import React, { useState } from 'react';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom';
import '../css/supportLinks.css';

const SupportLinks = ({userDetails}) => {
    const history = useHistory();
    const userName = userDetails.username;
    const [aboutModalOpen, setAboutModalOpen] = useState(false);
    const [contactModalOpen, setContactModalOpen] = useState(false);

    const customStyles = {
        content : {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            textAlign: 'center',
            transform: 'translate(-50%, -50%)',
            color: 'black'
        }
    };

    const handleSignOut = () => {
        if (window.confirm("Are you sure you want to sign out?")) {
            localStorage.clear();
            window.alert("You have been signed out. Redirecting to login page.");
            history.push("/");
        }
    }

    return(
        <div id="supportLinks">
            <Modal
            isOpen={aboutModalOpen}
            onRequestClose={() => setAboutModalOpen(false)}
            style={customStyles}
            >
                <div id="aboutUsContainer">
                    <p className="modalText">Hi, welcome to AGME. <br/> Yes, we're a real service. We're the one stop shop for all your services. <br/> We hope you enjoy your experience with AGME. {"<"}3</p>
                </div>
            </Modal>

            <Modal
            isOpen={contactModalOpen}
            onRequestClose={() => setContactModalOpen(false)}
            style={customStyles}
            >
                <div id="contactUsContainer">
                    <p className="modalText">Contact us at (+61)420 123 456. <br /> Support Email: s392783@student.rmit.edu.au <br /> Service Enquiries: Anyone that's not me</p>
                </div>
            </Modal>

            <button className="buttonAsText" onClick={() => setAboutModalOpen(true)}>About Us</button>
            <button className="buttonAsText" onClick={() => setContactModalOpen(true)}>Contact Us</button>
            <button className="buttonAsText" onClick={handleSignOut}>Sign Out</button>
            <span className="individualSupportItem">Welcome, {userName}!</span>
        </div>
    )
}

export default SupportLinks;