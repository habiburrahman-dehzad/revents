import React from 'react';
import { Tab } from 'semantic-ui-react';
import ProfileActivities from './ProfileActivities';
import AboutTab from './AboutTab';
import ProfileFollowings from './ProfileFollowings';
import ProfilePhotos from './ProfilePhotos';

const ProfileContent = ({ profile, isCurrentUser }) => {
  const panes = [
    {
      menuItem: 'About',
      render: () => (
        <AboutTab profile={profile} isCurrentUser={isCurrentUser} />
      ),
    },
    { menuItem: 'Photos', render: () => <ProfilePhotos /> },
    {
      menuItem: 'Activities',
      render: () => <ProfileActivities />,
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
