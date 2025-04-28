import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ScrollButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: white;
  color: #2f2f2f;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #2f2f2f;
  cursor: pointer;
  display: ${props => props.visible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    background-color: #f3f3f3;
    transform: translateY(-3px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

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
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <ScrollButton visible={isVisible} onClick={scrollToTop}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    </ScrollButton>
  );
};

export default ScrollToTop; 