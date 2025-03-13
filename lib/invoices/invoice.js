"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInvoicePDF(purchaser, items) {
  const sponsor = purchaser.companyInfo;
  const contact = purchaser.contactInfo;

  const doc = new jsPDF({ orientation: "p", unit: "in", format: "letter" });

  //build header

  autoTable(doc, {
    body: [
      [
        {
          content: "St. Thomas More\nAnnual Golf Outing",
          styles: {
            halign: "left",
            fontSize: 16,
            fontStyle: "bold",
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
          },
        },
        {
          content: "INVOICE",
          styles: {
            halign: "right",
            fontSize: 22,
            fontStyle: "bold",
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
          },
        },
      ],
    ],
  });

  /******************************************************************************
   * Generate contact information depending on whether the purchaser is
   * a business (purchaser.type=business)
   * or an individual (purchaser.type=personal)
   *
   ***************************************************************************/
  purchaser.type === "business" &&
    autoTable(doc, {
      head: [["Company Info", "Contact Info"]],
      body: [
        [
          {
            content:
              `${purchaser.companyInfo.company}` +
              `\n${purchaser.companyInfo.address1}` +
              `${
                purchaser.companyInfo.address2
                  ? "\n" + purchaser.companyInfo.address2
                  : ""
              }` +
              `\n${purchaser.companyInfo.city} ${purchaser.companyInfo.state}, ${purchaser.companyInfo.zip}` +
              `\n${purchaser.companyInfo.businessPhoneNumber}`,
            styles: {
              halign: "left",
            },
          },

          {
            content:
              `${
                purchaser.contactInfo.prefix != ""
                  ? purchaser.contactInfo.prefix + " "
                  : ""
              }${purchaser.contactInfo.firstName} ${
                purchaser.contactInfo.lastName
              }` +
              `\n${purchaser.contactInfo.phoneNumber}` +
              `\n${purchaser.contactInfo.email}`,
            styles: {
              halign: "left",
            },
          },
        ],
      ],
      theme: "plain",
      styles: {
        fontSize: 12,
      },
    });

  purchaser.type === "personal" &&
    autoTable(doc, {
      head: [["Contact Info"]],
      body: [
        [
          {
            content:
              `${
                purchaser.contactInfo.prefix != ""
                  ? purchaser.contactInfo.prefix + " "
                  : ""
              }${purchaser.contactInfo.firstName} ${
                purchaser.contactInfo.lastName
              }` +
              `\n${purchaser.contactInfo.address1}` +
              `${
                purchaser.contactInfo.address2
                  ? "\n" + purchaser.contactInfo.address2
                  : ""
              }` +
              `\n${purchaser.contactInfo.city} ${purchaser.contactInfo.state}, ${purchaser.contactInfo.zip}` +
              `\n${purchaser.contactInfo.phoneNumber}` +
              `\n${purchaser.contactInfo.email}`,
            styles: {
              halign: "left",
            },
          },
        ],
      ],
      theme: "plain",
      styles: {
        fontSize: 12,
      },
    });

  /********************************************************
   *
   *  show the items and cost and total price
   *
   ********************************************************/

  const itemsTableHeader = ["Name", "Description", "Amount"];

  const allItems = reformatItemsData(purchaser, items);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 0.5,
    head: [itemsTableHeader],
    body: allItems,
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontSize: 14,
    },
    bodyStyles: {
      fontSize: 12,
    },
  });

  const totalCost = items.reduce((acc, item) => {
    acc += item.cost;
    return acc;
  }, 0);

  const formattedTotalCost = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalCost);

  doc.text(
    `Total: ${formattedTotalCost}`,
    6.5,
    doc.lastAutoTable.finalY + 0.25,
    { align: "right" }
  );
  /********************************************************
   *
   *  Create the section that tells the buyer where to send
   *  the check and to whom to make the check out to.
   *
   ********************************************************/
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 0.75,
    body: [
      [
        {
          content:
            "Please mail your check to:" +
            "\nSt. Thomas More R.C." +
            "\nGolf Outing Committee" +
            "\n115 Kings Highway" +
            "\nHauppauge, NY 11788" +
            "\n\nMake check payable to: St. Thomas More R.C.",
          styles: {
            halign: "left",
          },
        },
      ],
    ],
    theme: "plain",
    styles: {
      fontSize: 12,
    },
  });

  /********************************************************
   *
   *  Add the Thank You message
   *
   ********************************************************/
  doc.text("Thank you for your support!", 4.25, 10.5, {
    align: "center",
  });

  doc.save(`invoice.pdf`);
}

const reformatItemsData = (purchaser, items) => {
  const formattedItems = items.reduce((acc, cur) => {
    const formattedCost = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cur.cost);

    let description = "";
    if (cur.item_type === "sponsor") {
      if (cur.meta.preferredText === "") {
        description = purchaser.companyInfo.company;
      } else {
        description = cur.meta.preferredText;
      }
    } else {
      //item type is an attendee
      description = cur.meta.firstName + " " + cur.meta.lastName;
    }

    acc.push([cur.name, description, formattedCost]);

    return acc;
  }, []);

  return formattedItems;
};
