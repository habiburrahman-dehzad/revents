import React from 'react';
import { Card, Image, Icon} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const ProfileCard = () => {
  return (
    <Card as={Link} to={`/profile/clark`}>
      <Image src={'/assets/user.png'} />
      <Card.Content>
        <Card.Header>display name</Card.Header>
      </Card.Content>
      <Card.Content extra>
        <div>
          <Icon name='user' />
          10 Followers
        </div>
      </Card.Content>
    </Card>
  );
};

export default ProfileCard;
