"use client";

import React from "react";
import { useState, useEffect } from "react";
import { columns } from "@/app/(dashboard)/events/columns";
import { DataTable } from "@/components/ui/data-table";
import { convertToLocalDate } from "@/lib/helpers";
import { Button } from "./ui/button";
import EventDialogForm from "./EventDialogForm";

const EventsSection = ({ events, committeeMembers, hosts }) => {
  const [eventEditData, setEditEventData] = useState(null);
  const [isEventFormOpen, setEventFormOpen] = useState(false);
  const [eventsExpired, setEventsExpired] = useState(false);

  const curEvent = events.find((event) => event.is_current_event === true);

  const localDate = convertToLocalDate(curEvent.event_date);

  const curEventDate = new Date(localDate);
  const today = new Date();

  useEffect(() => {
    if (curEventDate < today) {
      setEventsExpired(true);
    } else if (curEventDate > today) {
      setEventsExpired(false);
    }
  }, []);

  const editButtonHandler = (rowData) => {
    setEditEventData(rowData);
    handleEventFormOpen();
  };

  const addButtonHandler = () => {
    setEditEventData(null);
    handleEventFormOpen();
  };

  const handleEventFormOpen = () => {
    setEventFormOpen((prevVal) => !prevVal);
  };

  return (
    <div className="w-full pb-10 px-10">
      <div className="text-4xl py-10 flex justify-between">
        <span>Event Dates</span>

        <Button onClick={addButtonHandler}>Add Event</Button>
      </div>
      <DataTable
        columns={columns}
        data={events}
        openEditFunction={editButtonHandler}
        initSortCol={"eventDate"}
        initSortDesc={true}
      />

      <EventDialogForm
        isFormOpen={isEventFormOpen}
        formHandler={handleEventFormOpen}
        events={events}
        event={eventEditData}
        committeeMembers={committeeMembers}
        hosts={hosts}
      />
    </div>
  );
};

export default EventsSection;
