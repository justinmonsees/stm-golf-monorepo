"use client";

import React from "react";
import { useState, useEffect } from "react";
import { columns } from "@/app/dashboard/(dashboard)/users/columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "../ui/button";
import UserDialogForm from "./UserDialogForm";

const UsersSection = ({ users }) => {
  const [userEditData, setEditUserData] = useState(null);
  const [isUserFormOpen, setUserFormOpen] = useState(false);

  const editButtonHandler = (rowData) => {
    setEditUserData(rowData);
    handleUserFormOpen();
  };

  const addButtonHandler = async () => {
    setEditUserData(null);
    handleUserFormOpen();
  };

  const handleUserFormOpen = () => {
    setUserFormOpen((prevVal) => !prevVal);
  };

  return (
    <div className="w-full pb-10 px-20">
      <div className="text-4xl py-10 flex justify-between">
        <span>Users</span>
        <Button onClick={addButtonHandler}>Add User</Button>
      </div>
      <DataTable
        columns={columns}
        data={users}
        openEditFunction={editButtonHandler}
        initSortCol={"user_fullName"}
      />

      <UserDialogForm
        isFormOpen={isUserFormOpen}
        formHandler={handleUserFormOpen}
        attendee={userEditData}
      />
    </div>
  );
};

export default UsersSection;
