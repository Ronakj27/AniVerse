import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&display=swap');
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
        text-decoration: none;
        font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    :root {
        --primary-color:rgb(227, 0, 0);
        --primary-hover:rgb(237, 0, 0);
        --secondary-color: #1d1d1f;
        --accent-color: #f5f5f7;
        --background-light: #ffffff;
        --background-dark: #000000;
        --text-light: #1d1d1f;
        --text-dark: #f5f5f7;
        --card-bg-light: #ffffff;
        --card-bg-dark: #1d1d1f;
        --border-radius: 12px;
        --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
        --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
        --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
        --gradient-primary: linear-gradient(135deg,rgb(227, 0, 0) 0%,rgb(236, 66, 66) 100%);
    }

    body{
        background-color: var(--background-light);
        color: var(--text-light);
        font-size: 1rem;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        transition: var(--transition);

        &.dark-mode {
            background-color: var(--background-dark);
            color: var(--text-dark);
        }

        &::-webkit-scrollbar{
            width: 8px;
        }
        &::-webkit-scrollbar-thumb{
            background-color: var(--primary-color);
            border-radius: var(--border-radius);
        }
        &::-webkit-scrollbar-track{
            background-color: var(--accent-color);
        }
    }

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        
        &::after {
            content: "";
            width: 50px;
            height: 50px;
            border: 3px solid var(--primary-color);
            border-top-color: transparent;
            border-radius: 50%;
            animation: loading 1s linear infinite;
        }
    }

    @keyframes loading {
        to {
            transform: rotate(360deg);
        }
    }

    .glass-effect {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.18);
    }

    .glass-effect-dark {
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
`;

export default GlobalStyle;