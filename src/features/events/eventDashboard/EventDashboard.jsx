import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import { sampleData } from "../../../app/api/sampleData";
import EventList from "./EventList";

const EventDashboard = () => {
  const [events, setEvents] = useState(sampleData);

  // const handleCreateEvent = (event) => {
  //   setEvents([...events, event]);
  // };

  // const handleUpdateEvent = (updatedEvent) => {
  //   setEvents(events.map(evt => evt.id === updatedEvent.id ? updatedEvent : evt));
  // }

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(evt => evt.id !== eventId));
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventList events={events} deleteEvent={handleDeleteEvent} />
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>event filters</h2>
      </Grid.Column>
    </Grid>
  );
};

export default EventDashboard;
