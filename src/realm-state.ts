import * as Realm from 'realm-web';
import {computed, ref} from 'vue';
const user = ref<any>(null);

//get app instance
const app = Realm.getApp("application-0-sliwo");
user.value = app?.currentUser;

export const useAppState = () => {
    const isLoggedIn = computed(()=>user.value !== null);

    //login email & password function
    const login =async (email:string, password: string) => {
        const credentials = Realm.Credentials.emailPassword(email, password);
        await app.logIn(credentials);

        //Refresh a user's custom data to make sure we have the latest version
        await app?.currentUser?.refreshCustomData();
        user.value = app?.currentUser
        return true;
    };

    //logout function
    const logout =async () => {
        await app.currentUser?.logOut();
        //assign logged out user
        user.value = null;
        return true;
    };

    //create account email & password function
    const createAccount =async (email:string, password:string,first:string,last:string) => {
          //Create user
          await app.emailPasswordAuth.registerUser(email, password)
          // Authenticate the user
          await app.logIn(
            Realm.Credentials.emailPassword(email, password)
          )
          // save profile info
          const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
          const collection = mongodb?.db("drillo").collection("users");
          await collection?.insertOne(
            {userID: app?.currentUser?.id, first, last}
          );

        //Refresh a user's custom data to make sure we have the latest version
        await app?.currentUser?.refreshCustomData();
        user.value = app?.currentUser
          return true;
    }


    return{
        isLoggedIn,
        user,
        //functions
        login,
        logout,
        createAccount,
    };
};
