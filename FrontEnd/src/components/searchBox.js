import React from 'react';
import '../css/searchBox.css';

import SearchField from "material-ui-search-bar";

const SearchBox = ( {setNewFilter} ) => {

    return(
        <div id="searchBoxContainer">
            <SearchField
                className='searchBox'
                placeholder="ID"
                // searchIcon=""
                style={{backgroundColor: "#5C5C5C"}}
                onChange={value => value === '' ? setNewFilter("ID", null) : setNewFilter("ID", value)}
                onCancelSearch={() => setNewFilter("ID", null)}
            />
            <SearchField
                className='searchBox'
                placeholder="Date"
                // searchIcon=""
                style={{backgroundColor: 1 == 2 ? "black" : "#5C5C5C"}}
                onChange={value => value === '' ? setNewFilter("Date", null) : setNewFilter("Date", value)}
                onCancelSearch={() => setNewFilter("Date", null)}
            />
            <SearchField
                className='searchBox'
                placeholder="Worker"
                // searchIcon=""
                style={{backgroundColor: "#5C5C5C"}}
                onChange={value => value === '' ? setNewFilter("Worker", null) : setNewFilter("Worker", value)}
                onCancelSearch={() => setNewFilter("Worker", null)}
            />
            <SearchField
                className='searchBox'
                placeholder="Customer"
                // searchIcon=""
                style={{backgroundColor: "#5C5C5C"}}
                onChange={value => value === '' ? setNewFilter("Customer", null) : setNewFilter("Customer", value)}
                onCancelSearch={() => setNewFilter("Customer", null)}
            />
            <br/>
        </div>
    )
}

export default SearchBox;