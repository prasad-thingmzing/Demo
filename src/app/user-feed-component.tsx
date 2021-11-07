import React, {FunctionComponent, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getFeeds, IPost} from './user-feed.service';
const UserFeedComponent: FunctionComponent = ({}: {}) => {
  const defaultPosts: IPost[] = [];
  const [posts, setPosts] = useState(defaultPosts);
  const [error, setError] = useState('');
  useEffect(() => {

    //cached result - this is also taking time now.
    getFeeds().cachedResult.then(items => {
      let feedArray: IPost[] = [];

      items.forEach(r => {
        const value = r.toJSON();
        const post: IPost = {
          body: value.body,
          id: value.id,
          title: 'FROM DB- ' + value.title,
          userId: value.userId,
        };

        feedArray.push(post);
      });
      setPosts(feedArray);
    });
    getFeeds().remoteResult.then(result => {
      //delayed for 10 secs
      setTimeout(() => {
        result.status === 'success'
          ? setPosts(result.data)
          : setError(result.data);
      }, 10000);
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
