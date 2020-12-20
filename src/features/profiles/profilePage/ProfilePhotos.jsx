import React from 'react';
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';

const ProfilePhotos = () => {
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated='left' icon='image' content='Photos' />
          <Button floated='right' basic content='Add Photo' />
        </Grid.Column>
        <Grid.Column width={16}>
          {false ? (
            <h1>Upload widget</h1>
          ) : (
            <Card.Group itemsPerRow={5}>
              <Card>
                <Image src='/assets/user.png' />
                <Button.Group fluid width={2} compact>
                  <Button name='user.png' basic positive content='Main' />
                  <Button name='trash.png' basic negative icon='trash' />
                </Button.Group>
              </Card>
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default ProfilePhotos;
