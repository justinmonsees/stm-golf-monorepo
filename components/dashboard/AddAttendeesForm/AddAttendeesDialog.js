"use client";

import React, { useState } from "react";
import AddAttendeesForm from "./AttendeeForm";
import AttendeeList from "./AttendeeList";
import { addAttendees } from "@/lib/actions/attendeeActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, Plus } from "lucide-react";
import uuid from "react-uuid";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const AddAttendeesDialog = ({ isFormOpen, formHandler }) => {
  const { toast } = useToast();
  const router = useRouter();

  const [attendeesToAdd, setAttendeesToAdd] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [regGroupID, setRegGroupID] = useState(uuid());

  // We only want to render the dialog and fetch data when it's open.
  // This helps avoid unnecessary fetches if the dialog is never opened.
  if (!isFormOpen) {
    return null;
  }

  const addAttendeeToList = (newAttendee) => {
    setAttendeesToAdd((prevAttendees) => [...prevAttendees, newAttendee]);
  };

  const removeAttendeeFromList = (attendeeToRemove) => {
    setAttendeesToAdd((prevAttendees) =>
      prevAttendees.filter(
        (attendee) => attendee.attendee_id !== attendeeToRemove.attendee_id
      )
    );
  };

  const handleSaveToDatabase = async (addAnother = false) => {
    if (addAnother) {
      //generate a new registration group id
      setRegGroupID(uuid());

      //reset the attendees to add
      setAttendeesToAdd([]);
    } else {
      formHandler();
    }
    setIsPending(true);

    const { result, error } = await addAttendees(attendeesToAdd);

    setIsPending(false);

    if (error) {
      toast({
        variant: "destructive",
        title: result,
        description: error,
      });
    } else {
      toast({
        variant: "success",
        description: result,
      });
      router.refresh();
    }
  };

  return (
    <Dialog
      onOpenChange={formHandler}
      open={isFormOpen}
      defaultOpen={isFormOpen}
    >
      <DialogContent className="sm:max-w-[80%] sm:max-h-[80%] overflow-y-scroll grid grid-cols-2">
        <DialogHeader className="col-span-2">
          <DialogTitle className="text-2xl">Add Attendees</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Dialog Form to Add or Edit an Attendee
        </DialogDescription>

        <AddAttendeesForm
          addAttendeeToList={addAttendeeToList}
          regGroupID={regGroupID}
        />
        <AttendeeList
          attendeesToAdd={attendeesToAdd}
          removeAttendeeFromList={removeAttendeeFromList}
        />
        <Card className="col-span-2">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center ">
              <div className="text-sm text-muted-foreground">
                Ready to save {attendeesToAdd.length} attendee
                {attendeesToAdd.length === 1 ? "" : "s"} to the database
              </div>

              <Button
                onClick={() => handleSaveToDatabase(true)}
                variant="outline"
                disabled={isPending || attendeesToAdd.length === 0}
                size="lg"
                className="ml-auto"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Save & Add Another Group
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleSaveToDatabase(false)}
                disabled={isPending || attendeesToAdd.length === 0}
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                Save All Attendees
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AddAttendeesDialog;
