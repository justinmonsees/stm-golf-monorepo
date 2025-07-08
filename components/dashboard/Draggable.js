"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Grip } from "lucide-react";

export default function Draggable({ id, type, data, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      data: {
        type: type,
        data: data,
        id: id,
      },
    });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="grid grid-cols-6 items-center"
    >
      <div className="col-span-1">
        <Grip className="cursor-grab opacity-50 hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200" />
      </div>
      <div className="col-span-5">{children}</div>
    </div>
  );
}
