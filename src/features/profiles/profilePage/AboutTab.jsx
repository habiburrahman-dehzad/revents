import { format } from 'date-fns';
import React, { useState } from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import ProfileEditForm from './ProfileEditForm';

const AboutTab = ({ profile, isCurrentUser }) => {
  const [editMode, setEditMode] = useState(false);
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header
            floated='left'
            icon='user'
            content={`About ${profile.displayName}`}
          />
          {isCurrentUser && (
            <Button
              onClick={() => setEditMode(!editMode)}
              floated='right'
              basic
              content={editMode ? 'Cancel' : 'Edit Profile'}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <ProfileEditForm profile={profile} setEditMode={setEditMode} />
          ) : (
            <>
              <div style={{ marginBottom: 10 }}>
                <strong>
                  Member since: {format(profile.createdAt, 'dd MMM yyyy')}
                </strong>
                <div>{profile.description || null}</div>
              </div>
            </>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default AboutTab;
