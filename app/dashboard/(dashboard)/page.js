"use server";

import { getAttendees } from "@/lib/actions/attendeeActions";
import { getDonations } from "@/lib/actions/donationActions";
import { getExpenses } from "@/lib/actions/expenseActions";
import DashboardSection from "@/components/dashboard/DashboardSection";

export default async function Dashboard() {
  const [attendees, donations, expenses] = await Promise.all([
    getAttendees(),
    getDonations(),
    getExpenses(),
  ]);

  const initVal = 0;

  const totalAttendeeFees = attendees.reduce(
    (acc, attendee) => acc + attendee.amount_paid,
    initVal
  );

  const attendeeTypeTotals = attendees.reduce((acc, val) => {
    acc[val.attendee_type] = (acc[val.attendee_type] || 0) + 1;
    return acc;
  }, {});

  const donationsObjByType = donations.reduce((acc, val) => {
    acc[val.item.name] = acc[val.item.name] || {
      item: val.item.name,
      amount: 0,
    };
    acc[val.item.name]["amount"] += val.amount_received;
    return acc;
  }, {});

  const donationAmountsByType = Object.values(donationsObjByType);

  const totalDonations = donations.reduce(
    (acc, donation) => acc + donation.amount_received,
    initVal
  );

  const totalExpenses = expenses.reduce(
    (acc, expense) => acc + expense.amount_paid,
    initVal
  );

  const stats = {
    income: {
      total_donations: totalDonations,
      total_attendees: totalAttendeeFees,
      gross_income: totalDonations + totalAttendeeFees,
    },
    expenses: {
      total_expenses: totalExpenses,
    },
    attendees: {
      totalAmount: attendees.length,
      perType: attendeeTypeTotals,
    },
    donations: {
      byType: donationAmountsByType,
    },
  };

  return (
    <>
      <DashboardSection stats={stats} />
    </>
  );
}
