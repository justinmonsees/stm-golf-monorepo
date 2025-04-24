"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";

export function DatePicker({ field }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} modal={true}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant={"outline"}
            className={cn(
              "w-full pl-3 text-left font-normal flex",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          initialFocus
        />
        <div className="flex justify-center w-full mb-2">
          <Button
            className="text-xs p-1 h-auto hover:text-white hover:bg-green-700"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Save and Close
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
