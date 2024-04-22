import s3 from "../config/awsS3"
import { GetObjectCommand, PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { isBase64, isDataURI } from "class-validator"
import { extractDataFromURI } from "../util/util"
import HttpException from "../exception/HttpException"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mime = require('mime-kind')


export const uploadFile = async (path: string, fileB64OrDataURI: string): Promise<any> => {
    const isValidDataURI = isDataURI(fileB64OrDataURI);
    const isValidBase64 = isBase64(fileB64OrDataURI);
    let params: PutObjectCommandInput;

    if (isValidDataURI) {
        const extractedData = extractDataFromURI(fileB64OrDataURI);
        if(extractedData?.base64String && extractedData?.mimeType) {
            const buffer = Buffer.from(extractedData.base64String, 'base64');
            params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: path,
                Body: buffer,
                ContentType: extractedData.mimeType,
                ContentLength: buffer.length,
            }
        } else throw new HttpException("Unable to decode Data URI", 400);
    } else if (isValidBase64) {
        const buffer = Buffer.from(fileB64OrDataURI, 'base64');
        const fileType = await mime(buffer);
        params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: path,
            Body: buffer,
            ContentType: fileType?.mime,
            ContentLength: buffer.length,
        }
        if (!fileType?.mime) {
            throw new HttpException("Unable to detect mime type of base64 string", 400);
        }
    } else {
        throw new HttpException("Invalid file format. Must be either base64 or data URI.", 400);
    }
    return new Promise((resolve, reject) => {
        s3.send(new PutObjectCommand(params)).then((data: PutObjectCommandOutput) => {
            resolve(path);
        }).catch((error) => {
            console.log(error);
            reject(error);
        });
    });
}


export const getSignedUrlByPath = async (path: string): Promise<string> => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: path
    }
    return new Promise((resolve, reject) => {
        const expirationTime = 3600; // 1 hour
        getSignedUrl(s3, new GetObjectCommand(params), { expiresIn: expirationTime }).then((url) => {
            resolve(url);
        }).catch((error) => {
            console.log(error);
            reject(error);
        });
    });
}