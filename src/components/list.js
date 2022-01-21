import React, { useEffect, useRef } from "react";
import "../styles/list.css";
import { handleList } from "../utility/utils";
import { DateTime } from "luxon";
import { listHandlers } from "../utility/utils";
// import { download, empty } from "../utility/utils";

const List = ({
  showList,
  setShowList,
  showName,
  nextEp,
  displayList,
  setDisplayList,
  datedShows,
}) => {
  const myRef = useRef([]);
  console.log(myRef);
  useEffect(() => {
    if (showList.length > 0) {
      myRef.current[0].style.cursor = "pointer";
      myRef.current[3].style.cursor = "pointer";
      myRef.current[2].style.cursor = "pointer";
    }
    if (datedShows.length > 0) {
      myRef.current[1].style.cursor = "pointer";
    }
  }, [[showList]]);

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
      console.log("loaded client");

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
            console.log(val.timeStamp);
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
          <i class="fa fa-times"></i>
        </button>
      </div>
      <div className="list__title">Show Name//Date of Next Episode</div>
      <div className="list-container">
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
          <i class="far fa-trash-alt"></i>
        </button>
        <button
          className="watch-list-event footer-buttons"
          title="sync date to google calender"
          onClick={() => syncEvents()}
          ref={(element) => {
            myRef.current[1] = element;
          }}
        >
          <i class="far fa-calendar-alt"></i>
        </button>
        <button
          className="watch-list-download footer-buttons"
          title="save list to local storage"
          // onClick={() => listHandlers.download(showList)}
          ref={(element) => {
            myRef.current[2] = element;
          }}
        >
          <i class="fas fa-cloud-download-alt"></i>
        </button>
        <button
          ref={(element) => {
            myRef.current[3] = element;
          }}
          className="watch-list-tweet footer-buttons"
        >
          <a
            // className="watch-list-twitter footer-buttons"
            style={{ cursor: "inherit" }}
            href={
              showList.length > 0
                ? "https://twitter.com/intent/tweet?hashtags=NanoTV&related=D_africanknight&text=" +
                  encodeURIComponent(
                    '"' +
                      showList.map((val) => val.showName).join(", ") +
                      '" ' +
                      "my show list"
                  )
                : null
            }
            hashtags={"100daysOfCode"}
            target="_blank"
            rel="noreferrer"
            title="Tweet Your Movie List"
          >
            <i class="fab fa-twitter"></i>
          </a>
        </button>
      </div>
    </div>
  );
};

export default List;
