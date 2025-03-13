import React from "react";

const InfoCard = ({ infoIcon, infoTitle, infoText }) => {
  return (
    <div className="bg-stm-red gap-4 rounded-lg min-h-20 flex p-2 items-center justify-center">
      <div className=" flex lg:flex-col xs:flex-row gap-4 ">
        <div className="flex gap-2">
          {React.cloneElement(infoIcon, {
            color: "white",
            className: "h-6 w-6",
          })}
          <span className="text-md text-white uppercase font-semibold">
            {infoTitle}
          </span>
        </div>

        <p className="font-light text-white text-left text-xs  whitespace-pre-line">
          {infoText}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
