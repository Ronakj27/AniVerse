import React, {createContext, useContext, useReducer, useCallback, useRef} from "react";

const GlobalContext = createContext();

const baseUrl = "https://api.jikan.moe/v4";

//actions
const LOADING = "LOADING";
const SEARCH = "SEARCH";
const GET_POPULAR_ANIME = "GET_POPULAR_ANIME";
const GET_UPCOMING_ANIME = "GET_UPCOMING_ANIME";
const GET_AIRING_ANIME = "GET_AIRING_ANIME";
const GET_PICTURES = "GET_PICTURES";
const SET_PAGE = "SET_PAGE";
const CLEAR_CACHE = "CLEAR_CACHE";

//reducer
const reducer = (state, action) => {
    switch(action.type){
        case LOADING:
            return {...state, loading: true}
        case GET_POPULAR_ANIME:
            return {...state, popularAnime: action.payload, loading: false, isSearch: false}
        case SEARCH:
            return {...state, searchResults: action.payload, loading: false, isSearch: true}
        case GET_UPCOMING_ANIME:
            return {...state, upcomingAnime: action.payload, loading: false, isSearch: false}
        case GET_AIRING_ANIME:
            return {...state, airingAnime: action.payload, loading: false, isSearch: false}
        case GET_PICTURES:
            return {...state, pictures: action.payload, loading: false}
        case SET_PAGE:
            return {...state, currentPage: action.payload}
        case CLEAR_CACHE:
            return {
                ...state,
                popularAnime: [],
                upcomingAnime: [],
                airingAnime: [],
                pictures: [],
                searchResults: [],
                isSearch: false
            }
        default:
            return state;
    }
}

export const GlobalContextProvider = ({children}) => {
    const intialState = {
        popularAnime: [],
        upcomingAnime: [],
        airingAnime: [],
        pictures: [],
        isSearch: false,
        searchResults: [],
        loading: false,
        currentPage: 1,
        itemsPerPage: 8
    }

    const [state, dispatch] = useReducer(reducer, intialState);
    const [search, setSearch] = React.useState('');
    const cache = useRef(new Map());
    const abortController = useRef(new AbortController());
    const cacheTimeout = useRef(null);

    // Clear cache after 5 minutes of inactivity
    const scheduleCacheClear = useCallback(() => {
        if (cacheTimeout.current) {
            clearTimeout(cacheTimeout.current);
        }
        cacheTimeout.current = setTimeout(() => {
            clearCache();
        }, 5 * 60 * 1000); // 5 minutes
    }, []);

    // Clear cache and abort ongoing requests
    const clearCache = useCallback(() => {
        abortController.current.abort();
        abortController.current = new AbortController();
        dispatch({type: CLEAR_CACHE});
        cache.current.clear();
    }, []);

    //handle change
    const handleChange = useCallback((value) => {
        setSearch(value);
        if(value === ''){
            clearCache();
        } else {
            searchAnime(value);
        }
    }, [clearCache]);

    //handle submit
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if(search){
            searchAnime(search);
        }else{
            alert('Please enter a search term')
        }
    }, [search]);

    // Generic fetch function with caching and memory optimization
    const fetchWithCache = useCallback(async (url, type) => {
        const cacheKey = `${url}-${state.currentPage}`;
        
        // Don't cache search results to ensure fresh results
        if (type !== 'search results' && cache.current.has(cacheKey)) {
            scheduleCacheClear();
            return cache.current.get(cacheKey);
        }

        try {
            const response = await fetch(url, {
                signal: abortController.current.signal
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const result = data.data;
            
            // Only cache non-search results
            if (type !== 'search results' && JSON.stringify(result).length < 100000) {
                cache.current.set(cacheKey, result);
                scheduleCacheClear();
            }
            return result;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
                return [];
            }
            console.error(`Error fetching ${type}:`, error);
            return [];
        }
    }, [state.currentPage, scheduleCacheClear]);

    // Optimized fetch functions with memory limits
    const getPopularAnime = useCallback(async () => {
        dispatch({type: LOADING});
        const url = `${baseUrl}/top/anime?filter=bypopularity&page=${state.currentPage}&limit=${state.itemsPerPage}`;
        const data = await fetchWithCache(url, 'popular anime');
        dispatch({type: GET_POPULAR_ANIME, payload: data});
    }, [state.currentPage, state.itemsPerPage, fetchWithCache]);

    const getUpcomingAnime = useCallback(async () => {
        dispatch({type: LOADING});
        const url = `${baseUrl}/top/anime?filter=upcoming&page=${state.currentPage}&limit=${state.itemsPerPage}`;
        const data = await fetchWithCache(url, 'upcoming anime');
        dispatch({type: GET_UPCOMING_ANIME, payload: data});
    }, [state.currentPage, state.itemsPerPage, fetchWithCache]);

    const getAiringAnime = useCallback(async () => {
        dispatch({type: LOADING});
        const url = `${baseUrl}/top/anime?filter=airing&page=${state.currentPage}&limit=${state.itemsPerPage}`;
        const data = await fetchWithCache(url, 'airing anime');
        dispatch({type: GET_AIRING_ANIME, payload: data});
    }, [state.currentPage, state.itemsPerPage, fetchWithCache]);

    const searchAnime = useCallback(async (anime) => {
        dispatch({type: LOADING});
        try {
            // Clear previous search results
            dispatch({type: CLEAR_CACHE});
            
            // Use better search parameters with multiple filters
            const url = `${baseUrl}/anime?q=${encodeURIComponent(anime)}&order_by=score&sort=desc&sfw&page=${state.currentPage}&limit=${state.itemsPerPage}&min_score=5`;
            const data = await fetchWithCache(url, 'search results');
            
            // Enhanced filtering
            const filteredData = data.filter(item => 
                item.images?.jpg?.image_url && 
                item.score > 0 &&
                item.title && 
                item.title.toLowerCase().includes(anime.toLowerCase())
            );
            
            if (filteredData.length === 0) {
                // Try a more lenient search if no results found
                const lenientUrl = `${baseUrl}/anime?q=${encodeURIComponent(anime)}&order_by=popularity&sort=desc&sfw&page=${state.currentPage}&limit=${state.itemsPerPage}`;
                const lenientData = await fetchWithCache(lenientUrl, 'search results');
                const lenientFilteredData = lenientData.filter(item => 
                    item.images?.jpg?.image_url && 
                    item.title
                );
                dispatch({type: SEARCH, payload: lenientFilteredData});
            } else {
                dispatch({type: SEARCH, payload: filteredData});
            }
        } catch (error) {
            console.error('Search error:', error);
            dispatch({type: SEARCH, payload: []});
        }
    }, [state.currentPage, state.itemsPerPage, fetchWithCache]);

    const getAnimePictures = useCallback(async (id) => {
        dispatch({type: LOADING});
        const url = `${baseUrl}/characters/${id}/pictures?limit=5`;
        const data = await fetchWithCache(url, 'pictures');
        dispatch({type: GET_PICTURES, payload: data});
    }, [fetchWithCache]);

    const setPage = useCallback((page) => {
        dispatch({type: SET_PAGE, payload: page});
    }, []);

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            clearCache();
            if (cacheTimeout.current) {
                clearTimeout(cacheTimeout.current);
            }
        };
    }, [clearCache]);

    //initial render
    React.useEffect(() => {
        getPopularAnime();
    }, [getPopularAnime]);

    return(
        <GlobalContext.Provider value={{
            ...state,
            handleChange,
            handleSubmit,
            searchAnime,
            search,
            getPopularAnime,
            getUpcomingAnime,
            getAiringAnime,
            getAnimePictures,
            setPage
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}