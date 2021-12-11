import React, { useState, useEffect } from "react";
import useFetch from "./api";
import image from "../assets/not.PNG";

const MoviePage = ({
  showPage,
  setShowPage,
  showName,
  searched,
  id,
  listing,
}) => {
  const [name, setName] = useState(showName);
  let url = `https://api.tvmaze.com/shows/${id}`;
  const [show, loaded, error] = useFetch(url, searched, [url, searched]);

  const closePage = () => {
    setShowPage(false);
  };

  return showPage ? (
    <div>
      <h1>{showName}</h1>
      <button onClick={closePage}>
        <i class="fa fa-times"></i>
      </button>
      {loaded ? (
        <>
          <div>
            <img
              src={show.image ? show.image.original : image}
              alt="shows image"
              className="movie__image"
            />
          </div>
          <div>
            <ul>
              {show.genres.map((genre) => (
                <li key={genre} class="genres">
                  /{genre}
                </li>
              ))}
            </ul>
            <div
              dangerouslySetInnerHTML={{
                __html: show.summary ? show.summary : "Not Available",
              }}
            ></div>
            <div>
              <a href={show.OfficialSite}>Official Site</a>
            </div>
            <div>
              <i class="fas fa-star"></i>
              {show.rating.average ? show.rating.average : "N/A"}
            </div>
            <div>{show.language}</div>
          </div>
          <button movieid={id} moviename={showName} onClick={listing}>
            Follow
          </button>
        </>
      ) : (
        `Loading...`
      )}
    </div>
  ) : null;
};

export default MoviePage;
