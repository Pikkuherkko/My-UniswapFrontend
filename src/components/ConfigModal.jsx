import React from "react";

const ConfigModal = (props) => {
  const onClickHandler = () => {
    props.onClose();
  };
  return (
    <div name="MODALY" className="fixed flex justify-center text-white top-20">
      <div
        name="MODAL-CONTENT"
        onClick={(e) => e.stopPropagation()}
        className="bg-black rounded-2xl p-4 w-full"
      >
        <div name="MODAL-BODY" className="">
          <div className="flex flex-row justify-between">
            <h4 name="TITLEHEADER">Transaction Settings</h4>
            <button onClick={onClickHandler}>X</button>
          </div>

          <div name="ROW" className="">
            <label name="LABELFIELD" className="text-gray-400">
              Slippage Tolerence
            </label>
          </div>
          <div name="ROW" className="flex flex-row my-2">
            <div name="FIELDCONTAINER" className="">
              <input
                name="INPUT"
                placeholder="1.0%"
                value={props.slippageAmount}
                onChange={(e) => props.setSlippageAmount(e.target.value)}
                className="rounded-2xl pl-2 text-black"
              />
            </div>
            <div className="ml-2" name="INPUTFIELDUNITSCONTAINER">
              <span>%</span>
            </div>
          </div>
          <div name="ROW">
            <label name="LABELFIELD" className="text-gray-400">
              Transaction Deadline
            </label>
          </div>
          <div name="ROW" className="flex flex-row my-2">
            <div name="FIELDCONTAINER" className="colmd9">
              <input
                name="INPUT"
                placeholder="10"
                value={props.deadlineMinutes}
                onChange={(e) => props.setDeadlineMinutes(e.target.value)}
                className="rounded-2xl pl-2 text-black"
              />
            </div>
            <div className="ml-2" name="INPUTFIELDUNITSCONTAINER">
              <span className="text-gray-400">minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;
