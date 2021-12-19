import React from "react";
import "../styles/list.css";
import { handleList } from "../utility/utils";

const List = ({ showList, showName, nextEp, displayList, setDisplayList }) => {
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
    </div>
  );
};

export default List;
