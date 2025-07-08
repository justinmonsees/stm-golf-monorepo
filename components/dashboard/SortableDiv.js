"use client";

import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { Grip } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";

export default function SortableDiv({ id, type, data, activeIndex, children }) {
  const {
    attributes,
    listeners,
    index,
    isDragging,
    isSorting,
    over,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: id,
    data: {
      type: type,
      data: data,
      id: id,
    },
    animateLayoutChanges: () => {
      return false;
    },
  });

  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform:
      isDragging || isSorting ? CSS.Translate.toString(transform) : undefined,
    transition: isDragging || isSorting ? transition : undefined,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div className="flex flex-col" ref={setNodeRef} id={id} style={style}>
      <div className="flex justify-center py-3" {...listeners} {...attributes}>
        <Grip />
      </div>
      <div>{children}</div>
    </div>
  );
}
