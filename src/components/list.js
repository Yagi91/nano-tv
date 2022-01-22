//Should contain show the user decided to follow
//Should slide from left into the page
//used Google Calendar api to sync dates
//use th download and empty functions from utils.js

//warning: do not set the state with data from another state meant to be updated in a useEffect this lags behind.

import React, { useEffect, useRef } from "react";
import "../styles/list.css";
import { handleList } from "../utility/utils";
import { DateTime } from "luxon";
import { listHandlers } from "../utility/utils";

const List = ({
  showList,
  setShowList,
  showName,
  nextEp,
  displayList,
  setDisplayList,
  datedShows, //shows with an date on their nextEp property, warning don't change this to setting the components state in here to update with a useEffect hook it lags.
}) => {
  //Reference footer buttons
  const myRef = useRef([]);
  //Set contain button cursor to pointer or not allowed bases on the showList length property
  useEffect(() => {
    if (showList.length > 0) {
      myRef.current[0].style.cursor = "pointer";
      myRef.current[3].style.cursor = "pointer";
      myRef.current[2].style.cursor = "pointer";
    }
    if (datedShows.length > 0) {
      myRef.current[1].style.cursor = "pointer";
    }
  }, [showList.length, datedShows.length]);
  //
  //Google calendar api reference found on google calendarAPI docs and "https://youtu.be/zaRUq1siZZo"
  //

  var gapi = window.gapi;
  //create google cloud project and get the API key and Client ID from the google console and enable the calendar API
  var API_KEY = "AIzaSyBX_Lz02U3RIxHLNhkDA80lDk2xehAof1I";
  var CLIENT_ID =
    "270068143928-ejucp3ok1bm2mcjckqvicisk5e531vfv.apps.googleusercontent.com";
  var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];
  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/calendar";
  // var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

  //Google Calendar API
  //
  const syncEvents = () => {
    if (!datedShows.length > 0 || !showList.length < 0) {
      return;
    }
    gapi.load("client:auth2", () => {
      // console.log("loaded client");

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
      gapi.client.load("calendar", "v3", () => console.log("loaded calendar"));
      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          var events = datedShows.map((val) => {
            return {
              summary: `${val.showName}`,
              description: "Airing Next Episode of " + val.showName,
              start: {
                dateTime: val.timeStamp,
                timeZone: DateTime.fromISO(val.timeStamp).zoneName,
              },
              end: {
                dateTime: val.timeStamp,
                timeZone: DateTime.fromISO(val.timeStamp).zoneName,
              },
              attendees: [
                { email: "bryantimah@gmail.com" },
                // { comment: "love watching this show" },
              ],
              reminders: {
                useDefault: false,
                overrides: [
                  { method: "email", minutes: 24 * 60 },
                  { method: "popup", minutes: 10 },
                ],
              },
            };
          });
          var batch = gapi.client.newBatch();

          events.map((r, j) => {
            batch.add(
              //payloads
              gapi.client.calendar.events.insert({
                calendarId: "primary",
                sendNotifications: true, //send notification to the user on the addition of an event to their calendar
                resource: events[j],
              })
            );
            return null;
          });
          batch.execute(function (event) {
            let htmlLinks = Object.keys(event).map(
              (key) => event[key].result.htmlLink
            );
            window.open(htmlLinks[0]);
          });
        });
    });
  };
  //
  //

  return (
    <div
      key={showList.length}
      className="watch-list"
      style={
        displayList
          ? {
              transform: "translate(0)",
              visibility: "visible",
              opacity: "1",
            }
          : null
      }
    >
      <div className="watch-list__header">
        <button
          onClick={() => handleList(setDisplayList)}
          className="watch-list__button-close"
          title="close"
        >
          <i className="fa fa-times"></i>
        </button>
      </div>
      <div className="list__title">Show Name//Date of Next Episode</div>
      <div className="list-container">
        {/* Unpack showList name property and date forming individual elements  */}
        {showList.length > 0 ? (
          <div className="list">
            {showList.map((show, index) => (
              <div key={show.showId + `${index}`} className="list__item">
                <span className="list__item-name">
                  <strong>{show[showName]}</strong>
                </span>{" "}
                <span className="list__item-date"> {show[nextEp]} </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="watch-list-footer">
        <button
          className="watch-list-clear footer-buttons"
          title="empty list"
          onClick={() => listHandlers.empty(showList, setShowList)}
          ref={(element) => {
            myRef.current[0] = element;
          }}
          style={{ cursor: "not-allowed" }}
        >
          <i className="far fa-trash-alt"></i>
        </button>
        <button
          className="watch-list-event footer-buttons"
          title="sync date to google calender"
          onClick={() => syncEvents()}
          ref={(element) => {
            myRef.current[1] = element;
          }}
        >
          <i className="far fa-calendar-alt"></i>
        </button>
        <button
          className="watch-list-download footer-buttons"
          title="save list to local storage"
          onClick={() => listHandlers.download(showList)}
          ref={(element) => {
            myRef.current[2] = element;
          }}
        >
          <i className="fas fa-cloud-download-alt"></i>
        </button>
        <button
          ref={(element) => {
            myRef.current[3] = element;
          }}
          className="watch-list-tweet footer-buttons"
        >
          {/* Twitter api call set JSON stringify each value of the showList array and join on a new line with a hashtag of NanoTV*/}
          <a
            // className="watch-list-twitter footer-buttons"
            //set pointer-events to none to disable button if showList is empty, warning we must set html value to a valid html link soo the method of changing it can't be use here
            style={{
              cursor: "inherit",
              pointerEvents: showList.length > 0 ? "auto" : "none",
            }}
            href={
              "https://twitter.com/intent/tweet?hashtags=NanoTV&related=D_africanknight&text=" +
              encodeURIComponent(
                '"' +
                  showList.map((val) => val.showName).join(", ") +
                  '" ' +
                  "my show list"
              )
            }
            hashtags={"100daysOfCode"}
            target="_blank"
            rel="noreferrer"
            title="Tweet Your Movie List"
          >
            <i className="fab fa-twitter"></i>
          </a>
        </button>
      </div>
    </div>
  );
};

export default List;
