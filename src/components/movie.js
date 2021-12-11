import React, { useState, useEffect } from "react";
import "../styles/movie.css";

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
  key,
  id,
  displayPage,
}) => {
  const [pic, setImage] = useState("");
  useEffect(() => {
    setImage(image);
  }, [image]);
  let fontSize = title.length < 21 ? "2em" : "1.em";
  // console.log(title.length, fontSize);
  return (
    <div className="movie-card" key={key}>
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
        <div
          className="movie__follow"
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

export default MovieCard;
