import React from 'react';
import '../css/searchBox.css';

import SearchField from "material-ui-search-bar";

const SearchBox = ( {handleNewFilter} ) => {

    return(
        <span id="searchBoxContainer">
            <SearchField
                className='searchBox'
                placeholder="Search..."
                onChange={value => value === '' ? handleNewFilter(null) : handleNewFilter(value)}
                onCancelSearch={() => handleNewFilter(null)}
            />
        </span>
    )
}

export default SearchBox;