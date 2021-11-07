import Realm, {ObjectSchema} from 'realm';

export const POSTS_SCHEMA = 'posts';
export const PostsSchema: ObjectSchema = {
  name: POSTS_SCHEMA,
  properties: {
    userId: 'int',
    id: 'int',
    title: 'string',
    body: 'string',
  },
  primaryKey: 'id',
};
export const databaseOptions = {
  path: 'thingmzing-app.realm',
  schema: [PostsSchema],
  schemaVersion: 1,
};


