import React, { useState, useEffect } from "react";
import "../styles/search.css";

const Search = ({ submit }) => {
  return (
    <form className="search" id="search">
      <input
        type="search"
        placeholder="Search"
        id="search-bar"
        className="search-bar"
        spellCheck="true"
        name="q"
        aria-label="Search through site content"
        // autoFocus
        form="search"
        enterKeyHint
      />
      <button
        type="submit"
        className="search-button"
        id="search-button"
        onClick={submit}
      >
        Search
      </button>
    </form>
  );
};

export default Search;
