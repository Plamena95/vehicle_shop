import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { userState } from '../blocks/userprofile';
import LoginModal from '../blocks/loginModal';
import VehicleModal from '../blocks/vehicleModal';
import axios from 'axios';

const Menu = observer(() => {
    const [vehicleTypes, setvehicleTypes] = useState([]);
    useEffect(() => {
        userState.checkLogin();
        userState.setForgot(false);
        userState.toggleModal(false); 

        // GETTING CAR TYPES
        axios.post('/car/type')
            .then(response => {
                setvehicleTypes(response.data);
            })
            .catch(error => console.error('Product submission error:', error));
    }, []);

    // LOG OUT FUNCTION
    const handleLogout = async (event) => {
        event.preventDefault();
        await userState.logout(); 
    };

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false); 
    const [modalIsOpen, setIsOpen] = useState(false);

    const handleProductCreated = () => {
        closeModal(); 
    };

    return (
                <Navbar bg="dark" expand="lg" className="custom-navbar">
                    <Container fluid className="container">
                        <Navbar.Brand className="text-white" href="/">Vehicles<span className='fw-bold color-secondary'>.</span></Navbar.Brand>
                        <Navbar.Toggle className='text-white' aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav className="me-auto my-2 my-lg-0 container navbar-nav navbar-nav-scroll justify-content-end align-items-center navbar-nav navbar-nav-scroll flex-column flex-lg-row" navbarScroll>
                                {userState.user ? (
                                    <>
                                        <Nav.Link className='text-white' as={NavLink} to="/profile"><i className="fa-solid fa-heart text-white"></i></Nav.Link>
                                        <div className="custom-button btn mx-auto my-3 my-lg-0 mx-lg-3" onClick={handleLogout}>Log out</div>
                                        { userState.user.type == 'Merchant'&& (
                                            <div>
                                                <button className='custom-button btn' onClick={openModal}>Add New Vehicle</button>
                                                <VehicleModal 
                                                    isOpen={modalIsOpen} 
                                                    onRequestClose={closeModal} 
                                                    vehicleTypes={vehicleTypes} 
                                                    onProductCreated={handleProductCreated} 
                                                />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="App">
                                        <div onClick={() => userState.toggleModal(true)} className='cursor-pointer'>
                                            <i className="fa-solid fa-user text-white"></i>
                                        </div>

                                        <LoginModal show={userState.showModal} 
                                                    handleClose={() => {
                                                        userState.toggleModal(false);
                                                        userState.setForgot(false) }} />
                                    </div>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
    );
});

export default Menu;