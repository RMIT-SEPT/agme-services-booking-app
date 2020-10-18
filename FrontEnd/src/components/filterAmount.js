import React from 'react';
import '../css/filterAmount.css';

const FilterAmount = ( {maxAmount, setShowAmount} ) => {

    return(
        <span id="filterAmountContainer">
            <span className="showXAmount" onClick={() => setShowAmount(maxAmount)}>
                Show All
            </span>
            <span className="showXAmount" onClick={() => setShowAmount(10)}>
                Show 10
            </span>
            <span className="showXAmount" onClick={() => setShowAmount(5)}>
                Show 5
            </span>
        </span>
    )
}

export default FilterAmount;