export interface ISession {
  address: string;
  userName: string | undefined | null;
  collections: { address: string; collection_name: string | null }[] | undefined;
}
