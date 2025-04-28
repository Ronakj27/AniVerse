import React, { useState } from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 1rem auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 45px 12px 15px;
  border: 2px solid #e1e1e1;
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #2f2f2f;
    box-shadow: 0 0 0 3px rgba(47, 47, 47, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #2f2f2f;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const AutocompleteContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  margin-top: 5px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const SuggestionItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SearchBar = ({ onSearch, suggestions = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Search anime..."
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(searchTerm.length > 0)}
      />
      <SearchIcon>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
      </SearchIcon>
      
      {showSuggestions && suggestions.length > 0 && (
        <AutocompleteContainer>
          {suggestions.map((suggestion, index) => (
            <SuggestionItem
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </SuggestionItem>
          ))}
        </AutocompleteContainer>
      )}
    </SearchContainer>
  );
};

export default SearchBar; 