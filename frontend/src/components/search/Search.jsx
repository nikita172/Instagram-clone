import React from 'react'
import "./search.css"
const Search = () => {
  let recentNames = false;
  return (
    <div className='searchbarContainer'>
      <h4 className="searchTag">
        Search
      </h4>
      <div className="searchInputContainer">
        <input placeholder='Search' className='searchInput' />
        <span className='cancelSearchButton'>X</span>
      </div>
      <div className="borderBottom"></div>
      <div className="recentSearches">
        <h3 className='recentTitle'>Recent</h3>
        {
          recentNames ?
            <li>
              <ul></ul>
            </li>
            :
            <span className='noRecentFound'>No recent searches.</span>
        }
      </div>
    </div>
  )
}

export default Search