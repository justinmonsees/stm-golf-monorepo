"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function createSponsorReport(sponsors, eventInfo) {
  const sponsorByCommitteeMemberID = reformatSponsorDataByCM(sponsors);

  const doc = new jsPDF({ orientation: "l", unit: "in", format: "letter" });

  const reportTitle = "Sponsors by Committee Members";

  const tableHeader = [
    "Company Name",
    "Address",
    "Business #",
    "Contact Name",
    "Contact Info",
  ];

  Object.values(sponsorByCommitteeMemberID).forEach((cmSponsorData, index) => {
    doc.text(
      [`${eventInfo.event_name}`, `${reportTitle}: ${cmSponsorData.name}`],
      0.5,
      0.5
    );

    autoTable(doc, {
      startY: 1,
      head: [tableHeader],
      body: cmSponsorData.sponsors,
    });

    if (index != Object.keys(sponsorByCommitteeMemberID).length - 1) {
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
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 0.5, 8);

    //add page numbers
    doc.text("Page " + String(i) + " of " + String(pageCount), 10.5, 8, {
      align: "right",
    });
  }
};

const reformatSponsorDataByCM = (sponsors) => {
  const sponsorByCommitteeMemberID = sponsors.reduce((acc, cur) => {
    //if the key is new, initiate its value to an empty array, otherwise keep the value
    if (cur["committee_member_id"]) {
      acc[cur["committee_member_id"]] = acc[cur["committee_member_id"]] || {
        name: `${
          cur.committee_members.first_name +
          " " +
          cur.committee_members.last_name
        }`,
        sponsors: [],
      };

      acc[cur["committee_member_id"]].sponsors.push(cur);
    } else {
      if (!acc["Unassigned"]) {
        acc["Unassigned"] = {
          name: "Unassigned",
          sponsors: [],
        };
      }
      acc["Unassigned"].sponsors.push(cur);
    }
    return acc;
  }, {});

  //sort the values in the array of objects by company name
  Object.values(sponsorByCommitteeMemberID).forEach((sponsorObj) =>
    sponsorObj.sponsors.sort((sponsor1, sponsor2) => {
      const companyName1 = sponsor1.company_name.toUpperCase();
      const companyName2 = sponsor2.company_name.toUpperCase();

      if (companyName1 < companyName2) {
        return -1;
      } else if (companyName1 > companyName2) {
        return 1;
      } else {
        return 0;
      }
    })
  );

  Object.values(sponsorByCommitteeMemberID).forEach(
    (sponsorObj) =>
      (sponsorObj.sponsors = sponsorObj.sponsors.reduce((acc, cur) => {
        acc.push([
          cur.company_name,
          [
            [cur.address1, cur.address2].filter((value) => value).join(","),
            [cur.city, cur.state, cur.zip].filter((value) => value).join(","),
          ].join("\n"),
          cur.business_phone_number || "",
          [cur.contact_prefix, cur.contact_first_name, cur.contact_last_name]
            .filter((value) => value)
            .join(" ")
            .trim(),
          [cur.contact_phone_number, cur.contact_email]
            .filter((value) => value)
            .join("\n")
            .trim(),
        ]);

        return acc;
      }, []))
  );

  return sponsorByCommitteeMemberID;
};
