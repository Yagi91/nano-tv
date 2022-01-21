//integrates the main-page component, listing component, movie component,sort and search components.

import React, { useState, useRef, useEffect } from "react";
import MovieCard from "./movie";
import useFetch from "./api";
import { useFuture } from "./api";
import image from "../assets/not.PNG";
import Search from "./search";
import "../styles/main.css";
import List from "./list";
import MoviePage from "./movie-page";
import CountrySelect from "./sidebar";
import { DateTime } from "luxon";
import listing, {
  Submit,
  displayPage,
  handleList,
  listHandlers,
} from "../utility/utils";
const currentDate = DateTime.now().toISODate();

const defaultUrl = {
  today: `https://api.tvmaze.com/schedule/web?date=${currentDate}`, //endpoint shows for today dynamically updated
  future: [
    //TV maze endpoint of both the local-schedule and web-schedule
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
  //the focus show are used to focus on a single shows the main page.
  const [focusShow, setFocusShow] = useState("");
  const [focusShowId, setFocusShowId] = useState("");
  const selectRef = useRef();
  const [shrink, setShrink] = useState(false);
  const [displayList, setDisplayList] = useState(false);

  //control the header shrinking animation

  useEffect(() => {
    const handler = () => {
      // Check and update component here.
      setShrink((shrink) => {
        if (
          !shrink &&
          (document.body.scrollTop > 20 ||
            document.documentElement.scrollTop > 20)
        ) {
          return true;
        }
        if (
          shrink &&
          document.body.scrollTop < 4 &&
          document.documentElement.scrollTop < 4
        ) {
          return false;
        }
        return shrink;
      });
    };

    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // useEffect(() => {
  //   const resizeHeaderOnScroll = () => {
  //     const distanceY =
  //       window.pageYOffset || document.documentElement.scrollTop;
  //     const shrinkOn = 200;
  //     if (distanceY > shrinkOn) {
  //       setShrink(true);
  //     } else {
  //       setShrink(false);
  //     }
  //   };
  //   window.addEventListener("scroll", resizeHeaderOnScroll);
  //   return () => window.removeEventListener("scroll", resizeHeaderOnScroll);

  ///normally commented out
  // window.onscroll = () => {
  //   if (window.pageYOffset > 40) {
  //     setShrink(true);
  //   } else {
  //     setShrink(false);
  //   }
  // };
  ///
  // }, []);

  //movie page modal disable background-scrolling when active(true)
  // useEffect(() => {
  //   const body = document.querySelector("body");
  //   body.style.overflow = showPage ? "hidden" : "auto";
  // }, [showPage]);

  return (
    <div className="main">
      <div className={`nav-bar ${shrink ? "shrink" : ""}`}>
        <div className="nav-bar__logo" to="/">
          Nano
          <br />
          TV <i class="fas fa-television" style={{ color: "#fff" }}></i>
        </div>
        <div className="navbar-bar__content">
          <Search submit={(e) => Submit(e, setSearched, setUrl)} />
          <div
            className="nav-bar__list"
            onClick={() => handleList(setDisplayList)}
          >
            Following{" "}
            <i class="fas fa-clipboard-list" style={{ color: "#e7ff2c" }}></i>
          </div>
          <div
            className="nav-bar__save"
            onClick={() => listHandlers.download(list)}
          >
            Save List{" "}
            <i
              class="fas fa-cloud-download-alt"
              style={{ color: "#e7ff2c" }}
            ></i>
          </div>
        </div>
      </div>
      <h1 className="section-title">Web/streaming schedule Airing Today</h1>
      <List
        showList={list}
        setShowList={setList}
        showName={"showName"}
        nextEp={"nextEp"}
        displayList={displayList}
        setDisplayList={setDisplayList}
        datedShows={list.filter((entry) => entry.nextEp !== "No Info")}
      />
      <MoviePage
        showPage={showPage}
        setShowPage={setShowPage}
        showName={focusShow}
        id={focusShowId}
        searched={true}
        listing={(e) => listing(e, setList, list)}
      />
      <div className="main-movies">
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
                  movie.show.rating.average ? movie.show.rating.average : "--"
                }
                country={
                  movie.show.network ? movie.show.network.country.code : "--"
                }
                network={movie.show.network ? movie.show.network.name : "--"}
                premiered={movie.show.premiered ? movie.show.premiered : "--"}
                status={movie.show.status ? movie.show.status : "--"}
                summary={
                  movie.show.summary
                    ? movie.show.summary
                    : "No Available <strong>Summary</strong> at the Moment"
                }
                id={movie.show.id}
                listing={(e) => listing(e, setList, list)}
                displayPage={(e) =>
                  displayPage(e, setFocusShow, setFocusShowId, setShowPage)
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
        )}
      </div>
      <div className="premiered-header">
        <h1 className="section-title">Recently Premiered</h1>
        <CountrySelect setFutureUrl={setFutureUrl} selectRef={selectRef} />
      </div>
      <div className="premiered-movies">
        {data.length === 0 || error != null || !futureLoaded ? (
          <div>
            No Result Found: <strong>{futureError}</strong>
          </div>
        ) : (
          future.map((movie, index, array) => {
            return movie.show.name ? (
              <MovieCard
                title={movie.show.name}
                image={movie.show.image ? movie.show.image.original : image}
                // image={movie.show.image.medium}
                rating={
                  movie.show.rating.average ? movie.show.rating.average : "--"
                }
                country={
                  movie.show.network ? movie.show.network.country.code : "--"
                }
                network={movie.show.network ? movie.show.network.name : "--"}
                premiered={movie.show.premiered ? movie.show.premiered : "--"}
                status={movie.show.status ? movie.show.status : "--"}
                summary={
                  movie.show.summary
                    ? movie.show.summary
                    : "No Available <strong>Summary</strong> at the Moment"
                }
                key={movie.show.name + index}
                // style={subStyle}
                // style={{ width: "4vw", float: "left", overflow: "hidden" }}
              />
            ) : (
              <div>
                <hr />
                <p>What your looking for is not available</p>
                <hr />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Main;
