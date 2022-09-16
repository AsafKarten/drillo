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
        if(user.value.customData.userType === "driller")
          return "driller";
        if(user.value.customData.userType === "site manager")
           return "site manager";
           
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
    };

     //create account email & password function
     //fix forced logout problem
     const createEmployeeAccount =async (email:string, password:string,first:string,last:string, userType:string, organizationID:string) => {
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
        {userID: app?.currentUser?.id, first, last,userType,organizationID}
      );

    //Refresh a user's custom data to make sure we have the latest version
    await app?.currentUser?.refreshCustomData();
    user.value = app?.currentUser
    console.log(user.value);
    
      return true;
};

const getAllEmployees = async()=>{
  // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("users");
  // 3. Read and write data with MongoDB queries
  
  return await collection?.find({})
}

const deleteEmployeeFromDB = async() =>{
  //await app.deleteUser();
  console.log(app.currentUser);
  
}

    const getProject =async () => {
      
        // 1. Get a data source client
        const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
        // 2. Get a database & collection
        const collection = mongodb?.db("drillo").collection("projects");
        // 3. Read and write data with MongoDB queries
        
        return await collection?.findOne({})
      
    }


    const getProjectByID =async (id:string) => {
      
      // 1. Get a data source client
      const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
      // 2. Get a database & collection
      const collection = mongodb?.db("drillo").collection("projects");
      // 3. Read and write data with MongoDB queries
      const query = { "_id":id };
      return await collection?.findOne(query)
    
  }


     //create new project
    const createNewProject =async (organizationID: object , name: string, address:string, client:string,contactPerson:object, pits:[], reports:[]) => {
   
      try {
        // 1. Get a data source client
        const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
        // 2. Get a database & collection
        const collection = mongodb?.db("drillo").collection("projects");
        // 3. Read and write data with MongoDB queries
        collection?.insertOne({organizationID,name, address, client,contactPerson, pits,reports,creationDate:new Date()});
        return true;


      } catch (error) {
console.log(error);

          }
    };

    const updateProjectPits =async (project : any) => {
        try {
                  // 1. Get a data source client
        const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
        // 2. Get a database & collection
        const collection = mongodb?.db("drillo").collection("projects");
        // 3. Read and write data with MongoDB queries
        const query = { "_id": project._id };
        const update = {
          "$set": {
           "pits": project.pits,
           "reports":project.reports,
              }
          };
          const options = { "upsert": false };
          collection?.updateOne(query, update, options)
          .then(result => {
           const { matchedCount, modifiedCount } = result;
           if(matchedCount && modifiedCount) {
           console.log(`Successfully updated the item.`)
    }
  })
          
        } catch (error) {
          console.log(error);
          
        }
    }

    const updateProjectDrillers =async (project : any) => {
      try {
                // 1. Get a data source client
      const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
      // 2. Get a database & collection
      const collection = mongodb?.db("drillo").collection("projects");
      // 3. Read and write data with MongoDB queries
      const query = { "_id": project._id };
      const update = {
        "$set": {
         "drillers": project.drillers
            }
        };
        const options = { "upsert": false };
        collection?.updateOne(query, update, options)
        .then(result => {
         const { matchedCount, modifiedCount } = result;
         if(matchedCount && modifiedCount) {
         console.log(`Successfully updated the item.`)
  }
})
        
      } catch (error) {
        console.log(error);
        
      }
  }
  
  const updateProjectSiteManagers =async (project : any) => {
    try {
              // 1. Get a data source client
    const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
    // 2. Get a database & collection
    const collection = mongodb?.db("drillo").collection("projects");
    // 3. Read and write data with MongoDB queries
    const query = { "_id": project._id };
    const update = {
      "$set": {
       "site_managers": project.site_managers
          }
      };
      const options = { "upsert": false };
      collection?.updateOne(query, update, options)
      .then(result => {
       const { matchedCount, modifiedCount } = result;
       if(matchedCount && modifiedCount) {
       console.log(`Successfully updated the item.`)
}
})
      
    } catch (error) {
      console.log(error);
      
    }
}

const updateProjectMachines =async (project : any) => {
  try {
            // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("projects");
  // 3. Read and write data with MongoDB queries
  const query = { "_id": project._id };
  const update = {
    "$set": {
     "machines": project.machines
        }
    };
    const options = { "upsert": false };
    collection?.updateOne(query, update, options)
    .then(result => {
     const { matchedCount, modifiedCount } = result;
     if(matchedCount && modifiedCount) {
     console.log(`Successfully updated the item.`)
}
})
    
  } catch (error) {
    console.log(error);
    
  }
}

const updateProjectExternalServices =async (project : any) => {
  try {
            // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("projects");
  // 3. Read and write data with MongoDB queries
  const query = { "_id": project._id };
  const update = {
    "$set": {
     "external_services": project.external_services
        }
    };
    const options = { "upsert": false };
    collection?.updateOne(query, update, options)
    .then(result => {
     const { matchedCount, modifiedCount } = result;
     if(matchedCount && modifiedCount) {
     console.log(`Successfully updated the item.`)
}
})
    
  } catch (error) {
    console.log(error);
    
  }
}
    
    const getAllProjects = async()=>{
            // 1. Get a data source client
            const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
            // 2. Get a database & collection
            const collection = mongodb?.db("drillo").collection("projects");
            // 3. Read and write data with MongoDB queries
            
            return await collection?.find({})
    }
     //create new project
     const createNewDrillingMachine =async (name: string, type:string, model:string, organizationID:string) => {
   
      try {
        // 1. Get a data source client
const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
// 2. Get a database & collection
const collection = mongodb?.db("drillo").collection("drilling_machines");
// 3. Read and write data with MongoDB queries
collection?.insertOne({name, type, model, organizationID});
return true;


} catch (error) {
console.log(error);

}
};


   
    const getAllDrillingMachines = async()=>{
            // 1. Get a data source client
            const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
            // 2. Get a database & collection
            const collection = mongodb?.db("drillo").collection("drilling_machines");
            // 3. Read and write data with MongoDB queries
            
            return await collection?.find({})
    }

    const getAllOrganizations= async()=>{
      // 1. Get a data source client
      const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
      // 2. Get a database & collection
      const collection = mongodb?.db("drillo").collection("organization");
      // 3. Read and write data with MongoDB queries
      
      return await collection?.find({})
}

const uploadFile = async (file:BinaryData)=>{
  // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
const collection = mongodb?.db("drillo").collection("files");
// 3. Read and write data with MongoDB queries
collection?.insertOne({file});
return true;
}

    return{
        isLoggedIn,
        user,
        //functions
        login,
        logout,
        createAccount,
        createEmployeeAccount,
        getAllEmployees,
        deleteEmployeeFromDB ,
        getProject,
        getProjectByID,
        createNewProject,
        updateProjectPits,
        updateProjectMachines,
        updateProjectExternalServices,
        updateProjectDrillers,
        updateProjectSiteManagers,
        getAllProjects,
        createNewDrillingMachine,
        getAllDrillingMachines, 
        getAllOrganizations,
        uploadFile,
        
    };
};
