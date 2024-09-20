"use client";

import { downloadCSV } from "@/utils/csvGenerator";

export function exportAttendeesCSV(attendees, fileName = "download") {
  const attendeeDataArr = reformatAttendeeDataForCSV(attendees);

  downloadCSV(attendeeDataArr, fileName);
}

function reformatAttendeeDataForCSV(attendees) {
  const attendeeArr = [
    [
      "Name",
      "Type",
      "Address1",
      "Address2",
      "City",
      "State",
      "Zip",
      "Phone Number",
      "Email",
      "Date Paid",
    ],
  ];

  Object.values(attendees).map((attendee) => {
    const fullName = [attendee.first_name, attendee.last_name]
      .filter((value) => value)
      .join(" ")
      .trim();

    attendeeArr.push([
      `\"${fullName}\"`,
      attendee.attendee_type ? `\"${attendee.attendee_type}\"` : "",
      attendee.address1 ? `\"${attendee.address1}\"` : "",
      attendee.address2 ? `\"${attendee.address2}\"` : "",
      attendee.city ? `\"${attendee.city}\"` : "",
      attendee.state ? `\"${attendee.state}\"` : "",
      attendee.zip ? `\"${attendee.zip}\"` : "",
      attendee.phone_number ? `\"${attendee.phone_number}\"` : "",
      attendee.email ? `\"${attendee.email}\"` : "",
      attendee.date_paid ? `\"${attendee.date_paid}\"` : "",
    ]);
  });

  return attendeeArr;
}
