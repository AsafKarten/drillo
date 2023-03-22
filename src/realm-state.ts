import * as Realm from 'realm-web';
import {computed, ref} from 'vue';
const user = ref<any>(null);

//get app instance
const app = Realm.getApp("application-0-sliwo");
user.value = app?.currentUser;

export const useAppState = () => {
    const isLoggedIn = computed(()=>user.value !== null);

    const getOrganizationData = async () =>{
        // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("organization");
  // 3. Read and write data with MongoDB queries
  const organizationID = user?.value.customData.organizationID
  return await collection?.findOne({ _id: organizationID })
    }

    //login email & password function
    const login =async (email:string, password: string) => {
        const credentials = Realm.Credentials.emailPassword(email, password);
        await app.logIn(credentials);

        //Refresh a user's custom data to make sure we have the latest version
        await app?.currentUser?.refreshCustomData();
        user.value = app?.currentUser
        if(user.value.customData.organizationID == ""){
          //await deleteUserData(user.value.customData._id)
          await app?.deleteUser(user.value)
          return "deleted"
        }

        if(user.value.customData.userType === "driller")
          return "driller";
      
           
        return true;
    };

    const deleteUserData =async (id : any) => {
      try {
                // 1. Get a data source client
      const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
      // 2. Get a database & collection
      const collection = mongodb?.db("drillo").collection("users");
      // 3. Read and write data with MongoDB queries
      const query = { "_id": id };
  
      collection?.deleteOne(query)
        
      } catch (error) {
        console.log(error);
        
      }
  }

    const loginAnon = async ()=>{
      const credentials = Realm.Credentials.anonymous();
      await app.logIn(credentials);
      user.value = app?.currentUser
      return true;
    }

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
     const createEmployeeAccount =async (email:string, password:string,first:string,last:string, userType:string) => {
      //Create user
      const organizationID = app?.currentUser?.customData.organizationID
      await app.emailPasswordAuth.registerUser(email, password)

      const employeeCredentials = await Realm.Credentials.emailPassword(
        email,
        password
      );

      const employee = await app.logIn(employeeCredentials);
      // The active user is now employee
      console.assert(employee.id === app?.currentUser?.id);
    
      // save profile info
      const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
      const collection = mongodb?.db("drillo").collection("users");
      await collection?.insertOne(
        {userID: app?.currentUser?.id, first, last,userType,organizationID:organizationID}
      );

    //Refresh a user's custom data to make sure we have the latest version
    await app?.currentUser?.refreshCustomData();
    user.value = app?.currentUser
    console.log(user.value);
    const empID = user.value.customData._id
    console.log(empID);
    
    // Remove the current user from the device
    await app.removeUser(employee); 

    //Refresh a user's custom data to make sure we have the latest version
    await app?.currentUser?.refreshCustomData();
    user.value = app?.currentUser
    console.log(user.value);

    
    
      return empID;
};



//get driller employees by organizationID and userType
const getOrganizationDrillers = async()=>{
  // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("users");
  // 3. Read and write data with MongoDB queries
  const organizationID = user?.value.customData.organizationID.toString()
  return await collection?.find({ organizationID: organizationID , userType:"driller" })
}


const getAllEmployees = async()=>{
  // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("users");
  // 3. Read and write data with MongoDB queries
  
  return await collection?.find({})
}

const getEmployeeByID =async (_id:string) => {
      
  //import mongodb = require("mongodb");
  //const ObjectID = mongodb.ObjectID;
  

  // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("users");
  // 3. Read and write data with MongoDB queries
  const id = new  Realm.BSON.ObjectID(_id)
  const query  =  {'_id':id};
  return await collection?.findOne(query)
 
}

const deleteEmployeeFromOrganization = async(employee: any) =>{
  try {
    // 1. Get a data source client
const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
// 2. Get a database & collection
const collection = mongodb?.db("drillo").collection("users");
// 3. Read and write data with MongoDB queries
const query = { "_id": employee._id };
const update = {
"$set": {
"organizationID": "",
"project_id":"",
"machine_id":"",

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
  


const getEmployeesByOrganizationID = async()=>{
  // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("users");
  // 3. Read and write data with MongoDB queries
  const organizationID = user?.value.customData.organizationID
  return await collection?.find({organizationID:organizationID})
}




const updateEmployeeMachine =async (employee : any) => {
  try {
            // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("users");
  // 3. Read and write data with MongoDB queries
  const query = { "_id": employee._id };
  const update = {
    "$set": {
     "machine_id": employee.machine_id
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

const updateEmployeeProject =async (employee : any) => {
  try {
            // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("users");
  // 3. Read and write data with MongoDB queries
  const query = { "_id": employee._id };
  
    //const id = new  Realm.BSON.ObjectID(employee.project_id.id)
  
  const update = {
    "$set": {
     "project_id": employee.project_id
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


    const getProject =async () => {
      
        // 1. Get a data source client
        const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
        // 2. Get a database & collection
        const collection = mongodb?.db("drillo").collection("projects");
        // 3. Read and write data with MongoDB queries
        
        return await collection?.findOne({})
      
    }

   


    const getProjectByID =async (_id:string) => {
      
      //import mongodb = require("mongodb");
      //const ObjectID = mongodb.ObjectID;
      

      // 1. Get a data source client
      const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
      // 2. Get a database & collection
      const collection = mongodb?.db("drillo").collection("projects");
      // 3. Read and write data with MongoDB queries
      const id = new  Realm.BSON.ObjectID(_id)
      const query  =  {'_id':id};
      return await collection?.findOne(query)
     
  }
  

  const deleteProjectByID =async (project : any) => {
    try {
              // 1. Get a data source client
    const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
    // 2. Get a database & collection
    const collection = mongodb?.db("drillo").collection("projects");
    // 3. Read and write data with MongoDB queries
    const query = { "_id": project._id };

    collection?.deleteOne(query)
      
    } catch (error) {
      console.log(error);
      
    }
}

  const getAllProjectByOrganizationID =async () => {
      
    //import mongodb = require("mongodb");
    //const ObjectID = mongodb.ObjectID;
    

    // 1. Get a data source client
    const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
    // 2. Get a database & collection
    const collection = mongodb?.db("drillo").collection("projects");
    // 3. Read and write data with MongoDB queries
    
    return await collection?.find({organizationID:user?.value.customData.organizationID})
   
}



     //create new project
    const createNewProject =async ( name: string, address:string, client:string,contactPerson:object) => {
   
      try {
        const organizationID = app?.currentUser?.customData.organizationID
        // 1. Get a data source client
        const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
        // 2. Get a database & collection
        const collection = mongodb?.db("drillo").collection("projects");
        // 3. Read and write data with MongoDB queries
        const insertResponse = await collection?.insertOne({organizationID:organizationID,name, address, client,contactPerson,machines:[], creationDate:new Date(), status:"Active"});
        return insertResponse?insertResponse.insertedId:false;


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

    const updateProjectPitsList =async (project : any) => {
      try {
                // 1. Get a data source client
      const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
      // 2. Get a database & collection
      const collection = mongodb?.db("drillo").collection("projects");
      // 3. Read and write data with MongoDB queries
      const query = { "_id": project._id };
      const update = {
        "$set": {
         "pitsList": project.pitsList,
         
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
    const updateProjectReports =async (project : any) => {
      try {
                // 1. Get a data source client
      const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
      // 2. Get a database & collection
      const collection = mongodb?.db("drillo").collection("projects");
      // 3. Read and write data with MongoDB queries
      const query = { "_id": project._id };
      const update = {
        "$set": {
         "reports":project.reports
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

    const updateProjectLastPit =async (project : any) => {
      try {
                // 1. Get a data source client
      const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
      // 2. Get a database & collection
      const collection = mongodb?.db("drillo").collection("projects");
      // 3. Read and write data with MongoDB queries
      const query = { "_id": project._id };
      const update = {
        "$set": {
         "lastPit": project.lastPit
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


  //need to delete this fuction
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
     return true
}
})
    
  } catch (error) {
    console.log(error);
    return false
    
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

const updateProjectStatus =async (project : any) => {
  try {
            // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("projects");
  // 3. Read and write data with MongoDB queries
  const query = { "_id": project._id };
  const update = {
    "$set": {
     "status": project.status,
    
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
     const createNewDrillingMachine =async (name: string, licens_number:string) => {
   
      try {
        const organizationID = app?.currentUser?.customData.organizationID
        // 1. Get a data source client
const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
// 2. Get a database & collection
const collection = mongodb?.db("drillo").collection("drilling_machines");
// 3. Read and write data with MongoDB queries

    const insertResponse = await collection?.insertOne({name, licens_number, organizationID:organizationID, project_id:"", drillers:[]});
  return insertResponse?insertResponse.insertedId:false;


} catch (error) {
console.log(error);

}
};


   //this function is the same as the one under it
    const getDrillingMachinesByID = async()=>{
            // 1. Get a data source client
            const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
            // 2. Get a database & collection
            const collection = mongodb?.db("drillo").collection("drilling_machines");
            // 3. Read and write data with MongoDB queries
            const organizationID = user?.value.customData.organizationID
            return await collection?.find({organizationID:organizationID})
    }   
    
    
    const getOrganizationDrillingMachines = async()=>{
      // 1. Get a data source client
      const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
      // 2. Get a database & collection
      const collection = mongodb?.db("drillo").collection("drilling_machines");
      // 3. Read and write data with MongoDB queries
      
      return await collection?.find({organizationID:user?.value.customData.organizationID})
    }

    const getDrillingMachineByID = async(id: string)=>{
      // 1. Get a data source client
      const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
      // 2. Get a database & collection
      const collection = mongodb?.db("drillo").collection("drilling_machines");
      // 3. Read and write data with MongoDB queries
      const mID = new Realm.BSON.ObjectID(id)
      const organizationID = user?.value.customData.organizationID
      return await collection?.findOne({_id:mID})
}



    const getAllOrganizations= async()=>{
      // 1. Get a data source client
      const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
      // 2. Get a database & collection
      const collection = mongodb?.db("drillo").collection("organization");
      // 3. Read and write data with MongoDB queries
      
      return await collection?.find({})
}


const updateMachineDrillers =async (machine : any) => {
    try {
              // 1. Get a data source client
    const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
    // 2. Get a database & collection
    const collection = mongodb?.db("drillo").collection("drilling_machines");
    // 3. Read and write data with MongoDB queries
    const query = { "_id": machine._id };
    const update = {
      "$set": {
       "drillers": machine.drillers
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

const updateMachineProjectID =async (machine : any) => {
  try {
            // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("drilling_machines");
  // 3. Read and write data with MongoDB queries
  const query = { "_id": machine._id };
  //const _id = new  Realm.BSON.ObjectID(machine.project_id)
  const update = {
    "$set": {
     "project_id": machine.project_id
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

const deleteMachineFromDB =async (machine : any) => {
  try {
            // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("drilling_machines");
  // 3. Read and write data with MongoDB queries
  const query = { "_id": machine._id };

    collection?.deleteOne(query)
    
  } catch (error) {
    console.log(error);
    
  }
}


const getReportByID =async (_id:string) => {
      
  //import mongodb = require("mongodb");
  //const ObjectID = mongodb.ObjectID;
  

  // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("daily_reports");
  // 3. Read and write data with MongoDB queries
  const id = new  Realm.BSON.ObjectID(_id)
  const query  =  {'_id':id};
  return await collection?.findOne(query)
 
}

const getProjectReports=async (project_id:string) => {
      
  //import mongodb = require("mongodb");
  //const ObjectID = mongodb.ObjectID;
  

  // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("daily_reports");
  // 3. Read and write data with MongoDB queries
  const id = new  Realm.BSON.ObjectID(project_id)
  const query  =  {'project_id':id};
  return await collection?.find(query)
 
}

const saveNewReport =async (report:object) => {
      
  //import mongodb = require("mongodb");
  //const ObjectID = mongodb.ObjectID;
  

  // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("daily_reports");
  // 3. Read and write data with MongoDB queries
  //const id = new  Realm.BSON.ObjectID(_id)
  //const query  =  {'_id':id};
  //return await collection?.findOne(query)

  const insertResponse = await collection?.insertOne(report);
  return insertResponse?insertResponse.insertedId:false;
 
}


const updateReportByID =async (report : any) => {
  try {
            // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("daily_reports");
  // 3. Read and write data with MongoDB queries
  const query = { "_id": report._id };
  const update = {
    "$set": {
     "pits": report.pits
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

const updateReportSigByID =async (report : any) => {
  try {
            // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("daily_reports");
  // 3. Read and write data with MongoDB queries
  const query = { "_id": report._id };
  const update = {
    "$set": {
     "signature": report.signature,
     "signatureName": report. signatureName
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

const saveNewPit =async (pit:any) => {
  try {

  const id = new  Realm.BSON.ObjectID(pit.project_id)
  pit.project_id = id
  // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("pits");
  // 3. Read and write data with MongoDB queries
 
  const insertResponse = await collection?.insertOne(pit);
  return insertResponse?insertResponse.insertedId:false;

  } catch (error) {
    console.log(error);
    
  }
 
}

const saveProjectPits =async (pits:any) => {
  try {

  //const id = new  Realm.BSON.ObjectID(pits[0].project_id)
  // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("pits");
  // 3. Read and write data with MongoDB queries
 
  const insertResponse = await collection?.insertMany(pits);
  return insertResponse?insertResponse:false;

  } catch (error) {
    console.log(error);
    
  }
 
}


const updatePitStatusAndReport =async (pit:any) => {
  try {
    // 1. Get a data source client
const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
// 2. Get a database & collection
const collection = mongodb?.db("drillo").collection("pits");
// 3. Read and write data with MongoDB queries
const query = { "_id": pit._id };
const update = {
"$set": {
"status": pit.status,
"report_id": pit.report_id,
"finishDate": pit.finishDate
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

const getReportPits=async (report_id:string) => {
      
  //import mongodb = require("mongodb");
  //const ObjectID = mongodb.ObjectID;
  

  // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("pits");
  // 3. Read and write data with MongoDB queries
  const id = new  Realm.BSON.ObjectID(report_id)
  const query  =  {'report_id':id};
  return await collection?.find(query)
 
}

const getProjectPits=async (project_id:string) => {
      
  //import mongodb = require("mongodb");
  //const ObjectID = mongodb.ObjectID;
  

  // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("pits");
  // 3. Read and write data with MongoDB queries
  const id = new  Realm.BSON.ObjectID(project_id)
  const query  =  {'project_id':id};
  return await collection?.find(query)
 
}

const deleteProjectPits=async (project_id:string) => {
      
  //import mongodb = require("mongodb");
  //const ObjectID = mongodb.ObjectID;
  

  // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("pits");
  // 3. Read and write data with MongoDB queries
  const id = new  Realm.BSON.ObjectID(project_id)
  const query  =  {'project_id':id};
  return await collection?.deleteMany(query)
 
}

const updatePitDepth =async (pit : any) => {
  try {
            // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("pits");
  // 3. Read and write data with MongoDB queries
  const query = { "_id": pit._id };
  const update = {
    "$set": {
     "depth": pit.depth,
     "concreteVolume": pit.concreteVolume
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

const updatePitDiameter =async (pit : any) => {
  try {
            // 1. Get a data source client
  const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
  // 2. Get a database & collection
  const collection = mongodb?.db("drillo").collection("pits");
  // 3. Read and write data with MongoDB queries
  const query = { "_id": pit._id };
  const update = {
    "$set": {
     "diameter": pit.diameter,
     "concreteVolume": pit.concreteVolume
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


    return{
        isLoggedIn,
        user,
        //functions
        getOrganizationData,
        login,
        deleteUserData,
        loginAnon,
        logout,
        createAccount,
        //employees
        createEmployeeAccount,
        getOrganizationDrillers,
        getAllEmployees,
        getEmployeesByOrganizationID,
        getEmployeeByID,
        deleteEmployeeFromOrganization ,//need to be fixed
        updateEmployeeMachine,
        updateEmployeeProject,

        //project
        getProject,
        getProjectByID,
        deleteProjectByID,
        getAllProjectByOrganizationID,
        createNewProject,
        updateProjectPits,
        updateProjectPitsList,
        updateProjectReports,
        updateProjectLastPit,
        updateProjectMachines,
        updateProjectExternalServices,
        updateProjectStatus,

        updateProjectDrillers,//need to be removed
        updateProjectSiteManagers,//need to be removed
        getAllProjects,//need to be removed

        //drilling machines
        createNewDrillingMachine,
        getDrillingMachinesByID, 
        getDrillingMachineByID,
        getOrganizationDrillingMachines,
          //getAllOrganizations,//need to be removed
        updateMachineDrillers,
        updateMachineProjectID,
        deleteMachineFromDB,

        //reports
        getReportByID,
        getProjectReports,
        saveNewReport,
        updateReportByID,
        updateReportSigByID,

        //pits
        saveNewPit,
        saveProjectPits,
        updatePitStatusAndReport,
        getReportPits,
        getProjectPits,
        deleteProjectPits,
        updatePitDepth,
        updatePitDiameter,
        
    };
};
