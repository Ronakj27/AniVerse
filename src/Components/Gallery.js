import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components'
import { useGlobalContext } from '../context/global';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

function Gallery() {
    const {getAnimePictures, pictures, loading} = useGlobalContext()
    const {id} = useParams();
    const [index, setIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleImageClick = (i) => {
        setIndex(i)
    }

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    }

    React.useEffect(() => {
        getAnimePictures(id)
    }, [id])

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <GalleryStyled>
            <motion.div 
                className="back"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link to="/">
                    <i className="fas fa-arrow-left"></i>
                    Back to Home
                </Link>
            </motion.div>

            <motion.div 
                className={`big-image ${isFullscreen ? 'fullscreen' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="image-container">
                    <img 
                        src={pictures[index]?.jpg.image_url} 
                        alt="Character" 
                        onClick={toggleFullscreen}
                    />
                    <button 
                        className="fullscreen-btn"
                        onClick={toggleFullscreen}
                    >
                        <i className={`fas fa-${isFullscreen ? 'compress' : 'expand'}`}></i>
                    </button>
                </div>
            </motion.div>

            <motion.div 
                className="small-images"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                {pictures?.map((picture, i) => (
                    <motion.div 
                        className={`image-con ${i === index ? 'active' : ''}`}
                        onClick={() => handleImageClick(i)}
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img 
                            src={picture?.jpg.image_url}
                            alt="Thumbnail"
                        />
                    </motion.div>
                ))}
            </motion.div>
        </GalleryStyled>
    )
}

const GalleryStyled = styled.div`
    background-color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    position: relative;

    .back {
        position: absolute;
        top: 2rem;
        left: 2rem;
        z-index: 10;

        a {
            font-weight: 600;
            text-decoration: none;
            color: #2f2f2f;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 25px;
            background: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;

            &:hover {
                background: #f5f5f5;
                transform: translateX(-5px);
            }
        }
    }

    .big-image {
        display: inline-block;
        padding: 2rem;
        margin: 2rem 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        position: relative;
        max-width: 800px;
        width: 100%;
        transition: all 0.3s ease;

        &.fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: 0;
            padding: 2rem;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.98);
            display: flex;
            align-items: center;
            justify-content: center;

            .image-container {
                max-width: 90vw;
                max-height: 90vh;
            }
        }

        .image-container {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

            img {
                width: 100%;
                height: auto;
                display: block;
                cursor: pointer;
                transition: transform 0.3s ease;

                &:hover {
                    transform: scale(1.02);
                }
            }

            .fullscreen-btn {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;

                &:hover {
                    background: #f5f5f5;
                    transform: scale(1.1);
                }
            }
        }
    }

    .small-images {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        width: 100%;
        max-width: 800px;
        padding: 2rem;
        border-radius: 12px;
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        justify-content: center;

        .image-con {
            width: 100px;
            height: 100px;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 3px solid #e5e7eb;

            &.active {
                border-color: #2f2f2f;
                transform: scale(1.1);
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: all 0.3s ease;
            }

            &:hover {
                border-color: #2f2f2f;
                transform: scale(1.05);
            }
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;

        .back {
            top: 1rem;
            left: 1rem;
        }

        .small-images {
            @media screen and (max-width: 768px) {
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                gap: 0.5rem;
                padding: 0.5rem;
            }
        }

        .big-image {
            @media screen and (max-width: 768px) {
                padding: 1rem;
                
                &.fullscreen {
                    padding: 1rem;
                    
                    .image-container {
                        max-width: 95vw;
                        max-height: 95vh;
                    }
                }
            }
        }
    }
`;

export default Gallery;