import React, { useState } from 'react'
import { useGlobalContext } from '../context/global'
import Popular from './Popular'
import styled from 'styled-components'
import Upcoming from './Upcoming'
import Airing from './Airing'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import SearchBar from './SearchBar'
import LoadingSpinner from './LoadingSpinner'

function Homepage() {
    const {
        handleSubmit, 
        search, 
        searchAnime,
        handleChange,
        getUpcomingAnime,
        getAiringAnime,
        getPopularAnime,
        loading,
        popularAnime
    } = useGlobalContext()

    const [rendered, setRendered] = useState('popular')

    const switchComponent = () => {
        switch(rendered){
            case 'popular':
                return <Popular rendered={rendered} />
            case 'airing':
                return <Airing rendered={rendered} />
            case 'upcoming':
                return <Upcoming rendered={rendered} />
            default:
                return <Popular rendered={rendered} />
        }
    }

    // Generate suggestions based on popular anime titles
    const suggestions = popularAnime
        ? popularAnime.slice(0, 5).map(anime => anime.title)
        : [];

    const handleSearch = (value) => {
        if (handleChange) {
            handleChange({ target: { value } });
        }
    };

    return (
        <HomepageStyled>
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
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Discover Your Next Favorite Anime
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Explore the world of anime with AniVerse. Find popular series, currently airing shows, and upcoming releases.
                    </motion.p>
                </div>

                <div className="content-section">
                    

                    <motion.div 
                        className="filter-buttons"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <FilterButton 
                            active={rendered === 'popular'}
                            onClick={() => setRendered('popular')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Popular
                        </FilterButton>
                        <FilterButton 
                            active={rendered === 'airing'}
                            onClick={() => {
                                setRendered('airing')
                                getAiringAnime()
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Airing
                        </FilterButton>
                        <FilterButton 
                            active={rendered === 'upcoming'}
                            onClick={() => {
                                setRendered('upcoming')
                                getUpcomingAnime()
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Upcoming
                        </FilterButton>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="content-container"
                    >
                        {loading ? <LoadingSpinner /> : switchComponent()}
                    </motion.div>
                </div>
            </motion.main>
        </HomepageStyled>
    )
}

const FilterButton = styled(motion.button)`
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 25px;
    background: ${props => props.active ? '#2f2f2f' : 'white'};
    color: ${props => props.active ? 'white' : '#2f2f2f'};
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 2px solid #2f2f2f;
    
    &:hover {
        background: ${props => props.active ? '#2f2f2f' : '#f5f5f5'};
    }

    @media screen and (max-width: 768px) {
        padding: 0.6rem 1.2rem;
        font-size: 0.9rem;
    }
`;

const HomepageStyled = styled.div`
    background: white;
    min-height: 100vh;
    color: #333;

    main {
        padding-top: 80px;
    }

    .hero-section {
        text-align: center;
        padding: 6rem 2rem;
        background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
        margin-bottom: 3rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

        h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            line-height: 1.2;
            color: #2f2f2f;
        }

        p {
            font-size: 1.3rem;
            max-width: 700px;
            margin: 0 auto;
            color: #666;
        }
    }

    .content-section {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;

        .search-container {
            margin-bottom: 2rem;
        }

        .filter-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .content-container {
            min-height: 400px;
            position: relative;
        }
    }

    @media screen and (max-width: 768px) {
        padding: 4rem 1rem;
        
        h1 {
            font-size: 2.5rem;
        }
        
        p {
            font-size: 1.1rem;
        }
    }

    @media screen and (max-width: 480px) {
        padding: 3rem 1rem;
        
        h1 {
            font-size: 2rem;
        }
        
        p {
            font-size: 1rem;
        }
    }
`;

export default Homepage;