import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, Users, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const AttendeeList = ({ attendeesToAdd, removeAttendeeFromList }) => {
  return (
    <>
      {attendeesToAdd.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                No attendees added yet. Use the form above to add your first
                attendee.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Attendees ({attendeesToAdd.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendeesToAdd.map((attendee) => (
                <div
                  key={attendee.attendee_id}
                  className="border rounded-lg p-4 bg-muted/50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {attendee.first_name} {attendee.last_name}
                      </h3>

                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {attendee.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{attendee.email}</span>
                          </div>
                        )}

                        {attendee.phone_number && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{attendee.phone_number}</span>
                          </div>
                        )}

                        {(attendee.address1 ||
                          attendee.city ||
                          attendee.state ||
                          attendee.zip) && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {[
                                attendee.address1,
                                attendee.address2,
                                attendee.city,
                                attendee.state,
                                attendee.zip,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        removeAttendeeFromList(attendee);
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AttendeeList;
