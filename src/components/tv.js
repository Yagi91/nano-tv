import React, { useState, useEffect, useRef } from "react";
import { DateTime } from "luxon";
import axios from "axios";
import MovieCard from "./movie";
import useFetch from "./api";
import { useFuture } from "./api";
import image from "../assets/not.PNG";
import Search from "./search";
import "../styles/main.css";
import List from "./list";
import MoviePage from "./movie-page";
import CountrySelect from "./sidebar";

const defaultUrl = {
  today: `https://api.tvmaze.com/schedule/web?date=2021-12-05`,
  future: [
    "http://api.tvmaze.com/schedule",
    "https://api.tvmaze.com/schedule/web",
  ],
};

const Main = () => {
  const [searched, setSearched] = useState(false);
  const [url, setUrl] = useState(defaultUrl.today);
  const [futureUrl, setFutureUrl] = useState([
    defaultUrl.future[0],
    defaultUrl.future[1],
  ]);
  const [data, loaded, error] = useFetch(url, searched, [url, searched]);
  const [future, futureLoaded, futureError] = useFuture(
    futureUrl[0],
    futureUrl[1],
    [futureUrl]
  );
  const [list, setList] = useState([]);
  const [showPage, setShowPage] = useState(false);
  const [focusShow, setFocusShow] = useState("");
  const [focusShowId, setFocusShowId] = useState("");
  const selectRef = useRef();

  const submit = (e) => {
    setSearched(true);
    e.preventDefault();
    let query = document.getElementById("search-bar").value;
    if (query.trim().length > 0) {
      setUrl(`https://api.tvmaze.com/search/shows?q=${query}`);
    } else if (query.trim().length < 0) {
      return;
    }
    document.getElementById("search-bar").value = "";
  };

  const listing = (e) => {
    const showId = e.currentTarget.getAttribute("movieid");
    const showName = e.currentTarget.getAttribute("moviename");
    const dateString = { ...DateTime.DATETIME_SHORT };
    let nextEp;
    let showExistIndex;
    function showExist(show, index, array) {
      showExistIndex = index;
      return show.showName === showName;
    }
    if (list.length > 0 && list.some(showExist)) {
      setList((prevList) => {
        let newList = prevList.slice();
        newList.splice(showExistIndex, 1);
        return newList;
      });
      return;
    }
    axios
      .get(`https://api.tvmaze.com/shows/${showId}?embed=nextepisode`)
      .then((res) => {
        console.log(res.data);
        if (res.data._embedded) {
          console.log("data is embedded");
          nextEp = DateTime.fromISO(
            res.data["_embedded"].nextepisode.airstamp
          ).toLocaleString(dateString);
          setList((list) => {
            let newList = list.slice();
            console.log(newList);
            newList.push({
              showName: showName,
              nextEp: nextEp,
              showId: showId,
            });
            return newList;
          });
          console.log("this is the list: ", list);
        } else {
          setList((prevState) => {
            let newList = prevState.slice();
            newList.push({
              showName: showName,
              nextEp: "No Info",
              showId: showId,
            });
            return newList;
          });
          console.log(list);
        }
      })
      .catch((err) => {
        alert(`${showName} has error: ${err}`);
      });
  };

  const displayPage = (e) => {
    setFocusShow(e.currentTarget.getAttribute("moviename"));
    setFocusShowId(e.currentTarget.getAttribute("movieid"));
    setShowPage(true);
  };

  return (
    <div className="main">
      <div className="nav-bar">
        <Search submit={(e) => submit(e)} />
        <div className="nav-bar__list">My List</div>
        <div className="nav-bar__save">Save List</div>
      </div>
      <h1>Web/streaming schedule Airing Today</h1>
      <List showList={list} showName={"showName"} nextEp={"nextEp"} />
      <MoviePage
        showPage={showPage}
        setShowPage={setShowPage}
        showName={focusShow}
        id={focusShowId}
        searched={true}
        listing={(e) => listing(e)}
      />
      <div className="main-movies">
        {/* {console.log("in rendering", data)} */}
        {data.length === 0 || error != null || !loaded ? (
          <div>
            No Result Found: <strong>{error}</strong>
          </div>
        ) : (
          data.map((movie, index) =>
            movie.show.name ? (
              <MovieCard
                title={movie.show.name}
                image={movie.show.image ? movie.show.image.original : image}
                // image={movie.show.image.medium}
                rating={
                  movie.show.rating.average ? movie.show.rating.average : "N/A"
                }
                country={
                  movie.show.network ? movie.show.network.country.code : "N/A"
                }
                network={movie.show.network ? movie.show.network.name : "N/A"}
                premiered={movie.show.premiered ? movie.show.premiered : "N/A"}
                status={movie.show.status ? movie.show.status : "N/A"}
                summary={
                  movie.show.summary
                    ? movie.show.summary
                    : "No Available <strong>Summary</strong> at the Moment"
                }
                id={movie.show.id}
                listing={(e) => listing(e)}
                displayPage={(e) => displayPage(e)}
              />
            ) : (
              <div>
                <hr />
                <p>What your looking for is not available</p>
                <hr />
              </div>
            )
          )
        )}
      </div>
      <h1>Recently Premiered</h1>
      <div>
        <CountrySelect setFutureUrl={setFutureUrl} selectRef={selectRef} />
      </div>
      <div className="main-movies">
        {data.length === 0 || error != null || !futureLoaded ? (
          <div>
            No Result Found: <strong>{futureError}</strong>
          </div>
        ) : (
          future.map((movie, index) =>
            movie.show.name ? (
              <MovieCard
                title={movie.show.name}
                image={movie.show.image ? movie.show.image.original : image}
                // image={movie.show.image.medium}
                rating={
                  movie.show.rating.average ? movie.show.rating.average : "N/A"
                }
                country={
                  movie.show.network ? movie.show.network.country.code : "N/A"
                }
                network={movie.show.network ? movie.show.network.name : "N/A"}
                premiered={movie.show.premiered ? movie.show.premiered : "N/A"}
                status={movie.show.status ? movie.show.status : "N/A"}
                summary={
                  movie.show.summary
                    ? movie.show.summary
                    : "No Available <strong>Summary</strong> at the Moment"
                }
                key={movie.show.name + index}
              />
            ) : (
              <div>
                <hr />
                <p>What your looking for is not available</p>
                <hr />
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default Main;
