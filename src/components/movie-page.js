import React, { useEffect } from "react";
import useFetch from "./api";
import image from "../assets/not.PNG";
import "../styles/moviepage.css";

const MoviePage = ({
  showPage,
  setShowPage,
  showName,
  searched,
  id,
  listing,
}) => {
  // const [name, setName] = useState(showName);
  let url = `https://api.tvmaze.com/shows/${id}`;
  const [show, loaded, error] = useFetch(url, searched, [url, searched]);

  const closePage = () => {
    url = "";
    setShowPage(false);
  };

  return showPage ? (
    <div className="overlay">
      <div className="movie-page">
        <div className="movie-page__container">
          <div className="movie-page__image-container">
            {loaded ? (
              <img
                src={show.image ? show.image.original : image}
                alt="placeholder for movie" //alt value is not supposed to contain redundant info like image,picture etc
                className="movie__image"
              />
            ) : null}
          </div>
          <div className="movie-page__content">
            <div onClick={closePage} className="movie-page-close">
              <i class="fa fa-times"></i>
            </div>
            <h1 className="movie-title">{showName}</h1>
            {loaded ? (
              <>
                <div className="movie-page__lang">{show.language}</div>
                <div className="movie-page__genre">
                  <ul>
                    {show.genres.map((genre) => (
                      <li key={genre} className="genres">
                        {genre} /
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="movie-page__rating">
                  {show.rating.average ? show.rating.average : "N/A"}{" "}
                  <i class="fas fa-star"></i>
                </div>
                <hr />
                <div
                  dangerouslySetInnerHTML={{
                    __html: show.summary ? show.summary : "Not Available",
                  }}
                  className="movie-page__summary"
                ></div>

                <div className="movie-page__buttons">
                  <div className="movie-page__site">
                    <a
                      href={show.officialSite}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <button>
                        <i
                          class="fa fa-globe"
                          aria-hidden="true"
                          style={{ paddingRight: "15px" }}
                        ></i>
                        Official Site
                      </button>
                    </a>
                  </div>
                  <button
                    movieid={id}
                    moviename={showName}
                    onClick={listing}
                    className="movie-page__follow"
                  >
                    <i
                      class="fas fa-clipboard-list"
                      style={{ paddingRight: "15px" }}
                    ></i>
                    Follow
                  </button>
                </div>
              </>
            ) : (
              `Loading...`
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>{error}</div>
  );
};

export default MoviePage;
