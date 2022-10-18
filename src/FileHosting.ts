import * as Realm from "realm-web";
import { readAndCompressImage } from 'browser-image-resizer';

import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const app = Realm.getApp("application-0-sliwo");

export const fileHosting = () => {

    const convertBase64 = (fileURL:any) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(fileURL);
            fileReader.onloadend = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    }

    const b64toBlob = (dataURI:string) => {
        const mimeType = dataURI.substring(dataURI.indexOf(":")+1, dataURI.indexOf(";"))
        const byteString = atob(dataURI.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++)
            ia[i] = byteString.charCodeAt(i);
        return new Blob([ab], { type: mimeType });
    }

    const makePDFthumbnail = async(file:any) => {
        async function makeThumbnail(page:pdfjsLib.PDFPageProxy) {
            const vp = page.getViewport({scale:1});
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = 256;
            const scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
            return await page.render({canvasContext: canvas.getContext("2d")||"", viewport: page.getViewport({scale:scale})}).promise.then(()=>{return canvas});
        }
        const getPageThumbnail = async (doc:any, num:number) => (await makeThumbnail(await doc.getPage(num))).toDataURL();
        return pdfjsLib.getDocument(file).promise.then( doc => getPageThumbnail(doc, 1) ).catch(console.error);
    }


    //const resizeImageConfig = { quality: 0.7, width: 1024, height: 1024 };
    const resizeImage = async( file:any, config:object ) => await readAndCompressImage(file, config);

    const uploadFile = async( file:any, originID:object, projectID:object ) => {
        let content = file;
        let thumbnail = undefined;

        if(file.type.startsWith('image'))
        {
            content   = await resizeImage(file,    { quality: 0.7, width: 1024 });
            thumbnail = await convertBase64( await resizeImage(content, { quality: 0.7, width: 256  }) );
        }
        else if(file.type == "application/pdf") // PDF PREVIEW INSIDE APP: <embed width="400" height="600" name="plugin" src="{URL}#view=FitH" type="application/pdf">
            thumbnail = await makePDFthumbnail(URL.createObjectURL(content));

        const fileData = {
            type: file.type,
            thumbnail: thumbnail,
            filename: file.name,
            content: await convertBase64(content),
            projectID: projectID,
            originID: originID,
            uploadedBy: app.currentUser?.customData._id,
            date: Date.now()
        }

        try {
            const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
            const collection = mongodb?.db("drillo").collection("uploaded_files");
            const insertResponse = await collection?.insertOne(fileData);
            return insertResponse?insertResponse.insertedId:false;
        } catch (e) { console.log(e); }
    }

    const getFile = async(_id:string) => {
        const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
        const collection = mongodb?.db("drillo").collection("uploaded_files");
        const id = new Realm.BSON.ObjectID(_id)
        const query = {'_id':id};
        const file = await collection?.findOne(query);
        //console.log(file.content)
        //file.content = b64toBlob(file.content);
        return file;
    }

 

    return {
    resizeImage,
    uploadFile,
    getFile,
    makePDFthumbnail,
    b64toBlob
    };
};