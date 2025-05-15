// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { v4 } from "uuid";
import sharp from "sharp";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

// export const uploadTaskFile = async (fileData) => {
//   try {
//     const storageRef = ref(storage, `taskInstructions/${v4()}`);
//     await uploadBytes(storageRef, fileData,{
//       contentType: "application/pdf"
//     });
//     return await getDownloadURL(storageRef);
//   } catch (error) {
//     console.error("Error ", error);
//     throw error;
//   }

// }

// export async function uploadFileTask(file) {
//   try {
//     if (file.type !== "application/pdf") {
//       throw new Error("El archivo debe ser un pdf");
//     }
//     const fileNameRandom = crypto.randomBytes(20).toString("hex");
//     const storageRef = ref(storage, `tareas-archives/${fileNameRandom}`);
//     await uploadBytes(storageRef, file);
//     const url = await getDownloadURL(storageRef);
//     const data = {
//       code: 200,
//       status: "success",
//       url: url,
//     };
//     return data;
//   } catch (error) {
//     return { code: 404, status: "error", url: null };
//   }
// }

export const uploadImg = async (imageData: any) => {
  try {
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");

    // Convertir la cadena base64 a un Buffer
    const imgBuffer = Buffer.from(base64Data, "base64");
    const image = await sharp(imgBuffer)
      .resize(1280, 720)
      .webp({ quality: 80 })
      .toBuffer();
    const storageRef = ref(storage, `skillImages/${v4()}`);
    await uploadBytes(storageRef, image,{ contentType: "image/webp" });
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error uploading profile pic:", error);
    throw error;
  }
};
export const uploadProfileImage = async (imageData: any) => {
  try {
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");

    // Convertir la cadena base64 a un Buffer
    const imgBuffer = Buffer.from(base64Data, "base64");

    const storageRef = ref(storage, `profileImages/${v4()}`);

    const profileImage = await sharp(imgBuffer)
      .resize(100, 100)
      .webp({ quality: 80 })
      .toBuffer();
    await uploadBytes(storageRef, profileImage, { contentType: "image/webp" });
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error uploading profile pic:", error);
    throw error;
  }
};

// export const uploadSolutionFile = async (fileData,type) => {
//   try {

//     const storageRef = ref(storage, `solutionsFiles/${v4()}`);
//     if(type==="application/pdf"){
//       await uploadBytes(storageRef, fileData,{
//         contentType: "application/pdf"
//       });
//       return await getDownloadURL(storageRef);
//     }
//     await uploadBytes(storageRef, fileData,{contentType:"image/jpeg"});
//     const url = await getDownloadURL(storageRef);
//     return url;
//   } catch (error) {
//     console.error("Error ", error);
//     throw error;
//   }
// };

// export async function uploadPhotoPerfil(file) {
//   try {

//     const fileNameRandom = crypto.randomBytes(20).toString("hex");
//     const storageRef = ref(storage, `perfil-photos/${fileNameRandom}`);
//     await uploadBytes(storageRef, file);
//     const url = await getDownloadURL(storageRef);
//     const data = {
//       code: 200,
//       status: "success",
//       url: url,
//     };
//     return data;
//   } catch (error) {
//     return { code: 404, status: "error", url: null };
//   }
// }
// export async function deletePhotoPerfil(url) {
//   try {
//     const desertRef = ref(storage, url);
//     deleteObject(desertRef);
//     return {
//       code: 200,
//       status: "success",
//       message: "Foto de perfil eliminada exitosamente",
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       code: 500,
//       status: "error",
//       message: "Error al eliminar la foto de perfil",
//     };
//   }
// }
