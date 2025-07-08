"use client";

import React from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import {
  useState,
  useEffect,
  useMemo,
  useTransition,
  useOptimistic,
  useCallback,
} from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { ScrollArea } from "../../ui/scroll-area";
import { Checkbox } from "../../ui/checkbox";
import { Badge } from "../../ui/badge";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { Label } from "../../ui/label";

import { bulkUpdateAttendees } from "@/lib/actions/attendeeActions";
import { bulkUpdateGolfTeeGroups } from "@/lib/actions/golfTeeGroupActions";
import { useToast } from "../../ui/use-toast";
import { X } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Grip, Link, Unlink } from "lucide-react";
import { rearrangeHoles } from "@/lib/helpers";

const Droppable = dynamic(() => import("../Droppable"), { ssr: false });
const Draggable = dynamic(() => import("../Draggable"), { ssr: false });
const SortableDiv = dynamic(() => import("../SortableDiv"), { ssr: false });

const TeeAssignmentSection = ({
  attendees,
  golfTeeGroups,
  curEvent,
  settings,
}) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isAttendeesLinked, setIsAttendeesLinked] = useState(true);
  const [optimisticAttendees, setOptimisticAttendees] =
    useOptimistic(attendees);
  const [optimisticGolfTeeGroups, setOptimisticGolfTeeGroups] = useOptimistic(
    golfTeeGroups,
    (currentTeeGroups, optimisticAction) => {
      // Create a deep copy to ensure immutability
      let updatedTeeGroups = JSON.parse(JSON.stringify(currentTeeGroups));

      if (optimisticAction.type === "MOVE_MULTIPLE_ATTENDEES") {
        const { attendeesToMove, newGolfTeeGroupID } = optimisticAction.payload;

        // First, remove all selected attendees from any group they were previously in
        updatedTeeGroups.forEach((teeGroup) => {
          teeGroup.attendee = teeGroup.attendee.filter(
            (attendee) =>
              !attendeesToMove.some(
                (attendeeToMove) =>
                  attendeeToMove.attendee_id === attendee.attendee_id
              )
          );
        });

        // Then, add the selected attendees to the new group
        const golfTeeGroupToUpdate = updatedTeeGroups.find(
          (teeGroup) => teeGroup.golf_tee_group_id === newGolfTeeGroupID
        );

        if (golfTeeGroupToUpdate) {
          attendeesToMove.forEach((attendeeToMove) => {
            if (
              !golfTeeGroupToUpdate.attendee.some(
                (attendee) =>
                  attendee.attendee_id === attendeeToMove.attendee_id
              )
            ) {
              golfTeeGroupToUpdate.attendee.push({
                ...attendeeToMove,
                pending: true,
              });
            }
          });
        }
      } else if (optimisticAction.type === "MOVE_SINGLE_ATTENDEE") {
        const { attendeeToMove, newGolfTeeGroupID } = optimisticAction.payload;
        // First, remove the attendee from any group they were previously in
        updatedTeeGroups.forEach((teeGroup) => {
          teeGroup.attendee = teeGroup.attendee.filter(
            (attendee) => attendeeToMove.attendee_id != attendee.attendee_id
          );
        });

        // Then, add the single attendee to the new group
        if (newGolfTeeGroupID) {
          const golfTeeGroupToUpdate = updatedTeeGroups.find(
            (teeGroup) => teeGroup.golf_tee_group_id === newGolfTeeGroupID
          );

          if (
            !updatedTeeGroups.attendee.some(
              (attendee) => attendee.attendee_id === attendeeToMove.attendee_id
            )
          ) {
            golfTeeGroupToUpdate.attendee.push({
              ...attendeeToMove,
              pending: true,
            });
          }
        }
      } else if (optimisticAction.type === "MOVE_HOLES") {
        const { fromHoleNum, toHoleNum } = optimisticAction.payload;

        updatedTeeGroups = rearrangeHoles(
          fromHoleNum,
          toHoleNum,
          updatedTeeGroups
        );
      }

      return updatedTeeGroups;
    }
  );

  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(
    golfTeeGroups[0].golf_tee_group_id
  );

  const toggleIsAttendeesLinked = () => {
    setIsAttendeesLinked((prevVal) => !prevVal);
  };

  const availableAttendees = useMemo(
    () =>
      optimisticAttendees.filter(
        (attendee) => attendee.golf_tee_group_id === null
      ),
    [optimisticAttendees]
  );

  const numHolesArray = useMemo(() => {
    return Array.from({ length: settings.numHoles }, (_, i) => i + 1);
  }, [settings.numHoles]);

  // STATE for DragOverlay
  const [activeId, setActiveId] = useState(null); // Stores the ID of the currently dragged item
  const [activeType, setActiveType] = useState(null); // Stores the type ('attendee' or 'groupCard')
  const [activeItemData, setActiveItemData] = useState(null); // Stores data to render in overlay

  // Toggle attendee selection
  const toggleAttendee = (toggledAttendee) => {
    if (isAttendeesLinked) {
      if (
        selectedAttendees.find(
          (selectedAttendee) =>
            selectedAttendee.attendee_id === toggledAttendee.attendee_id
        )
      ) {
        setSelectedAttendees(
          selectedAttendees.filter(
            (selectedAttendee) =>
              selectedAttendee.registration_group_id !==
              toggledAttendee.registration_group_id
          )
        );
      } else {
        const attendeesInSameGroup = attendees.filter(
          (attendee) =>
            attendee.registration_group_id ===
            toggledAttendee.registration_group_id
        );

        setSelectedAttendees([...selectedAttendees, ...attendeesInSameGroup]);
      }
    } else {
      if (
        selectedAttendees.find(
          (selectedAttendee) =>
            selectedAttendee.attendee_id === toggledAttendee.attendee_id
        )
      ) {
        setSelectedAttendees(
          selectedAttendees.filter(
            (selectedAttendee) =>
              selectedAttendee.attendee_id !== toggledAttendee.attendee_id
          )
        );
      } else {
        setSelectedAttendees([...selectedAttendees, toggledAttendee]);
      }
    }
  };

  const getGroupsByHoleNumber = (holeNumber) => {
    const holeGroups = optimisticGolfTeeGroups
      .filter((group) => group.hole_number === holeNumber)
      .sort((group1, group2) =>
        group1.hole_letter.localeCompare(group2.hole_letter)
      );

    if (isAttendeesLinked) {
      const attendeesLinkedHoleGroups = JSON.parse(JSON.stringify(holeGroups));

      attendeesLinkedHoleGroups.map((holeGroup) => {
        //use a reducer to group attendees by registration group
        const groupedAttendeesObj = holeGroup.attendee.reduce(
          (accumulator, attendee) => {
            const regGroupID = attendee.registration_group_id;

            if (!accumulator[regGroupID]) {
              accumulator[regGroupID] = [];
            }
            accumulator[regGroupID].push(attendee);

            return accumulator;
          },
          {}
        );

        const groupedAttendeesArray = Object.values(groupedAttendeesObj);

        holeGroup["attendee"] = groupedAttendeesArray;

        return holeGroup;
      });

      return attendeesLinkedHoleGroups;
    } else {
      return holeGroups;
    }
  };

  const assignGolfers = () => {
    moveGolfers(selectedAttendees, selectedGroup);
  };

  const moveGolfers = async (attendeesToMove, newGolfTeeGroupID) => {
    //First check to make sure that the number of attendees to move doesn't exceed the
    //maximum number of golfers in a group which is currently 4

    //Only perform this check if the newGolfTeeGroupID is NOT null
    if (newGolfTeeGroupID) {
      if (
        attendeesToMove.length +
          golfTeeGroups.find(
            (teeGroup) => teeGroup.golf_tee_group_id === newGolfTeeGroupID
          ).attendee.length >
        settings.maxGroupAttendees
      ) {
        toast({
          variant: "destructive",
          title: "Too Many Attendees",
          description:
            "The attendees being moved to this group exceeds the maximum number of attendees",
        });
        return;
      }
    }

    //PRESERVE THE ORIGINAL STATE IN CASE OF UI ROLLBACK
    const originalAttendees = attendees;
    const originalGolfTeeGroups = golfTeeGroups;

    startTransition(async () => {
      //PERFORM OPTIMISTIC UI UPDATE FOR ATTENDEES
      setOptimisticAttendees((prevAttendees) => {
        return prevAttendees.map((attendee) => {
          if (
            attendeesToMove.some(
              (attendeeToMove) =>
                attendeeToMove.attendee_id === attendee.attendee_id
            )
          ) {
            return { ...attendee, golf_tee_group_id: newGolfTeeGroupID };
          }
          //Return the original attendee if it doesn't need to be updated.
          return attendee;
        });
      });

      //PERFORM OPTIMISTIC UI UPDATE FOR GOLF TEE GROUPS
      setOptimisticGolfTeeGroups({
        type: "MOVE_MULTIPLE_ATTENDEES",
        payload: {
          attendeesToMove: attendeesToMove,
          newGolfTeeGroupID: newGolfTeeGroupID,
        },
      });

      //PREPARE THE DATA TO UPDATE THE ATTENDEES IN THE DATABASE
      const updatedAttendees = [];

      attendeesToMove.forEach((attendeeToMove) => {
        const updatedAttendee = attendees.find(
          (attendee) => attendee.attendee_id === attendeeToMove.attendee_id
        );
        updatedAttendee["golf_tee_group_id"] = newGolfTeeGroupID;

        updatedAttendees.push(updatedAttendee);
      });

      const { result, error } = await bulkUpdateAttendees(updatedAttendees);

      if (error) {
        toast({
          variant: "destructive",
          title: result,
          description: error,
        });
        //IF THERE'S AN ERROR UPDATING THE ATTENDEE GROUPS ON THE SERVER
        // ROLL BACK THE OPTIMISTIC UI UPDATES
        setOptimisticAttendees(originalAttendees);
        setOptimisticGolfTeeGroups(originalGolfTeeGroups);
      } else {
        setSelectedAttendees([]);
      }
    });
  };

  const moveHoles = async (fromHoleNum, toHoleNum) => {
    //PRESERVE THE ORIGINAL STATE IN CASE OF UI ROLLBACK
    const originalGolfTeeGroups = golfTeeGroups;

    startTransition(async () => {
      //PERFORM OPTIMISTIC UI UPDATE FOR GOLF TEE GROUPS
      setOptimisticGolfTeeGroups({
        type: "MOVE_HOLES",
        payload: {
          fromHoleNum: fromHoleNum,
          toHoleNum: toHoleNum,
        },
      });

      //PREPARE THE DATA TO UPDATE THE GOLF TEE GROUPS IN THE DATABASE
      const updatedGolfTeeGroups = rearrangeHoles(
        fromHoleNum,
        toHoleNum,
        golfTeeGroups
      ).map((group) => {
        return {
          golf_tee_group_id: group.golf_tee_group_id,
          event_id: group.event_id,
          hole_number: group.hole_number,
          hole_letter: group.hole_letter,
        };
      });

      const { result, error } = await bulkUpdateGolfTeeGroups(
        updatedGolfTeeGroups
      );

      if (error) {
        toast({
          variant: "destructive",
          title: result,
          description: error,
        });
        //IF THERE'S AN ERROR UPDATING THE ATTENDEE GROUPS ON THE SERVER
        // ROLL BACK THE OPTIMISTIC UI UPDATES

        setOptimisticGolfTeeGroups(originalGolfTeeGroups);
      }
    });
  };

  const removeAttendeeFromGroup = async (attendee) => {
    moveGolfers(attendee, null);
  };

  const resetAllAttendees = () => {
    moveGolfers(optimisticAttendees, null);
  };

  /***************************************************************************************
   *
   * START OF FUNCTIONS FOR HANDLERS USED FOR THE DRAG AND DROP FUNCTIONALITY
   *
   ****************************************************************************************/
  const [activeTransform, setActiveTransform] = useState(null);
  // Define Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // This is vital. Try different values or even just `event: 'onPointerDown'`
        // A small distance is often good to prevent accidental drags.
        distance: 5, // Requires pointer to move 5px before drag starts
        // or for very precise clicks, consider:
        // event: 'onPointerDown', // Drag starts immediately on pointer down
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dropAnimation = {
    duration: 0, // milliseconds, adjust as needed (e.g., 200, 300)
  };

  // --- onDragStart handler ---

  const handleDragStart = useCallback((event) => {
    setActiveTransform(event.active.transform);
    setActiveId(event.active.id);
    setActiveType(event.active.data.current?.type);
    setActiveItemData(event.active.data.current?.originalData || {});
  }, []);

  // --- onDragCancel handler ---
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveType(null);
    setActiveItemData(null);
  }, []);

  // --- onDragEnd handler ---
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    const type = event.active.data.current?.type;
    if (!over) {
      setActiveId(null);
      setActiveType(null);
      setActiveItemData(null);
      setActiveTransform(null);
      return;
    }

    if (type === "ATTENDEE") {
      const draggedAttendees = event.active.data.current?.data;
      const droppedGroup = over.id;

      //check first to make sure the dragged group wasn't dropped into it's original group
      if (droppedGroup === draggedAttendees[0].golf_tee_group_id) {
        return;
      }

      moveGolfers(draggedAttendees, droppedGroup);
    } else if (type === "HOLE") {
      const draggedHole = active.id;
      const droppedHole = over.id;

      if (draggedHole !== droppedHole) {
        moveHoles(draggedHole, droppedHole);
      }
    }

    setActiveType(null);
    setActiveItemData(null);
    setActiveTransform(null);
  };

  // Function to render the item in the DragOverlay
  const renderDragOverlayContent = () => {
    if (!activeId || !activeType || !activeItemData) return null;

    const { rect, ...originalData } = activeItemData;
    const overlayStyle = {
      // These ensure the overlay matches the original item's dimensions
      width: rect ? rect.width : "auto",
      height: rect ? rect.height : "auto",
      // Apply the dnd-kit transform
      transform: activeTransform
        ? `translate3d(${activeTransform.x}px, ${activeTransform.y}px, 0)`
        : "none", // Use CSS.Transform.toString(activeTransform) for more complex cases
      // Other visual styles for the overlay
      backgroundColor: "white",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      opacity: 0.9,
      cursor: "grabbing",
      // Important: To make it appear directly under the cursor's initial grab point,
      // you might need to adjust `x` and `y` from `activeTransform` based on
      // where the mouse clicked relative to the item's top-left corner.
      // However, dnd-kit usually handles this if you apply the transform correctly.
      // The key is often the `event.active.rect.current.initial` `x` and `y`
      // which represent the item's top-left corner. The `transform` then moves it from there.
    };

    if (activeType === "ATTENDEE") {
      if (isAttendeesLinked) {
        const activeAttendees = optimisticAttendees.filter(
          (attendee) => attendee.registration_group_id === activeId
        );

        if (!activeAttendees) return null;

        return (
          <div className="grid grid-cols-6 items-center " style={overlayStyle}>
            <div className="col-span-1">
              <Grip className="cursor-grab opacity-50 hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200" />
            </div>
            <div className="col-span-5">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  {activeAttendees.map((attendee) => (
                    <p key={attendee.attendee_id} className="text-md">
                      {attendee.first_name} {attendee.last_name}
                    </p>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="h-6 w-6 p-1 rounded-full"
                  onClick={() => removeAttendeeFromGroup(attendee.attendee_id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      } else {
        const attendee = optimisticAttendees.find(
          (attendee) => attendee.attendee_id === activeId
        );
        if (!attendee) return null; // Should not happen

        return (
          <div className="grid grid-cols-6 " style={overlayStyle}>
            <div className="col-span-1">
              <Grip className="cursor-grab opacity-50 hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200" />
            </div>
            <div className="col-span-5">
              <div className="flex justify-between items-center">
                <span key={attendee.attendee_id} className="text-md">
                  {attendee.first_name} {attendee.last_name}
                </span>
                <Button
                  variant="ghost"
                  className="h-6 w-6 p-1 rounded-full"
                  onClick={() => removeAttendeeFromGroup(attendee.attendee_id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      }
    } else if (activeType === "HOLE") {
      const hole = activeId;
      return (
        <div className="flex flex-col">
          <div className="flex justify-center py-3">
            <Grip />
          </div>
          <div>
            <CardContent>
              {getGroupsByHoleNumber(hole).map((group) => (
                <div key={group.golf_tee_group_id} className="mb-2">
                  <Badge className="font-normal mb-2">{`Group ${group.hole_letter}`}</Badge>
                  <div className="flex flex-col gap-3">
                    {group.attendee.length > 0 ? (
                      isAttendeesLinked ? (
                        group.attendee.map((attendeeArray) => (
                          <Draggable
                            id={attendeeArray[0].registration_group_id}
                            type={"ATTENDEE"}
                            key={attendeeArray[0].registration_group_id}
                            data={attendeeArray}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                {attendeeArray.map((attendee) => (
                                  <p
                                    key={attendee.attendee_id}
                                    className="text-md"
                                  >
                                    {attendee.first_name} {attendee.last_name}
                                  </p>
                                ))}
                              </div>

                              <Button
                                variant="ghost"
                                className="h-6 w-6 p-1 rounded-full"
                                onClick={() =>
                                  removeAttendeeFromGroup(attendeeArray)
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </Draggable>
                        ))
                      ) : (
                        group.attendee.map((attendee) => (
                          <Draggable
                            id={attendee.attendee_id}
                            type={"ATTENDEE"}
                            key={attendee.attendee_id}
                            data={[attendee]}
                          >
                            <div className="flex justify-between items-center">
                              <span
                                key={attendee.attendee_id}
                                className="text-md"
                              >
                                {attendee.first_name} {attendee.last_name}
                              </span>
                              <Button
                                variant="ghost"
                                className="h-6 w-6 p-1 rounded-full"
                                onClick={() =>
                                  removeAttendeeFromGroup([attendee])
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </Draggable>
                        ))
                      )
                    ) : (
                      <p>Empty</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </div>
        </div>
      );
    }
    return null;
  };

  /***************************************************************************************
   *
   * END OF FUNCTIONS FOR HANDLERS USED FOR THE DRAG AND DROP FUNCTIONALITY
   *
   ****************************************************************************************/
  return (
    <div className="w-full pb-10 px-10">
      <div className=" py-10 flex justify-between">
        <span className="text-4xl font-bold">Tee Assignments</span>
        <div className="flex gap-3">
          <Button
            disabled={!curEvent.is_current_event}
            onClick={resetAllAttendees}
          >
            Reset Assignments
          </Button>
        </div>
      </div>

      {/* THIS IS THE MAIN ASSIGNMENT SECTION */}
      <div className="grid gap-6 grid-cols-12">
        {/* THIS IS THE ATTENDEE SECTION SECTION */}
        <Card className="col-span-12 md:col-span-4">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Attendees</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleIsAttendeesLinked()}
              >
                {isAttendeesLinked ? <Link /> : <Unlink />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea>
              <div className="h-[350px] flex flex-col gap-2">
                {availableAttendees.map((attendee) => (
                  <div
                    key={attendee.attendee_id}
                    className="p-1 flex gap-3 items-center border-2"
                  >
                    <Checkbox
                      checked={selectedAttendees.some(
                        (selectedAttendee) =>
                          selectedAttendee.attendee_id === attendee.attendee_id
                      )}
                      onCheckedChange={() => toggleAttendee(attendee)}
                    />
                    <span>{`${attendee.first_name} ${attendee.last_name}`}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-4 p-3 bg-muted rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">
                  Selected Attendees: {selectedAttendees.length}
                </h3>
                {selectedAttendees.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAttendees([])}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedAttendees.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No attendees selected
                  </p>
                ) : (
                  selectedAttendees.map((id) => {
                    const selectedAttendee = attendees.find(
                      (attendee) => attendee.attendee_id === id
                    );
                    return selectedAttendee ? (
                      <Badge key={id} className="font-normal">
                        {`${selectedAttendee.first_name} ${selectedAttendee.last_name}`}
                      </Badge>
                    ) : null;
                  })
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="holeSelect">Assign to Hole</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger id="groupSelect" className="mt-1">
                  <SelectValue placeholder="Select hole" />
                </SelectTrigger>
                <SelectContent>
                  {golfTeeGroups.map((group) => (
                    <SelectItem
                      key={group.golf_tee_group_id}
                      value={group.golf_tee_group_id}
                    >
                      Group {group.hole_number}
                      {group.hole_letter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button className="mt-5 w-full" onClick={assignGolfers}>
                Assign Golfers
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Hole Assignments */}
        <Card className="col-span-12 md:col-span-8">
          <CardHeader>
            <CardTitle>Hole Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <DndContext
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              onDragCancel={handleDragCancel}
              sensors={sensors}
            >
              {/* --- DragOverlay must be inside DndContext --- */}
              {activeId &&
                createPortal(
                  <DragOverlay dropAnimation={dropAnimation}>
                    {renderDragOverlayContent()}
                  </DragOverlay>,
                  document.body
                )}
              {/* ------------------------------------------- */}
              <SortableContext items={numHolesArray}>
                <div className="grid md:grid-cols-2 lg:grid_cols-2 gap-3">
                  {numHolesArray.map((hole, index) => {
                    return (
                      <Card key={hole}>
                        <CardHeader className="bg-stm-red text-white mb-2 p-2 text-center">
                          <CardTitle>Hole {hole}</CardTitle>
                        </CardHeader>
                        <SortableDiv id={hole} index={index + 1} type={"HOLE"}>
                          <CardContent>
                            {getGroupsByHoleNumber(hole).map((group) => (
                              <Droppable
                                id={group.golf_tee_group_id}
                                key={group.golf_tee_group_id}
                              >
                                <div className="mb-2">
                                  <Badge className="font-normal mb-2">{`Group ${group.hole_letter}`}</Badge>
                                  <div className="flex flex-col gap-3">
                                    {group.attendee.length > 0 ? (
                                      isAttendeesLinked ? (
                                        group.attendee.map((attendeeArray) => (
                                          <Draggable
                                            id={
                                              attendeeArray[0]
                                                .registration_group_id
                                            }
                                            type={"ATTENDEE"}
                                            key={
                                              attendeeArray[0]
                                                .registration_group_id
                                            }
                                            data={attendeeArray}
                                          >
                                            <div className="flex justify-between items-center">
                                              <div className="flex flex-col">
                                                {attendeeArray.map(
                                                  (attendee) => (
                                                    <p
                                                      key={attendee.attendee_id}
                                                      className="text-md"
                                                    >
                                                      {attendee.first_name}{" "}
                                                      {attendee.last_name}
                                                    </p>
                                                  )
                                                )}
                                              </div>

                                              <Button
                                                variant="ghost"
                                                className="h-6 w-6 p-1 rounded-full"
                                                onClick={() =>
                                                  removeAttendeeFromGroup(
                                                    attendeeArray
                                                  )
                                                }
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </Draggable>
                                        ))
                                      ) : (
                                        group.attendee.map((attendee) => (
                                          <Draggable
                                            id={attendee.attendee_id}
                                            type={"ATTENDEE"}
                                            key={attendee.attendee_id}
                                            data={[attendee]}
                                          >
                                            <div className="flex justify-between items-center">
                                              <span
                                                key={attendee.attendee_id}
                                                className="text-md"
                                              >
                                                {attendee.first_name}{" "}
                                                {attendee.last_name}
                                              </span>
                                              <Button
                                                variant="ghost"
                                                className="h-6 w-6 p-1 rounded-full"
                                                onClick={() =>
                                                  removeAttendeeFromGroup([
                                                    attendee,
                                                  ])
                                                }
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </Draggable>
                                        ))
                                      )
                                    ) : (
                                      <p>Empty</p>
                                    )}
                                  </div>
                                </div>
                              </Droppable>
                            ))}
                          </CardContent>
                        </SortableDiv>
                      </Card>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeeAssignmentSection;
