import React from "react";

const List = ({ showList, showName, nextEp }) => {
  return (
    <div key={showList.length}>
      <div>Show Name//Date of Next Episode</div>
      {showList.length > 0 ? (
        <ul>
          {showList.map((show, index) => (
            <li key={show.showId + `${index}`}>
              <strong>{show[showName]}</strong> {show[nextEp]}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default List;
