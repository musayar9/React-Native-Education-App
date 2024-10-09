import {
  Client,
  Account,
  Avatars,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "6703af19000888fe8245",
  databaseId: "6704cef2002065054ad6",
  userCollectionId: "6704cf37000c1db5aab5",
  videoCollectionId: "6704cf6d0013d27c66e0",
  storageId: "6704d162001d6c867674",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

type Username = {
  username: string;
};

type UserInfo = {
  email: string;
  password: string;
};

type UserDetails = UserInfo & Username;

export const createUser = async ({
  username,
  email,
  password,
}: UserDetails) => {
  try {
    const response = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!response) throw Error;

    const avatarUrl = avatars.getInitials(username);

    console.log(response, "response");
    await signIn({ email, password });

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: response.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.error(error);

    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: UserInfo) => {
 try {
   // Mevcut oturumu kontrol et
   const session = await account.getSession("current");
   if (session) {
     console.log("Kullanıcı zaten oturum açmış");
     return;
   }
 } catch (error) {
   if (error?.code !== 401) {
     // 401: Session not found
     console.error("Oturum kontrol hatası:", error);
     return;
   }
 }
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null
  }
};
