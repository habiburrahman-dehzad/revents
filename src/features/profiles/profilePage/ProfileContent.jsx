import React from 'react';
import { Tab } from 'semantic-ui-react';
import EventsTab from './EventsTab';
import AboutTab from './AboutTab';
import ProfileFollowings from './ProfileFollowings';
import PhotosTab from './PhotosTab';

const ProfileContent = ({ profile, isCurrentUser }) => {
  const panes = [
    {
      menuItem: 'About',
      render: () => (
        <AboutTab profile={profile} isCurrentUser={isCurrentUser} />
      ),
    },
    {
      menuItem: 'Photos',
      render: () => (
        <PhotosTab profile={profile} isCurrentUser={isCurrentUser} />
      ),
    },
    {
      menuItem: 'Events',
      render: () => <EventsTab profile={profile} />,
    },
    { menuItem: 'Followers', render: () => <ProfileFollowings /> },
    { menuItem: 'Following', render: () => <ProfileFollowings /> },
  ];

  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition='right'
      panes={panes}
    />
  );
};

export default ProfileContent;
