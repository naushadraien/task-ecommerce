export type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar?: {
    url: string;
    localPath: string;
  };
};
