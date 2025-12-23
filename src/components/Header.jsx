import React, { useState, useEffect, useCallback } from 'react';
import { Container, Nav, Navbar, Offcanvas, Button, Modal, Toast } from 'react-bootstrap';
import { FaBars, FaHistory, FaDatabase, FaCheck } from "react-icons/fa";
import { IoLogOut, IoPerson } from "react-icons/io5";
import { HiDocumentDownload } from "react-icons/hi";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "../features/authSlice";

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeLink, setActiveLink] = useState('/'); 
    const { users } = useSelector((state) => state.auth);
    const [showToast, setShowToast] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);

    const logout = () => {
        setConfirmLogout(true);
    };

    const handleConfirmLogout = () => {
        dispatch(LogOut())
        .then(() => {
            setConfirmLogout(false);
            setShowToast(true);
            setTimeout(() => {
                navigate("/login", { state: { message: "Logout berhasil!" } })
            }, 1000);
        })
        .catch((error) => {
            console.error("Logout failed:", error);
        });
    };

  const handleCancelLogout = () => {
    setConfirmLogout(false);
  };

    const handleNavLinkClick = useCallback((path) => {
        setActiveLink(path);
        navigate(path);
    }, [navigate]);

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);

    return (
        <>
            <Navbar expand="lg" fixed="top" variant="light" className="navbar nav-underline bg-blue shadow-sm py-1 ">
                <Container>
                    <Navbar.Brand href="/">
                        <h2 className='text-light'> Automasi Struk</h2>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="offcanvasNavbar" className="d-lg-none border-0 bg-blue">
                        <FaBars size={24} color="white" />
                    </Navbar.Toggle>

                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="start"
                        className="nav-underline bg-blue d-lg-none w-50"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel" className="fw-bold text-blue">
                                Menu
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="d-flex flex-column mx-auto">
                            <Navbar.Collapse id="offcanvasNavbar" className="mx-auto">
                                <Nav className="flex-column text-blue blue-hover mx-auto">
                                    {users && users.role === "admin" && (
                                    <Nav.Link
                                        onClick={() => handleNavLinkClick("/users")}
                                        className={`text-blue blue-hover d-flex align-items-center ${activeLink === '/users' ? 'active' : ''}`}
                                        href="/users"
                                    >
                                        <IoPerson className="me-2" /> Users
                                    </Nav.Link>
                                    )}
                                    <Nav.Link
                                        onClick={() => handleNavLinkClick("/")}
                                        className={`text-blue blue-hover d-flex align-items-center ${activeLink === '/' ? 'active' : ''}`}
                                        href="/"
                                    >
                                        <FaHistory className="me-2" /> Riwayat
                                    </Nav.Link>
                                    <Nav.Link
                                        onClick={() => handleNavLinkClick("/upload-struk")}
                                        className={`text-blue d-flex align-items-center ${activeLink === '/upload-struk' ? 'active' : ''}`}
                                        href="/upload-struk"
                                    >
                                        <HiDocumentDownload className="me-2" /> Upload Struk
                                    </Nav.Link>
                                    <Nav.Link
                                        onClick={() => handleNavLinkClick("/data-struk")}
                                        className={`text-blue d-flex align-items-center ${activeLink === '/data-struk' ? 'active' : ''}`}
                                        href="/data-struk"
                                    >
                                        <FaDatabase className='me-2' /> Data Struk  
                                    </Nav.Link> 
                                    <Nav.Link>
                                    <Button onClick={logout} className="button btn-danger">
                                    <IoLogOut /> Log out
                                    </Button>
                                </Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>

                    {/* DESKTOP */}
                    <div className="d-none d-lg-flex align-items-center justify-content-end flex-grow-1">
                        <Navbar.Collapse id="offcanvasNavbar" className="justify-content-between">
                            <Nav className="d-flex text-white blue-hover align-items-center justify-content-center flex-grow-1">
                                {users && users.role === "admin" && (
                                <Nav.Link
                                    onClick={() => handleNavLinkClick("/users")}
                                    className={`text-white blue-hover d-flex align-items-center me-3 ${activeLink === '/users' ? 'active' : ''}`}
                                    href="/users"
                                >
                                <IoPerson className="me-2" /> Users
                                </Nav.Link>
                                )}
                                 <Nav.Link
                                    onClick={() => handleNavLinkClick("/")}
                                    className={`text-white blue-hover d-flex align-items-center me-3 ${activeLink === '/' ? 'active' : ''}`}
                                    href="/"
                                >
                                    <FaHistory className="me-2" /> Riwayat
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => handleNavLinkClick("/upload-struk")}
                                    className={`text-white d-flex align-items-center me-3 ${activeLink === '/upload-struk' ? 'active' : ''}`}
                                    href="/upload-struk"
                                >
                                    <HiDocumentDownload className="me-2" /> Upload Struk
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => handleNavLinkClick("/data-struk")}
                                    className={`text-white d-flex align-items-center me-3 ${activeLink === '/data-struk' ? 'active' : ""}`}
                                    href="/data-struk"
                                    >
                                        <FaDatabase className="me-2" /> Data Struk
                                </Nav.Link>
                                <Nav.Link>
                                    <Button onClick={logout} className="button btn-danger">
                                    <IoLogOut /> Log out
                                    </Button>
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                        
                        <Toast
                        show={showToast}
                        onClose={() => setShowToast(false)}
                        delay={3000}
                        autohide
                        style={{
                            position: 'fixed',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 9999,
                        }}
                        >
                        <Toast.Body className="text-white rounded text-center bg-success">
                            <FaCheck /> Anda berhasil keluar dari akun Anda.
                        </Toast.Body>
                        </Toast>

                        <Modal
                        show={confirmLogout}
                        onHide={handleCancelLogout}
                        centered
                        backdrop="static"
                        keyboard={false}
                        >
                        <Modal.Header closeButton>
                            <Modal.Title className="text-blue fw-bold">Konfirmasi Logout</Modal.Title>
                        </Modal.Header>
                        
                        <Modal.Body className="text-center">
                            <p className="text-blue">Apakah Anda yakin ingin keluar dari akun Anda?</p>
                        </Modal.Body>
                        
                        <Modal.Footer className="d-flex justify-content-center">
                            <Button variant="secondary" onClick={handleCancelLogout}>
                                Batal
                            </Button>
                            
                            <Button variant="danger" onClick={handleConfirmLogout}>
                                Ya, Keluar
                            </Button>
                        </Modal.Footer>
                        </Modal>
                    </div>

                </Container>
            </Navbar>
        </>
    );
}

export default Header;
