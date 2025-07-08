"use client";

import React, { createContext, useContext } from "react";

const AttendeeDataContext = createContext({
  undefined,
});

export const AttendeeDataProvider = ({
  children,
  attendees,
  currentEvent,
  attendeeItems,
}) => {
  const contextValue = {
    // Directly use the props
    attendees,
    currentEvent,
    attendeeItems,
  };

  return (
    <AttendeeDataContext.Provider value={contextValue}>
      {children}
    </AttendeeDataContext.Provider>
  );
};

export const useAttendeeContext = () => {
  const context = useContext(AttendeeDataContext);
  if (context === undefined) {
    throw new Error("useAttendeeContext must be used within a ThemeProvider");
  }
  return context;
};
