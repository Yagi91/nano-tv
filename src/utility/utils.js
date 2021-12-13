import { DateTime } from "luxon";
import axios from "axios";

const listing = (e, setList, list) => {
  console.log("entered listx", list, setList, e);
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

export const Submit = (e, setSearched, setUrl) => {
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

export const displayPage = (e, setFocusShow, setFocusShowId, setShowPage) => {
  setFocusShow(e.currentTarget.getAttribute("moviename"));
  setFocusShowId(e.currentTarget.getAttribute("movieid"));
  setShowPage(true);
};

export default listing;
