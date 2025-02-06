import React from "react";

const InfoCard = ({ infoIcon, infoText }) => {
  return (
    <div className="bg-stm-red flex lg:flex-col xs:flex-row items-center gap-4 p-2 lg:p-3 rounded-lg min-h-20">
      {React.cloneElement(infoIcon, { color: "white", className: "h-6 w-6" })}
      <p className="font-light text-white text-left text-xs  whitespace-pre-line">
        {infoText}
      </p>
    </div>
  );
};

export default InfoCard;
