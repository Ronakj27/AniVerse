import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGlobalContext } from '../context/global'

const Navbar = () => {
    const { handleChange, handleSubmit, search } = useGlobalContext()
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    return (
        <NavbarStyled>
            <div className="logo">
                <Link to="/">
                    <motion.h1
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        AniVerse
                    </motion.h1>
                </Link>
            </div>
            
            <motion.div 
                className={`search-container ${isSearchFocused ? 'focused' : ''}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Search anime..."
                        value={search}
                        onChange={(e) => handleChange(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                    />
                    <button type="submit">
                        <i className="fas fa-search"></i>
                    </button>
                </form>
            </motion.div>
        </NavbarStyled>
    )
}

const NavbarStyled = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1.5rem 2rem;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
        h1 {
            font-size: 1.8rem;
            font-weight: 700;
            background: linear-gradient(135deg,rgb(255, 0, 0) 0%,rgb(237, 98, 98) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 0;
        }
    }

    .search-container {
        flex: 1;
        max-width: 500px;
        margin: 0 2rem;
        position: relative;

        form {
            display: flex;
            align-items: center;
            width: 100%;
        }

        input {
            width: 100%;
            padding: 0.8rem 1.2rem;
            padding-right: 3rem;
            border: 2px solid #e0e0e0;
            border-radius: 25px;
            font-size: 1rem;
            transition: all 0.3s ease;
            outline: none;

            &:focus {
                border-color:rgb(255, 0, 0);
                box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
            }
        }

        button {
            position: absolute;
            right: 0.8rem;
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            padding: 0.5rem;
            transition: all 0.3s ease;

            &:hover {
                color:rgb(255, 0, 0);
                transform: scale(1.1);
            }
        }

        &.focused {
            input {
                border-color:rgb(255, 0, 0);
            }
        }
    }

    @media screen and (max-width: 768px) {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
        
        .logo h1 {
            font-size: 1.5rem;
        }

        .search-container {
            margin: 0;
            max-width: 100%;
            
            input {
                padding: 0.6rem 1rem;
                font-size: 0.9rem;
            }
        }
    }

    @media screen and (max-width: 480px) {
        .logo h1 {
            font-size: 1.3rem;
        }
    }
`;

export default Navbar