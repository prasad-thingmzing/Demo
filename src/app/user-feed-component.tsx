import React, {FunctionComponent, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getFeeds, getListenerFeed, IPost} from './user-feed.service';
const UserFeedComponent: FunctionComponent = ({}: {}) => {
  const defaultPosts: IPost[] = [];
  const [posts, setPosts] = useState(defaultPosts);
  const [error, setError] = useState('');
  useEffect(() => {
    //cached result - this is also taking time now.
    getListenerFeed({
      onPostsUpdate(posts: IPost[]) {
       // console.log(posts);
        setPosts(posts);
      },
    });
    getFeeds().remoteResult.then(result => {
      //Do nothing. Just api call and forget
    });
  }, []);

  return (
    <View>
      {posts.map(post => (
        <View key={post.id}>
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
