import React, { useState } from 'react';
import Modal from 'react-modal';
import '../css/supportLinks.css';

const SupportLinks = ({userDetails}) => {
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
                    <p className="modalText">Contact us at (+61)420 123 456. <br /> Support Email: s3719678@student.rmit.edu.au <br /> Service Enquiries: Anyone that's not me</p>
                </div>
            </Modal>

            <button className="buttonAsText" onClick={() => setAboutModalOpen(true)}>About Us</button>
            <button className="buttonAsText" to="/contactus" onClick={() => setContactModalOpen(true)}>Contact Us</button>
            <span className="individualSupportItem">Welcome, {userName}!</span>
        </div>
    )
}

export default SupportLinks;