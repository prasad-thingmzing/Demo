import axios from 'axios';
import {databaseOptions, POSTS_SCHEMA} from './database';
import Realm from 'realm';
export interface IPost {
  id: number;
  userId?: number;
  title: string;
  body: string;
}
export const getFeeds = (): {
  remoteResult: Promise<{data: string; status: string} | void>;
  cachedResult: Promise<any>;
} => {
  let result: {data: string; status: string};

  const catched = Realm.open(databaseOptions).then(realm => {
    console.log('size' + realm.objects(POSTS_SCHEMA).length);
    const res = realm.objects(POSTS_SCHEMA);
    const feedArray: IPost[] = [];
    res.forEach(r => {
      const value = r.toJSON();
      const post: IPost = {
        body: value.body,
        id: value.id,
        title: 'FROM DB- ' + value.title,
        userId: value.userId,
      };

      feedArray.push(post);
    });

    return feedArray;
    // console.log('saved');
    //console.log(res.forEach(item => console.log(item)));
  });

  const remoteResult = axios
    .get<IPost[]>('https://jsonplaceholder.typicode.com/posts', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
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
