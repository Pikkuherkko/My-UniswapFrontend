import React from "react";
const PageButton = (props) => {
  return (
    <div className="px-4">
      <button
        className={
          props.isBold ? "font-bold hover:font-bold" : "hover:font-bold"
        }
      >
        {props.name}
      </button>
    </div>
  );
};

export default PageButton;
