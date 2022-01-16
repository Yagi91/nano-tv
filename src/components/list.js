import React from "react";
import "../styles/list.css";
import { handleList } from "../utility/utils";

const List = ({ showList, showName, nextEp, displayList, setDisplayList }) => {
  var gapi = window.gapi;
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

  const syncEvents = () => {
    gapi.load("client:auth2", () => {
      console.log("loaded client");

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
      console.log(
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
      );
      gapi.client.load("calendar", "v3", () => console.log("loaded calendar"));
      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          var event = {
            summary: "Google I/O 2015",
            location: "800 Howard St., San Francisco, CA 94103",
            description:
              "A chance to hear more about Google's developer products.",
            start: {
              dateTime: "2015-05-28T09:00:00-07:00",
              timeZone: "America/Los_Angeles",
            },
            end: {
              dateTime: "2015-05-28T17:00:00-07:00",
              timeZone: "America/Los_Angeles",
            },
            recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
            attendees: [
              { email: "lpage@example.com" },
              { email: "sbrin@example.com" },
            ],
            reminders: {
              useDefault: false,
              overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
              ],
            },
          };

          var request = gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event,
          });
          request.execute(function (event) {
            window.open(event.htmlLink);
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
          {/* &times; */}
          <i class="fa fa-times"></i>
        </button>
      </div>
      <div className="list__title">Show Name//Date of Next Episode</div>
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
      <button className="watch-list-clear" title="empty list">
        Empty
      </button>
      <button
        className="watch-list-event"
        title="sync date to google calender"
        onClick={syncEvents}
      >
        Sync to Google Calender
      </button>
      <button className="watch-list-event" title="save list to local storage">
        Download
      </button>
      <button>email</button>
      <button>share</button>
    </div>
  );
};

export default List;
