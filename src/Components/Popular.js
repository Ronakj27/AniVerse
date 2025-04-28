import React, { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../context/global'
import styled from 'styled-components'
import Sidebar from './Sidebar'
import { motion } from 'framer-motion'

function Popular({rendered}) {
    const {popularAnime, isSearch, searchResults, currentPage, setPage, itemsPerPage} = useGlobalContext()
    const [visibleItems, setVisibleItems] = useState(12)
    const observer = useRef()
    const lastItemRef = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setVisibleItems(prev => Math.min(prev + 12, (isSearch ? searchResults : popularAnime)?.length || 0))
            }
        })
        if (node) observer.current.observe(node)
    }, [isSearch, searchResults, popularAnime])

    const conditionalRender = () => {
        const data = !isSearch && rendered === 'popular' ? popularAnime : searchResults;
        return data?.slice(0, visibleItems).map((anime, index) => {
            const isLastItem = index === visibleItems - 1;
            return (
                <motion.div
                    key={anime.mal_id}
                    ref={isLastItem ? lastItemRef : null}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link to={`/anime/${anime.mal_id}`}>
                        <div className="anime-card">
                            <img 
                                src={anime.images.jpg.small_image_url} 
                                data-src={anime.images.jpg.large_image_url}
                                alt={anime.title}
                                loading="lazy"
                                onLoad={(e) => {
                                    const img = e.target;
                                    if (img.dataset.src) {
                                        img.src = img.dataset.src;
                                    }
                                }}
                            />
                            <div className="anime-info">
                                <h3>{anime.title}</h3>
                                <p>Score: {anime.score || 'N/A'}</p>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            )
        })
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setVisibleItems(12);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <PopularStyled>
            <div className="popular-anime">
                {conditionalRender()}
                <div className="pagination">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage}</span>
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!popularAnime?.length || popularAnime.length < itemsPerPage}
                    >
                        Next
                    </button>
                </div>
            </div>
            <Sidebar />
        </PopularStyled>
    )
}

const PopularStyled = styled.div`
    display: flex;
    .popular-anime{
        margin-top: 2rem;
        padding-top: 2rem;
        padding-bottom: 2rem;
        padding-left: 5rem;
        padding-right: 0;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 2rem;
        background-color: #fff;
        border-top: 5px solid #e5e7eb;

        .anime-card {
            height: 500px;
            border-radius: 7px;
            border: 5px solid #e5e7eb;
            overflow: hidden;
            position: relative;
            transition: transform 0.3s ease;

            &:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 5px;
                transition: filter 0.3s ease;
            }

            .anime-info {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 1rem;
                background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
                color: white;
                transform: translateY(100%);
                transition: transform 0.3s ease;

                h3 {
                    margin: 0;
                    font-size: 1.2rem;
                    margin-bottom: 0.5rem;
                }

                p {
                    margin: 0;
                    font-size: 0.9rem;
                    opacity: 0.8;
                }
            }

            &:hover .anime-info {
                transform: translateY(0);
            }
        }

        .pagination {
            grid-column: 1 / -1;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-top: 2rem;
            padding: 1rem;

            button {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 5px;
                background: #007bff;
                color: white;
                cursor: pointer;
                transition: background 0.3s ease;

                &:hover:not(:disabled) {
                    background: #0056b3;
                }

                &:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
            }

            span {
                font-size: 1.1rem;
                color: #333;
            }
        }
    }

    @media screen and (max-width: 768px) {
        .popular-anime {
            padding-left: 1rem;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

            .anime-card {
                height: 400px;
            }
        }
    }
`

export default Popular