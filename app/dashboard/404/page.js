import React from "react";
import CustomAlert from "@/components/dashboard/CustomAlert";

const dashboardNotFound = () => {
  const redirectMessage =
    "This page is not valid, you will now be redirected to the dashboard.";
  const isAlertOpen = true;
  const redirectLink = "/";

  return (
    <>
      <CustomAlert
        isOpen={isAlertOpen}
        message={redirectMessage}
        redirectLink={redirectLink}
      />
    </>
  );
};

export default dashboardNotFound;
