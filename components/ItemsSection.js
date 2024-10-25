"use client";

import React from "react";
import { useState, useEffect } from "react";
import { columns } from "@/app/(dashboard)/items/columns";
import { DataTable } from "@/components/ui/data-table";
import ItemDialogForm from "./ItemDialogForm";
import { Button } from "./ui/button";

const ItemsSection = ({ items }) => {
  const [itemEditData, setEditItemData] = useState(null);
  const [isItemFormOpen, setItemFormOpen] = useState(false);

  const editButtonHandler = (rowData) => {
    setEditItemData(rowData);
    handleItemFormOpen();
  };

  const addButtonHandler = () => {
    setEditItemData(null);
    handleItemFormOpen();
  };

  const handleItemFormOpen = () => {
    setItemFormOpen((prevVal) => !prevVal);
  };

  //console.log(items);
  return (
    <div className="w-full pb-10 px-10">
      <div className="text-4xl py-10 flex justify-between">
        <span>Items</span>
        <Button onClick={addButtonHandler}>Add Item</Button>
      </div>
      <DataTable
        columns={columns}
        data={items}
        openEditFunction={editButtonHandler}
        initSortCol={"name"}
      />

      <ItemDialogForm
        isFormOpen={isItemFormOpen}
        formHandler={handleItemFormOpen}
        item={itemEditData}
      />
    </div>
  );
};

export default ItemsSection;
