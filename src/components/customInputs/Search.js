import React from 'react';
import './Search.css'

import SearchIcon from '@material-ui/icons/Search';


const Search = ({ searchText, setSearchText, placeholder }) => {
    return (
        <div className="search">
            <div className="search__container">
                <SearchIcon />
                <input
                    value={searchText}
                    type="text"
                    onChange={(e) => setSearchText(e.target.value)}
                    className="search__container--input"
                    placeholder={placeholder}
                />
            </div>
        </div>)
}

export default Search;
