import React, {FunctionComponent, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getFeeds, IPost} from './user-feed.service';
const UserFeedComponent: FunctionComponent = ({}: {}) => {

  const defaultPosts: IPost[] = [];
  const [posts, setPosts] = useState(defaultPosts);
  const [error, setError] = useState('');
  useEffect(() => {

    getFeeds().cachedResult.then(items=>setPosts(items));
    getFeeds().remoteResult.then(result=>{
      result.status === 'success'? setPosts(result.data): setError(result.data);
    });

  }, []);

  return (
    <View>
      {posts.map(post => (
        <View>
          <Text style={styles.sectionTitle}>{post.title}</Text>
          <Text style={styles.sectionDescription}>{post.body}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default UserFeedComponent;
