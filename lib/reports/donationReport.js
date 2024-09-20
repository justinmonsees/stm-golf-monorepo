"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function createDonationReport(donations, eventInfo) {
  const donationsByItemType = reformatDonationDataByCat(donations);

  const doc = new jsPDF({ orientation: "p", unit: "in", format: "letter" });

  const reportTitle = "Donations by Type";

  const tableHeader = [
    "Company Name",
    "Preferred Text",
    "Amount",
    "Date Paid",
    "Notes",
  ];
  // Or use javascript directly:

  Object.values(donationsByItemType).forEach((itemDonationData, index) => {
    console.log("ITEM DONATION DATA", itemDonationData);

    if (index == 0) {
      doc.text(
        [
          `${eventInfo.event_name}`,
          `${reportTitle}`,
          " ",
          `${itemDonationData.item_name}`,
        ],
        0.5,
        0.5
      );

      autoTable(doc, {
        startY: 1.5,
        head: [tableHeader],
        body: itemDonationData.donations,
      });
    } else {
      doc.text(
        [`${itemDonationData.item_name}`],
        0.5,
        doc.lastAutoTable.finalY + 0.5
      );

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 0.75,
        head: [tableHeader],
        body: itemDonationData.donations,
      });
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

const reformatDonationDataByCat = (donations) => {
  const donationByCat = donations.reduce((acc, cur) => {
    //if the key is new, initiate its value to an empty array, otherwise keep the value

    acc[cur["item_id"]] = acc[cur["item_id"]] || {
      item_name: `${cur.item.name}`,
      donations: [],
    };

    acc[cur["item_id"]].donations.push(cur);

    return acc;
  }, {});

  Object.values(donationByCat).forEach(
    (donationObj) =>
      (donationObj.donations = donationObj.donations.reduce((acc, cur) => {
        //formatted amount for currency
        const formattedAmount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(cur.amount_received);

        acc.push([
          cur.sponsor.company_name,
          cur.preferred_text,
          formattedAmount,
          cur.date_paid,
          cur.notes,
        ]);

        return acc;
      }, []))
  );

  return donationByCat;
};
