import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, Toast, Container, Form, Card, Button, Alert } from 'react-bootstrap';
import LoadingIndicator from './LoadingIndicator';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const FormAddUser = () => {
    const { users } = useSelector((state) => state.auth); 
    const [username, setUsername] = useState("");
    const [full_name, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState(null); 
    const [msg, setMsg] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const saveUsers = async (e) => {
        e.preventDefault();
        if (!username || !full_name || !password || !role) {
            setMsg("Semua bidang wajib harus diisi.");
            setShowToast(true);
            return;
        }

        setIsLoading(true);
        setError(null); 

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/users`, {
                username,
                full_name,
                password,
                role
            }); 
            setMsg("User berhasil disimpan!");
            setShowToast(true);
            setTimeout(() => {
                navigate("/users");
            }, 2000);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    setMsg("Akses Ditolak: Anda tidak memiliki izin.");
                } else {
                    setMsg(error.response.data.msg || "Terjadi kesalahan server.");
                }
            } else {
                setMsg("Terjadi kesalahan. Coba lagi nanti.");
            }
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className='container mt-5'>
            <ToastContainer
                position="bottom-end"
                className="p-3"
                style={{ zIndex: 9999, position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)' }}
            >
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={4000} autohide bg={msg.includes("berhasil") ? "success" : "danger"}>
                    <Toast.Header><strong className="me-auto">Notifikasi</strong></Toast.Header>
                    <Toast.Body className="text-white">{msg}</Toast.Body>
                </Toast>
            </ToastContainer>

            <h2 className='mt-5 pt-5 text-blue fw-bold'>Tambah Pengguna</h2>

            <div className='mt-3'>
                {isLoading ? (
                    <div className="d-flex justify-content-center my-5">
                        <LoadingIndicator animation="border" style={{ width: "3rem", height: "3rem" }} />
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="text-center">{error}</Alert>
                ) : users && users.role === "admin" ? (
                    <Card className="custom-table shadow-sm">
                        <Card.Body>
                            <Form className="row text-blue" onSubmit={saveUsers}>
                                <Form.Group className='mb-3'>
                                    <Form.Label className='fw-bold'>Username</Form.Label>
                                    <Form.Control type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' required />
                                </Form.Group>

                                <Form.Group className='mb-3'>
                                    <Form.Label className='fw-bold'>Full Name</Form.Label>
                                    <Form.Control type='text' value={full_name} onChange={(e) => setFullName(e.target.value)} placeholder='Full Name' required />
                                </Form.Group>

                                <Form.Group className='mb-3'>
                                    <Form.Label className='fw-bold'>Password</Form.Label>
                                    <Form.Control type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Masukkan password..' required />
                                </Form.Group>

                                <Form.Group className='mb-3'>
                                    <Form.Label className='fw-bold'>Role</Form.Label>
                                    <Form.Select value={role} onChange={(e) => setRole(e.target.value)} required>
                                        <option value="">Pilih Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </Form.Select>
                                </Form.Group>

                                <div className='col-12 d-flex justify-content-end'>
                                    <Button
                                    variant="secondary"
                                    className='mt-4 me-2'
                                    onClick={() => navigate("/users")}
                                    disabled={isLoading}>
                                        <FaArrowLeft className='me-2' /> Kembali
                                    </Button>
                                    <Button type="submit" disabled={isLoading} className='btn-primary mt-4'>
                                        <FaSave className="me-2" /> Simpan
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                ) : (
                    <Alert variant="warning" className="text-center">Anda tidak memiliki akses ke halaman ini.</Alert>
                )}
            </div>
        </Container>
    );
};

export default FormAddUser;