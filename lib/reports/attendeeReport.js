"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function createAttendeeReport(attendees, eventInfo) {
  const attendeesByType = reformatAttendeeDataByType(attendees);

  const doc = new jsPDF({ orientation: "p", unit: "in", format: "letter" });

  const reportTitle = "Attendees by Type";

  const tableHeader = ["Name", "Type", "Phone Number", "Paid"];

  Object.values(attendeesByType).forEach((attendeeData, index) => {
    doc.text(
      [`${eventInfo.event_name}`, `${reportTitle}: ${attendeeData.type}`],
      0.5,
      0.5
    );

    autoTable(doc, {
      startY: 1,
      head: [tableHeader],
      body: attendeeData.attendees,
    });

    if (index != Object.keys(attendeesByType).length - 1) {
      doc.addPage();
    }
  });

  addFooters(doc);
  doc.save(`${reportTitle}.pdf`);
}

const addFooters = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();

  doc.setFontSize(8);

  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    //add the date the report was generated
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 0.5, 10.5);

    //add page numbers
    doc.text("Page " + String(i) + " of " + String(pageCount), 8, 10.5, {
      align: "right",
    });
  }
};

const reformatAttendeeDataByType = (attendees) => {
  const attendeesByType = attendees.reduce((acc, cur) => {
    //if the key is new, initiate its value to an empty array, otherwise keep the value

    acc[cur["attendee_type"]] = acc[cur["attendee_type"]] || {
      type: `${cur.attendee_type}`,
      attendees: [],
    };

    acc[cur["attendee_type"]].attendees.push(cur);

    return acc;
  }, {});

  Object.values(attendeesByType).forEach(
    (attendeeObj) =>
      (attendeeObj.attendees = attendeeObj.attendees.reduce((acc, cur) => {
        acc.push([
          [cur.first_name, cur.last_name]
            .filter((value) => value)
            .join(" ")
            .trim(),
          cur.attendee_type,
          cur.phone_number || "",
          cur.paid ? "Yes" : "No",
        ]);

        return acc;
      }, []))
  );

  return attendeesByType;
};
