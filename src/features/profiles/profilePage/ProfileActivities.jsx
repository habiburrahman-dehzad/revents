import React from 'react';
import { Tab, Grid, Header, Card, Image } from 'semantic-ui-react';

const panes = [
  { menuItem: 'Future Events', pane: { key: 'futureEvents' } },
  { menuItem: 'Past Events', pane: { key: 'pastEvents' } },
  { menuItem: 'Hosting', pane: { key: 'hosted' } }
];

const ProfileEvents = () => {
    return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='calendar' content={'Activities'} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
          />
          <br />
          <Card.Group itemsPerRow={4}>
              <Card
              >
                <Image
                  src={`/assets/categoryImages/culture.jpg`}
                  style={{ minHeight: 100, objectFit: 'cover' }}
                />
                <Card.Content>
                  <Card.Header textAlign='center'>Title</Card.Header>
                  <Card.Meta textAlign='center'>
                    <div>Date</div>
                    <div>Date</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default ProfileEvents;
