"use server";

import { getUsers } from "@/lib/actions/userActions";
import UsersSection from "@/components/UsersSection";

const Users = async () => {
  const users = await getUsers();

  return (
    <>
      <UsersSection users={users} />
    </>
  );
};

export default Users;
