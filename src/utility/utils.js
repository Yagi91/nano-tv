import { DateTime } from "luxon";
import axios from "axios";

const listing = (e, setList, list) => {
  const showId = e.currentTarget.getAttribute("movieid"); //utilized the current target since the element is nested down in another component
  const showName = e.currentTarget.getAttribute("moviename");
  const dateString = { ...DateTime.DATETIME_SHORT }; //returns shorter date-time with slashes to easily fit in same line with the movie title
  let nextEp;
  let showExistIndex;
  var all = document.getElementsByClassName(showName);
  //ensure that clicking on the follow button twice removes that show from the list

  function showExist(show, index, array) {
    showExistIndex = index;
    return show.showName === showName;
  }
  if (list.length > 0 && list.some(showExist)) {
    for (let i = 0; i < all.length; i++) {
      all[i].style.color = "white";
    }
    // e.currentTarget.style.color = "white";
    setList((prevList) => {
      let newList = prevList.slice(); //avoid mutating state in itself
      newList.splice(showExistIndex, 1);
      return newList;
    });
    return;
  }
  for (let i = 0; i < all.length; i++) {
    all[i].style.color = "#e7ff2c";
  }
  // e.currentTarget.style.color = "#e7ff2c";

  axios
    .get(`https://api.tvmaze.com/shows/${showId}?embed=nextepisode`)
    .then((res) => {
      // console.log(res.data);
      if (res.data._embedded) {
        // console.log("data is embedded");
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
            timeStamp: res.data["_embedded"].nextepisode.airstamp,
          });
          return newList;
        });
        // console.log("this is the list:h ", list);
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
        // console.log(list);
      }
    })
    .catch((err) => {
      alert(`${showName} has error: ${err}`);
    });
};

//submit a search query
export const Submit = (e, setSearched, setUrl) => {
  setSearched(true); //this will make the data API know that it is a search query and hence the embedded property of the movie is not return
  e.preventDefault(); //prevent page reload
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

export const handleList = (setDisplayList) => {
  setDisplayList((state) => !state);
};

//list.js footer button functions
export const listHandlers = {
  //Not to run function if showList is empty
  download: (showList) => {
    if (showList.length > 0) {
      //Require file saver since (saveAs) it was not imported from the top
      var FileSaver = require("file-saver");
      var blob = new Blob(
        //Movies display on each line containing all their properties, by stringified the objects of the array
        [showList.map((val) => JSON.stringify(val)).join("\n")],
        {
          type: "text/plain;charset=utf-8",
        }
      );
      FileSaver.saveAs(blob, "list of shows.txt");
    }
  },
  empty: (showList, setShowList) => {
    if (!showList.length > 0) {
      return;
    }
    //movie card follow button colors should all return to white before emptying the list
    var all = document.getElementsByClassName("movie__follow");
    for (let i = 0; i < all.length; i++) {
      all[i].style.color = "white";
    }
    setShowList([]);
  },
};

export default listing;
