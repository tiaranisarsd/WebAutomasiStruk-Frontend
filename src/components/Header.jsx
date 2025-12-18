import React, { useState, useEffect, useCallback } from 'react';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { FaBars, FaHistory, FaDatabase } from "react-icons/fa";
import { HiDocumentDownload } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeLink, setActiveLink] = useState('/'); 

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
                                </Nav>
                            </Navbar.Collapse>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>

                    {/* DESKTOP */}
                    <div className="d-none d-lg-flex align-items-center justify-content-end flex-grow-1">
                        <Navbar.Collapse id="offcanvasNavbar" className="justify-content-between">
                            <Nav className="d-flex text-white blue-hover align-items-center justify-content-center flex-grow-1">
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
                            </Nav>
                        </Navbar.Collapse>
                    </div>

                </Container>
            </Navbar>
        </>
    );
}

export default Header;
