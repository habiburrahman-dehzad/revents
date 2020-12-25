import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Grid, Header, Card } from 'semantic-ui-react';
import {
  getFollowersCollection,
  getFollowingCollection,
} from '../../../app/firestore/firestoreService';
import useFirestoreCollection from '../../../app/hooks/useFirestoreCollection';
import { listenToFollowers, listenToFollowings } from '../profileActions';
import ProfileCard from './ProfileCard';

const FOLLOWERS_TAB_INDEX = 3;
const FOLLOWINGS_TAB_INDEX = 4;

const FollowingTab = ({ profile, activeTab }) => {
  const dispatch = useDispatch();
  const { followings, followers } = useSelector((state) => state.profile);

  useFirestoreCollection({
    query:
      activeTab === FOLLOWERS_TAB_INDEX
        ? () => getFollowersCollection(profile.id)
        : () => getFollowingCollection(profile.id),
    data: (data) =>
      activeTab === FOLLOWERS_TAB_INDEX
        ? dispatch(listenToFollowers(data))
        : dispatch(listenToFollowings(data)),
    deps: [activeTab, dispatch],
  });

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated='left'
            icon='user'
            content={
              activeTab === FOLLOWERS_TAB_INDEX
                ? `People following ${profile.displayName}` 
                : `People followed by ${profile.displayName}`
            }
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
            {activeTab === FOLLOWERS_TAB_INDEX &&
              followers.map((follower) => (
                <ProfileCard profile={follower} key={follower.id} />
              ))}
            {activeTab === FOLLOWINGS_TAB_INDEX &&
              followings.map((following) => (
                <ProfileCard profile={following} key={following.id} />
              ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default FollowingTab;
