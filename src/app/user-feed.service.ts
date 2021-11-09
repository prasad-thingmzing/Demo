import axios from 'axios';
import {databaseOptions, POSTS_SCHEMA} from './database';
import Realm from 'realm';
export interface IPost {
  id: number;
  userId?: number;
  title: string;
  body: string;
}
export interface IDBEvents {
  onPostsUpdate(posts: IPost[]): void;
}

export const getListenerFeed = (dbEvent: IDBEvents): any => {
  let realmRef: Realm;
  Realm.open(databaseOptions).then(lRealm => {
    realmRef = lRealm;
    lRealm.objects(POSTS_SCHEMA).addListener((objectCollection, changeset) => {
      console.log('posts changed '); //--
      console.log(objectCollection); //--
      let feedArray: IPost[] = [];

      objectCollection.forEach(value => {
        const post: IPost = {
          body: value.body,
          id: value.id,
          title: value.title,
          userId: value.userId,
        };

        feedArray.push(post);
      });
      console.log(feedArray);

      dbEvent.onPostsUpdate(feedArray);
    });

    /* whole db change event
    realml.addListener('change', (sender, event) => {
      console.log(sender); //--
      console.log(event); //--
    });*/
  });
  // cleanup function
  return () => {
    // Remember to remove the listener when you're done!
    realmRef.removeAllListeners();
    // Call the close() method when done with a realm instance to avoid memory leaks.
    realmRef.close();
  };
};

//remoteResult - gets the feed from remote server and saves it to db
export const getFeeds = (): {
  remoteResult: Promise<{data: string; status: string} | void>;
  cachedResult: Promise<any>;
} => {
  let result: {data: string; status: string};

  const catched = Realm.open(databaseOptions).then(realm => {
    console.log('size' + realm.objects(POSTS_SCHEMA).length);
    return realm.objects(POSTS_SCHEMA);
  });

  const remoteResult = axios
    .get<IPost[]>(
      'https://run.mocky.io/v3/6d18029b-bdd1-4717-8442-663eb4a6b973',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then(async response => {
      result = {data: response.data, status: 'success'};
      console.log(result);
      Realm.open(databaseOptions).then(realm => {
        console.log('size' + realm.objects(POSTS_SCHEMA).length);
        realm.write(() => {
          result.data.forEach(obj => {
            realm.create(POSTS_SCHEMA, obj);
          });
          console.log('size' + realm.objects(POSTS_SCHEMA).length);
        });
      });
      return result;
    })
    .catch(ex => {
      const error =
        ex.response.status === 404
          ? 'Resource Not found'
          : 'An unexpected error has occurred';
      result = {data: error, status: 'failure'};
    });

  let resultHolder = {cachedResult: catched, remoteResult: remoteResult};
  return resultHolder;
};
