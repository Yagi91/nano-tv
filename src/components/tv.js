import React, { useState, useEffect } from "react";
import MovieCard from "./movie";
import useFetch from "./api";
import image from "../assets/not.PNG";
import Search from "./search";
import "../styles/main.css";

const Main = () => {
  const [url, setUrl] = useState(`https://api.tvmaze.com/search/shows?q=girls`);
  const [data, isLoaded] = useFetch(url, [url]);

  const submit = (e) => {
    e.preventDefault();
    let query = document.getElementById("search-bar").value;
    if (query.trim().length > 0) {
      setUrl(`https://api.tvmaze.com/search/shows?q=${query}`);
    }
    document.getElementById("search-bar").value = "";
  };

  return (
    <div className="main">
      <div className="nav-bar">
        <Search submit={(e) => submit(e)} />
        <div className="nav-bar__list">My List</div>
        <div className="nav-bar__save">Save List</div>
      </div>
      <div className="main-movies">
        {console.log("in rendering", data)}
        {isLoaded
          ? data.map((movie, index) =>
              movie.show.name ? (
                <MovieCard
                  title={movie.show.name}
                  image={movie.show.image ? movie.show.image.original : image}
                  // image={movie.show.image.medium}
                  rating={
                    movie.show.rating.average
                      ? movie.show.rating.average
                      : "N/A"
                  }
                  country={
                    movie.show.network ? movie.show.network.country.code : "N/A"
                  }
                  network={movie.show.network ? movie.show.network.name : "N/A"}
                  premiered={
                    movie.show.premiered ? movie.show.premiered : "N/A"
                  }
                  status={movie.show.status ? movie.show.status : "N/A"}
                  summary={
                    movie.show.summary
                      ? movie.show.summary
                      : "No Available <strong>Summary</strong> at the Moment"
                  }
                />
              ) : (
                <div>
                  <hr />
                  <p>What your looking for is not available</p>
                  <hr />
                </div>
              )
            )
          : ""}
      </div>
    </div>
  );
};

export default Main;
