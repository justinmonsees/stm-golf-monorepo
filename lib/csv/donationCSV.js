"use client";

import { downloadCSV } from "@/utils/csvGenerator";

export function exportDonationsCSV(donations, fileName = "download") {
  const donationDataArr = reformatDonationDataForCSV(donations);

  downloadCSV(donationDataArr, fileName);
}

function reformatDonationDataForCSV(donations) {
  const donationArr = [
    [
      "Donation Type",
      "Company Name",
      "Preferred Text",
      "Amount",
      "Date Paid",
      "Notes",
    ],
  ];

  Object.values(donations).map((donation) => {
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(donation.amount_received);

    donationArr.push([
      donation.item.name ? `\"${donation.item.name}\"` : "",
      donation.sponsor.company_name
        ? `\"${donation.sponsor.company_name}\"`
        : "",
      donation.preferred_text ? `\"${donation.preferred_text}\"` : "",
      `\"${formattedAmount}\"`,
      donation.date_paid ? `\"${donation.date_paid}\"` : "",
      donation.notes ? `\"${donation.notes}\"` : "",
    ]);
  });

  return donationArr;
}
