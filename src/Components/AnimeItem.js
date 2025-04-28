import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import LoadingSpinner from './LoadingSpinner'

function AnimeItem() {
    const {id} = useParams()

    //state
    const [anime, setAnime] = React.useState({})
    const [characters, setCharacters] = React.useState([])
    const [showMore, setShowMore] = React.useState(false)
    const [loading, setLoading] = React.useState(true)

    //destructure anime
    const {
        title, synopsis, 
        trailer,duration,aired, 
        season, images, rank, 
        score,scored_by, popularity, 
        status, rating, source } = anime

    //get anime based on id
    const getAnime = async (anime) => {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${anime}`)
            const data = await response.json()
            setAnime(data.data)
        } catch (error) {
            console.error('Error fetching anime:', error)
        } finally {
            setLoading(false)
        }
    }

    //get characters
    const getCharacters = async (anime) => {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${anime}/characters`)
            const data = await response.json()
            setCharacters(data.data)
        } catch (error) {
            console.error('Error fetching characters:', error)
        }
    }

    //initial render
    useEffect(() => {
        getAnime(id)
        getCharacters(id)
    }, [])

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <AnimeItemStyled>
            <Navbar />
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="hero-section">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {title}
                    </motion.h1>
                </div>

                <div className="content-section">
                    <motion.div 
                        className="details"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="detail">
                            <motion.div 
                                className="image"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img src={images?.jpg.large_image_url} alt={title} />
                            </motion.div>
                            <div className="anime-details">
                                <DetailItem label="Aired" value={aired?.string} />
                                <DetailItem label="Rating" value={rating} />
                                <DetailItem label="Rank" value={rank} />
                                <DetailItem label="Score" value={score} />
                                <DetailItem label="Scored By" value={scored_by} />
                                <DetailItem label="Popularity" value={popularity} />
                                <DetailItem label="Status" value={status} />
                                <DetailItem label="Source" value={source} />
                                <DetailItem label="Season" value={season} />
                                <DetailItem label="Duration" value={duration} />
                            </div>
                        </div>
                        <motion.div 
                            className="description"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <p>{showMore ? synopsis : synopsis?.substring(0, 450) + '...'}</p>
                            <motion.button 
                                onClick={() => setShowMore(!showMore)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="read-more-btn"
                            >
                                {showMore ? 'Show Less' : 'Read More'}
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {trailer?.embed_url && (
                        <motion.div 
                            className="trailer-section"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <h2>Trailer</h2>
                            <div className="trailer-con">
                                <iframe 
                                    src={trailer?.embed_url} 
                                    title={`${title} Trailer`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </motion.div>
                    )}

                    <motion.div 
                        className="characters-section"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <h2>Characters</h2>
                        <div className="characters">
                            {characters?.map((character, index) => {
                                const {role} = character
                                const {images, name, mal_id} = character.character
                                return (
                                    <Link to={`/character/${mal_id}`} key={index}>
                                        <motion.div 
                                            className="character"
                                            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <img src={images?.jpg.image_url} alt={name} />
                                            <h4>{name}</h4>
                                            <p>{role}</p>
                                        </motion.div>
                                    </Link>
                                )
                            })}
                        </div>
                    </motion.div>
                </div>
            </motion.main>
        </AnimeItemStyled>
    )
}

const DetailItem = ({ label, value }) => (
    <DetailItemStyled>
        <span className="label">{label}:</span>
        <span className="value">{value || 'N/A'}</span>
    </DetailItemStyled>
)

const DetailItemStyled = styled.p`
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0f0f0;
    
    .label {
        color: #666;
        font-weight: 500;
    }
    
    .value {
        color: #2f2f2f;
        font-weight: 600;
    }
`;

const AnimeItemStyled = styled.div`
    background-color: white;
    min-height: 100vh;
    color: #2f2f2f;

    main {
        padding-top: 80px;
    }

    .hero-section {
        text-align: center;
        padding: 4rem 2rem;
        background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
        margin-bottom: 3rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

        h1 {
            font-size: 3rem;
            font-weight: 700;
            line-height: 1.2;
            color: #2f2f2f;
        }
    }

    .content-section {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;

        .details {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            padding: 2rem;
            margin-bottom: 2rem;

            .detail {
                display: grid;
                grid-template-columns: 300px 1fr;
                gap: 2rem;
                margin-bottom: 2rem;

                @media (max-width: 768px) {
                    grid-template-columns: 1fr;
                }

                .image {
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

                    img {
                        width: 100%;
                        height: auto;
                        display: block;
                    }
                }

                .anime-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
            }

            .description {
                p {
                    line-height: 1.6;
                    color: #444;
                    margin-bottom: 1rem;
                }

                .read-more-btn {
                    background: white;
                    color: #2f2f2f;
                    border: 2px solid #2f2f2f;
                    padding: 0.5rem 1rem;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;

                    &:hover {
                        background: #f5f5f5;
                    }
                }
            }
        }

        .trailer-section {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            padding: 2rem;
            margin-bottom: 2rem;

            h2 {
                font-size: 1.8rem;
                margin-bottom: 1.5rem;
                color: #2f2f2f;
            }

            .trailer-con {
                position: relative;
                padding-bottom: 56.25%;
                height: 0;
                overflow: hidden;

                iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                }
            }
        }

        .characters-section {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            padding: 2rem;

            h2 {
                font-size: 1.8rem;
                margin-bottom: 1.5rem;
                color: #2f2f2f;
            }

            .characters {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1.5rem;

                .character {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;

                    img {
                        width: 100%;
                        height: 250px;
                        object-fit: cover;
                    }

                    h4 {
                        padding: 1rem;
                        font-size: 1.1rem;
                        color: #2f2f2f;
                    }

                    p {
                        padding: 0 1rem 1rem;
                        color: #666;
                        font-size: 0.9rem;
                    }
                }
            }
        }
    }

    .content-section {
        padding: 2rem;
        
        @media screen and (max-width: 768px) {
            padding: 1rem;
            
            .details {
                flex-direction: column;
                
                .detail {
                    flex-direction: column;
                    
                    .image {
                        width: 100%;
                        max-width: 300px;
                        margin: 0 auto;
                    }
                    
                    .anime-details {
                        width: 100%;
                        margin-top: 1rem;
                    }
                }
            }
            
            .characters {
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            }
        }
    }

    .trailer-section {
        @media screen and (max-width: 768px) {
            iframe {
                height: 200px;
            }
        }
    }
`;

export default AnimeItem;