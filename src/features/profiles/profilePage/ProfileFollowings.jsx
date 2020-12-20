import React from "react";
import { Tab, Grid, Header, Card } from "semantic-ui-react";
import ProfileCard from "./ProfileCard";

const ProfileFollowings = () => {

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={`People following displayName`}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
              <ProfileCard />
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default ProfileFollowings;
