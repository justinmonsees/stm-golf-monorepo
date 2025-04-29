"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover-dialog";

const ComboboxContext = createContext({});

const Combobox = ({
  defaultValue,
  onValueChange,
  children,
  width,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const contextValue = {
    defaultValue,
    displayValue,
    setDisplayValue,
    onValueChange,
    width,
    isOpen,
    toggleIsOpen,
  };

  return (
    <ComboboxContext.Provider value={contextValue}>
      <Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  );
};

function useComboboxContext() {
  return useContext(ComboboxContext);
}

const ComboboxTrigger = ({ children }) => {
  const { displayValue, defaultValue, width, toggleIsOpen } =
    useComboboxContext();
  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        onClick={toggleIsOpen}
        className={cn(
          `w-[${width}px] justify-between gap-2 ${
            !displayValue && !defaultValue && "text-muted-foreground"
          }`
        )}
      >
        {children}
        <ChevronsUpDown className="opacity-50" />
      </Button>
    </PopoverTrigger>
  );
};

const ComboboxValue = ({ placeholder }) => {
  const { displayValue } = useComboboxContext();
  return <>{displayValue || placeholder}</>;
};

const ComboboxContent = ({ searchPlaceholder, emptyPlaceholder, items }) => {
  const { width, setDisplayValue, onValueChange, isOpen, toggleIsOpen } =
    useComboboxContext();
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  const handleInputChange = (event) => {
    const inputValue = event.target.value.toLowerCase();
    setQuery(inputValue);

    const newFilteredItems = items.filter((item) => {
      return item.label.toLowerCase().includes(inputValue);
    });

    setFilteredItems(newFilteredItems);
  };

  return (
    <PopoverContent
      className={`p-0 w-[--radix-popover-trigger-width]`}
      onEscapeKeyDown={(event) => {
        if (isOpen) {
          toggleIsOpen();
          event.stopPropagation();
        }
      }}
    >
      <Command shouldFilter={false}>
        <CommandInput
          placeholder={searchPlaceholder}
          className="h-9"
          value={query}
          onInput={handleInputChange}
        />
        <CommandList>
          <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
          <CommandGroup>
            {filteredItems.map((item) => {
              return (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    setDisplayValue(item.label);
                    onValueChange(item.value);
                    toggleIsOpen();
                  }}
                >
                  {item.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  );
};

export { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent };
