"use client";

import { downloadCSV } from "@/utils/csvGenerator";

export function exportSponsorsCSV(sponsors, fileName = "download") {
  const sponsorDataArr = reformatSponsorDataForCSV(sponsors);

  downloadCSV(sponsorDataArr, fileName);
}

function reformatSponsorDataForCSV(sponsors) {
  const sponsorArr = [
    [
      "Company Name",
      "Contact Prefix",
      "Contact First Name",
      "Contact Last Name",
      "Contact Phone Number",
      "Address 1",
      "Address 2",
      "City",
      "State",
      "Zip",
      "Business Phone Number",
      "Committee Member",
    ],
  ];

  Object.values(sponsors).map((sponsor) => {
    sponsorArr.push([
      sponsor.company_name ? `\"${sponsor.company_name}\"` : "",
      sponsor.contact_prefix ? `\"${sponsor.contact_prefix}\"` : "",
      sponsor.contact_first_name ? `\"${sponsor.contact_first_name}\"` : "",
      sponsor.contact_last_name ? `\"${sponsor.contact_last_name}\"` : "",
      sponsor.contact_phone_number ? `\"${sponsor.contact_phone_number}\"` : "",
      sponsor.address1 ? `\"${sponsor.address1}\"` : "",
      sponsor.address2 ? `\"${sponsor.address2}\"` : "",
      sponsor.city ? `\"${sponsor.city}\"` : "",
      sponsor.state ? `\"${sponsor.state}\"` : "",
      sponsor.zip ? `\"${sponsor.zip}\"` : "",
      sponsor.business_phone_number
        ? `\"${sponsor.business_phone_number}\"`
        : "",
      sponsor.committee_member_id
        ? `\"${sponsor.committee_members.first_name} ${sponsor.committee_members.last_name}\"`
        : "",
    ]);
  });

  return sponsorArr;
}
