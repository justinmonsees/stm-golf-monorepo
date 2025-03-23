import { redirect } from "next/navigation";

import React from "react";

const notFound = () => {
  redirect("/404");

  return <h1>Page Not Found</h1>;
};

export default notFound;
