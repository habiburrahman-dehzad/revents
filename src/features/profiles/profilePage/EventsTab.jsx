import React, { useState } from 'react';
import { Tab, Grid, Header, Card, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import useFirestoreCollection from '../../../app/hooks/useFirestoreCollection';
import { getUserEventsQuery } from '../../../app/firestore/firestoreService';
import { listenToUserEvents } from '../profileActions';

const panes = [
  { menuItem: 'Future Events', pane: { key: 'future' } },
  { menuItem: 'Past Events', pane: { key: 'past' } },
  { menuItem: 'Hosting', pane: { key: 'hosting' } }
];

const EventsTab = ({profile}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const {profileEvents} = useSelector(state => state.profile);
  const {loading} = useSelector(state => state.async);

  useFirestoreCollection({
    query: () => getUserEventsQuery(activeTab, profile.id),
    data: events => dispatch(listenToUserEvents(events)),
    deps: [dispatch, activeTab, profile.id]
  });

  return (
    <Tab.Pane loading={loading}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='calendar' content={'Events'} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => setActiveTab(data.activeIndex)}
          />
          <br />
          <Card.Group itemsPerRow={5} style={{marginTop: 10}}>
            {profileEvents.map((event) => (
              <Card
                as={Link}
                to={`/events/${event.id}`}
                key={event.id}
              >
                <Image
                  src={`/assets/categoryImages/${event.category.toLowerCase()}.jpg`}
                  style={{ minHeight: 100, objectFit: 'cover' }}
                />
                <Card.Content>
                  <Card.Header textAlign='center'>{event.title}</Card.Header>
                  <Card.Meta textAlign='center'>
                    <div>{format(event.date, 'dd MMM yyyy')}</div>
                    <div>{format(event.date, 'h:mm a')}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default EventsTab;