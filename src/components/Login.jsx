import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { Form, Button, Alert, Row, Col, Container } from 'react-bootstrap';
import { LoginUser, reset } from "../features/authSlice";
import imageLogin from "../image-login.png";
import { IoMdLogIn } from "react-icons/io";
import logo from "../LOGO_PESONNA_WARNA_SMALL.png";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, isError, isSuccess, message, isLoading } = useSelector(state => state.auth);

    const Auth = async (e) => {
        e.preventDefault();
        try {
            await dispatch(LoginUser({ username, password })).unwrap();
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            } 
        }
    };

    useEffect(() => {
        if (isSuccess && users) {
            if (users.role === "admin") {
                navigate("/users");
            } else if (users.role === "user") {
                navigate("/");
            }
        }
        
        return () => {
            dispatch(reset());
        };
    }, [users, isSuccess, dispatch, navigate]);

    return (
            <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#e9e9e9' }}>
                <Container>
                    <Row className="login-split-card shadow-lg mx-auto" style={{ maxWidth: "1000px", minHeight: "600px" }}>
                        <Col md={6} className="login-left-panel d-none d-md-flex bg-custom-gradient">
                            <img src={imageLogin} alt='image-login' className=''/>
                        </Col>

                        <Col md={6} className="bg-white px-5 mb-5 d-flex flex-column justify-content-center">
                        <div className="d-flex justify-content-end pt-0" style={{marginBottom: "90px", marginTop: "-20px"}}>
                            <img src={logo} alt='logo' className='w-25'></img>
                        </div>
                            <div className="mb-4" style={{marginTop: "-20px"}}>
                                <h2 className="fw-bold d-flex justify-content-center align-items-center mb-1">Login</h2>
                            </div>

                            {(isError || msg) && (
                                <Alert variant="danger" className="py-1 small text-center" style={{marginTop: "-15px"}}>
                                    {msg || message}
                                </Alert>
                            )}

                            <Form onSubmit={Auth}>
                                <Form.Group className="mb-2">
                                    <Form.Control
                                        className="custom-input"
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Control
                                        className="custom-input"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button
                                    className="btn-payoneer w-100 bg-custom-gradient mb-5 rounded p-2 fw-bold border-0 "
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    <IoMdLogIn className='me-2' />
                                    {isLoading ? "Loading..." : "Masuk"}
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    };

export default Login;
