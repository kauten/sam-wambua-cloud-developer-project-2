import fs from "fs";
import Jimp = require("jimp");
import axios from "axios";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}



/**
 * For some reason, the above util function fails for some reason, 
 * This is an attempt to implement the same functionality using axios
 * See the following link for more info: 
 * https://stackoverflow.com/questions/66611327/error-could-not-find-mime-for-buffer-null-while-using-jimp-to-save-the-buffer 
 */
 export async function filterImageFromURL2(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await filterImageFromURL3(inputURL);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img: any) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

async function filterImageFromURL3(inputURL: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      axios({
        method: 'get',
        url: inputURL,
        responseType: 'arraybuffer'
        })
        .then(async function ({data: imageBuffer}) {
          
          let imagebuffer = await Jimp.read(imageBuffer);
          resolve(imagebuffer)

        })
      } catch (error) {

        reject(error);

      }
  });
}



// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
