import { useState, useEffect } from "react";
//Building get API for TV MAZE data

//This first custom hook is to get data from normal search and highly changing data it's the API used in the section for airing Today

let checkFetch = (response) => {
  if (!response.ok) {
    throw new Error(`${response.statusText}`);
  }
  return response;
};

export default function useFetch(url, search, dependencies) {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch(url);
        const data = await checkFetch(response).json();
        console.log(data, response);
        search === false
          ? setData(data.map((datum) => datum["_embedded"]))
          : setData(data);
        setLoaded(true);
        setError(null);
      } catch (error) {
        console.log(error);
        setError(error.message);
        setLoaded(false);
        console.log("error here: " + error);
      }
    }
    getData();
  }, [url]);
  return [data, loaded, error];
}

//this second custom hook is built to get rarely changing data for the section containing recently premiered shows using TV Maze API
export function useFuture(url, url2, dependencies) {
  const [future, setFuture] = useState([]);
  const [futureLoaded, setFutureLoaded] = useState(false);
  const [futureError, setFutureError] = useState(null);
  //Making To API calls
  //First API call is to get data from local shows, This endpoint will only return episodes that are tied to a specific country
  useEffect(() => {
    setFuture([]); //clearing the setFuture state after each refresh because I concat the data with the previous state below
    async function getData() {
      try {
        const response = await fetch(url);
        let data = await checkFetch(response).json();
        data = data.filter((datum) => {
          //ensure only movies premiered within the 12 last month is return
          let currentDate = new Date();
          let premieredDate = new Date(datum.show.premiered);
          let diff =
            currentDate.getUTCFullYear() - premieredDate.getUTCFullYear();
          return (
            (diff === 1 &&
              currentDate.getMonth() < premieredDate.getUTCMonth()) || //ensure current month is less than 12 months from the premieredDate if the difference is 1
            diff === 0 //if difference is 0 accepts(return true)
          );
        });
        setFuture((prevState) => prevState.concat(data));
      } catch (error) {
        console.log("futureError", error);
        setFutureError(error.message);
        setFutureLoaded(false);
      }
    }
    getData();
  }, [url]);
  //second gets data from Web/streaming schedule that is not tied to a specific country.
  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch(url2);
        let data = await checkFetch(response).json();
        data = data.map((datum) => datum["_embedded"]);
        let nextMovieName = ""; //name of next movie init.
        data = data.filter((datum, index) => {
          //if statement to stop if the names are matching
          if (datum.show.name === nextMovieName) {
            return false;
          }
          let currentDate = new Date();
          let premieredDate = new Date(datum.show.premiered);
          let diff =
            currentDate.getUTCFullYear() - premieredDate.getUTCFullYear();
          nextMovieName = datum.show.name;
          return (
            (diff === 1 &&
              currentDate.getMonth() < premieredDate.getUTCMonth()) ||
            diff === 0
          );
        });
        setFuture((prevState) => prevState.concat(data)); // concat the array with the one from the the first call
        setFutureLoaded(true);
      } catch (error) {
        setFutureError(error.message);
        setFutureLoaded(false);
      }
    }
    getData();
  }, [url2]);
  return [future, futureLoaded, futureError];
}

// export default useFetch;
