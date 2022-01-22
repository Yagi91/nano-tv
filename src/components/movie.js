import React, { useState, useEffect } from "react";
import "../styles/movie.css";
//contains all main information of any movie component on the pag with it's basic information with hover effect for summary
//Card holds little important info about any movie
//ideal width - 300px

const MovieCard = ({
  title,
  image,
  rating,
  country,
  network,
  premiered,
  status,
  summary,
  listing,
  // key,
  id,
  displayPage,
  style,
}) => {
  const [pic, setImage] = useState("");
  useEffect(() => {
    setImage(image);
  }, [image]); //placing the default image on component mounted
  let fontSize = title.length < 21 ? "2em" : "1.em";
  return (
    <div
      className="movie-card"
      // key={key}
      style={{ ...style }}
    >
      <div
        className="movie-card__container-image"
        onClick={displayPage}
        movieid={id}
        moviename={title}
      >
        <div
          className="movie__summary"
          dangerouslySetInnerHTML={{ __html: summary }}
        ></div>
        <img src={pic} alt="" className="movie__image" />
      </div>
      <div className="movie__info ">
        <h3 className="movie__title" style={{ fontSize: `${fontSize}` }}>
          {title}
        </h3>
        <div className="movie__rating bottom right">
          <div>{rating}</div>
          <div className="movie__info-type">Rating</div>
        </div>
        <div className="movie__country bottom right">
          <div>{country}</div>
          <div className="movie__info-type">Country</div>
        </div>
        <div className="movie__network bottom">
          <div>{network}</div>
          <div className="movie__info-type">Network</div>
        </div>
        <div className="movie__premiered right">
          <div>{premiered}</div>
          <div className="movie__info-type">Premiered</div>
        </div>
        <div className="movie__status right">
          <div>{status}</div>
          <div className="movie__info-type">Status</div>
        </div>
        {/* Data attributes passed down to the listing function to distinguish each movie card */}
        <div
          className={`movie__follow ${title}`}
          onClick={listing}
          movieid={id}
          moviename={title}
        >
          <div className="movie__info-type">
            <i className="fas fa-eye"></i>
            <div>Follow</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// style={{ color: `${list.some(movie=>{Object.values(movie).includes(title)})}` }}

export default MovieCard;
