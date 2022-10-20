import React from "react";

const CurrencyField = (props) => {
  const getPrice = (value) => {
    props.getSwapPrice(value);
  };
  return (
    <div
      name="ROW CURRENCYINPUT"
      className="bg-red-100 flex flex-row mt-4 rounded-xl p-2 justify-between"
    >
      <div name="NUMBERCONTAINER" className="mt-2">
        {props.loading ? (
          <div name="SPINNERCONTAINER" className="ml-4 mt-2">
            <props.spinner />
          </div>
        ) : (
          <input
            name="CURRENCYINPUTFIELD"
            placeholder="0.0"
            value={props.value}
            onChange={
              (e) => (props.field === "input" ? getPrice(e.target.value) : null) // setting up inputAmount
            }
            className="bg-red-100 ml-4 text-xl rounded-xl inline focus:outline-none"
          />
        )}
      </div>
      <div name="TOKENCONTAINER" className="flex flex-col mr-2">
        <span name="TOKENNAME" className="text-xl font-semibold inline">
          {props.tokenName}
        </span>
        <div name="BALANCECONTAINER" className="">
          <span className="text-sm">Balance: {props.balance?.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrencyField;
