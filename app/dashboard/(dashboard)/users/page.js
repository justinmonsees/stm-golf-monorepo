"use server";

import { getUsers } from "@/lib/actions/userActions";
import UsersSection from "@/components/dashboard/UsersSection";
import { redirect } from "next/navigation";

const Users = async () => {
  const users = await getUsers();

  if (!users) {
    redirect("/");
  }

  return (
    <>
      <UsersSection users={users} />
    </>
  );
};

export default Users;
