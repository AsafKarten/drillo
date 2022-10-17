import * as Realm from "realm-web";
import { readAndCompressImage } from 'browser-image-resizer';

import { useAppState } from './realm-state';

const app = Realm.getApp("application-0-sliwo");

export const fileHosting = () => {


    const convertBase64 = (fileURL:any) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(fileURL);
            fileReader.onloadend = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };


    //const resizeImageConfig = { quality: 0.7, width: 1024, height: 1024 };
    const resizeImage = async( file:any, config:object ) => await readAndCompressImage(file, config);

    const uploadFile = async( file:any, originID:object, projectID:object ) => {
        //console.log("upload requested for file:")
        //console.log(file)
        let content = undefined;
        let thumbnail = undefined;

        if(file && file.type == "image/jpeg" || file.type == "image/png")
        {
            //console.log("content before resize:")
            //console.log(file)
            content = await resizeImage(file, { quality: 0.7, width: 1024 });
            //console.log("content after resize:")
            //console.log(content)
            thumbnail = await resizeImage(content, { quality: 0.7, width: 256  });
            //console.log("its thumbnail:")
            //console.log(thumbnail)
        }
        else if(file.type == "application/pdf")
        {
            // PDF PREVIEW INSIDE APP:
            // <embed width="400" height="600" name="plugin" src="..." type="application/pdf">
            //here i need to create a thumbnail from the preview
            thumbnail = undefined;
        }
        else
            content = file;

        content = await convertBase64(content);
        //console.log("Base64:")
        //console.log(content)

        const fileData = {
            type: file.type,
            thumbnail: thumbnail,
            filename: file.name,
            content: content,
            projectID: projectID,
            originID: originID,
            uploadedBy: useAppState().user.id,
            date: Date.now()
        }
        //console.log("fileData:")
        //console.log(fileData)

        
        try {
            const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
            const collection = mongodb?.db("drillo").collection("uploaded_files");
            const insertResponse = await collection?.insertOne(fileData);
            //console.log("insertResponse")
            //console.log(insertResponse)
            return insertResponse?insertResponse.insertedId:false;
        } catch (error) {
            console.log(error);
        }
    }

    const getFile = async(_id:string) => {
        const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
        const collection = mongodb?.db("drillo").collection("uploaded_files");
        const id = new Realm.BSON.ObjectID(_id)
        const query = {'_id':id};
        return await collection?.findOne(query)
    }


      return {
        resizeImage,
        uploadFile,
        getFile
      };
};