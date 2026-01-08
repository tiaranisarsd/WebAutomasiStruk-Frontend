import React, {useState, useEffect} from 'react';
import { Button } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const ScrollButton = () => {
    const [ isVisible, setIsVisible ] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

  return (
    <div
    style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: "1000",
    }}
    >
        {isVisible && (
            <Button
            variant='primary'
            className='rounded-circle shadow border-0'
            onClick={scrollToTop}
            style={{ width: "45px", height: "45px", backgroundColor: "transparent" }}
            >
                <FaArrowUp style={{color: "#213448"}} />
            </Button>
        )}

        <Button
        variant='secondary'
        className='rounded-circle shadow border-0'
        onClick={scrollToBottom}
        style={{ width: "45px", height: "45px", backgroundColor: "transparent" }}
        >
            <FaArrowDown style={{color: "#213448"}} />
        </Button>
    </div>
  )
}

export default ScrollButton