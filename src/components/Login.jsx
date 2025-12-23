import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { IoMail, IoLockClosed } from "react-icons/io5";
import { LoginUser, reset } from "../features/authSlice";

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
        <div className="login-admin-container d-flex justify-content-center bg-blue align-items-center vh-100">

            <Card className="login-card shadow border-0 p-4 m-3 mt-4" style={{ width: "500px" }}>
                <Card.Body>
                    <div className="d-flex align-items-center mx-auto flex-column">
                            <h2 className="fw-bold text-blue fs-sm-4 ms-3">Login</h2>
                    </div>
                    <hr className="border border-black border-1 opacity-25 w-100 mt-2" />

                    {(isError || msg) && (
                        <Alert variant="danger" className="mt-3 text-center py-2">
                            {msg || message}
                        </Alert>
                    )}

                    <Form onSubmit={Auth} className="mt-4">
                        <Form.Group className="mb-3">
                            <Form.Label className="d-flex text-blue align-items-center fw-bold">
                                <IoMail className="text-blue me-1" />
                                Username
                            </Form.Label>
                            <Form.Control
                                type="username"
                                placeholder="Masukkan Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ borderRadius: '0' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="d-flex text-blue align-items-center fw-bold">
                                <IoLockClosed className="text-blue me-1" />
                                Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ borderRadius: '0' }}
                            />
                        </Form.Group>

                        <div className="d-flex flex-column align-items-center mt-4">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isLoading}
                        style={{ width: '100%' }}
                    >
                        {isLoading ? <span>Loading...</span> : "Masuk"}
                    </Button>
                    </div>

                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Login;
