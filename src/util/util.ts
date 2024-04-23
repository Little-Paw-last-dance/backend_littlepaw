import { PetPostRequestDTO } from "../model/dto/petPostRequestDTO";
import { uploadFile, deleteFile } from "../repository/s3Repository";


export const  extractDataFromURI = (uri: string): { base64String: string, mimeType: string } | null => {
    const dataUriRegex = /^data:(.+);base64,(.*)$/;
    const match = uri.match(dataUriRegex);

    if (match) {
        const mimeType = match[1];
        const base64String = match[2];

        return { base64String, mimeType };
    }
    return null;
}

export const uploadFilesB64AndReturnPaths = async (filesB64: string[], getPathFunction: () => string): Promise<string[]> => {
    const promises = filesB64.map(async (fileB64) => {
        const path = getPathFunction();
        return await uploadFile(path, fileB64);
    });

    return await Promise.all(promises);
}

export const deleteFiles = async (paths: string[]): Promise<void> => {
    const promises = paths.map(async (path) => {
        return await deleteFile(path);
    });

    await Promise.all(promises);
}