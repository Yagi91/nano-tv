import { DateTime } from "luxon";
import axios from "axios";

const listing = (e, setList, list) => {
  const showId = e.currentTarget.getAttribute("movieid"); //utilized the current target since the element is nested down in another component
  const showName = e.currentTarget.getAttribute("moviename");
  const dateString = { ...DateTime.DATETIME_SHORT }; //returns shorter date-time with slashes to easily fit in same line with the movie title
  let nextEp;
  let showExistIndex;
  //ensure that clicking on the follow button twice removes that show from the list
  function showExist(show, index, array) {
    showExistIndex = index;
    return show.showName === showName;
  }
  if (list.length > 0 && list.some(showExist)) {
    setList((prevList) => {
      let newList = prevList.slice(); //avoid mutating state in itself
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
          //returns date object from the ISO string found as a Key-value of the nextExp in the Embedded property of the movie
          res.data["_embedded"].nextepisode.airstamp
        ).toLocaleString(dateString);
        setList((list) => {
          let newList = list.slice(); //avoid mutating state in itself
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

//submit a search query
export const Submit = (e, setSearched, setUrl) => {
  setSearched(true); //this will make the data API know that it is a search query and hence the embedded property of the movie is not return
  e.preventDefault();
  let query = document.getElementById("search-bar").value;
  if (query.trim().length > 0) {
    //trim the empty spaces in from and behind the search term
    setUrl(`https://api.tvmaze.com/search/shows?q=${query}`);
  } else if (query.trim().length < 0) {
    return;
  }
  document.getElementById("search-bar").value = "";
};

//displays a single page containing the full details of that particular movie
export const displayPage = (e, setFocusShow, setFocusShowId, setShowPage) => {
  setFocusShow(e.currentTarget.getAttribute("moviename"));
  setFocusShowId(e.currentTarget.getAttribute("movieid"));
  setShowPage(true); //the page can be visible now
};

export default listing;
