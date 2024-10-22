import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Tab, Tabs } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react';
import { userState } from '../blocks/userprofile'; 

const LoginModal = observer(({ show, handleClose }) => { 
    const { register: registerLogin, handleSubmit: handleLoginSubmit } = useForm();
    const { register: resetPassword, handleSubmit: handlePasswordReset } = useForm();
    const { register: registerRegister, handleSubmit: handleRegisterSubmit } = useForm(); 
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch('/csrf-token');
                const data = await response.json();
                setCsrfToken(data.csrf_token); 
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        fetchCsrfToken();
    }, []);
    
    // LOGIN FUNCTION
    const handleLogin = (data) => {
        const params = new URLSearchParams();
        params.append('username', data.username); 
        params.append('password', data.password); 
        params.append('_csrf_token', csrfToken); 

        fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
            body: params.toString(), 
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                userState.user = data.user;
            }else{
                userState.message = data.message;
            }
        })
        .catch((error) => {
            console.error('Error during login:', error);
        });
    };

    // RESET PASSWORD FUNCTION
    const reset = (data) =>{
        fetch('/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data, _csrf_token: csrfToken }),
        })
        .then((res) => res.json())
        .then((response) => {
            userState.message = response.message;
        })
        .catch((error) => {
            console.error('Error during registration:', error);
        });
    }

    // REGISTER FUNCTION
    const handleRegister = (data) => {
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data, _csrf_token: csrfToken }),
        })
        .then((res) => res.json())
        .then((response) => {
            userState.setUser(response.user); 
            handleClose();
        })
        .catch((error) => {
            console.error('Error during registration:', error);
        });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
            {userState.forgot  === false ? (
                <Tabs defaultActiveKey="login" id="auth-tabs" className="mb-3">
                    <Tab eventKey="login" title="Login">
                        {userState.message !== '' && (
                            <div className='message-container alert alert-warning my-3'>
                                {userState.message}
                            </div>
                        )}
                            <Form
                            onSubmit={handleLoginSubmit(handleLogin)}
                            className="input-group d-flex flex-column align-items-center"
                            >
                            <Form.Group className="mb-3 col-12">
                                <Form.Control
                                type="text"
                                placeholder="Username"
                                {...registerLogin('username', { required: true })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 col-12">
                                <Form.Control
                                type="password"
                                placeholder="Password"
                                {...registerLogin('password', { required: true })}
                                />
                            </Form.Group>
                            <div
                                onClick={() => userState.setForgot(true)}
                                style={{ cursor: 'pointer' }}
                            >
                                Forgot Password
                            </div>
                            <Button type="submit" className="btn text-white custom-button mt-3">
                                Login
                            </Button>
                            </Form>
                    </Tab>
                    <Tab eventKey="register" title="Register">
                            <Form onSubmit={handleRegisterSubmit(handleRegister)} className="input-group d-flex flex-column align-items-center">
                                <Form.Group className="mb-3 col-12">
                                    <Form.Control
                                        type="text"
                                        placeholder="Username"
                                        {...registerRegister('username', { required: true })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3 col-12">
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        {...registerRegister('password', { required: true })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3 col-12">
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        {...registerRegister('email', { required: true })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3 col-12">
                                    <Form.Select {...registerRegister('type', { required: true })}>
                                        <option value="Merchant">Merchant</option>
                                        <option value="Buyer">Buyer</option>
                                    </Form.Select>
                                </Form.Group>
                                <Button type="submit" className="btn text-white custom-button mt-3">
                                    Register
                                </Button>
                            </Form>
                    </Tab>
                </Tabs>
            ) : (
                <Form
                onSubmit={handlePasswordReset(reset)}
                className="input-group d-flex flex-column align-items-center"
                >
                    {userState.message !== '' && (
                            <div className='message-container alert alert-warning my-3'>
                                {userState.message}
                            </div>
                    )}
                    <Form.Group className="mb-3 col-12">
                        <Form.Control
                        type="email"
                        placeholder="Email"
                        {...resetPassword('email', { required: true })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 col-12">
                        <Form.Control
                        type="password"
                        placeholder="New Password"
                        {...resetPassword('new-password', { required: true })}
                        />
                    </Form.Group>
                    <Button type="submit" className="btn text-white custom-button mt-3">
                        Reset
                    </Button>
                </Form>
            )}
            </Modal.Body>
        </Modal>
    );
});

export default LoginModal;