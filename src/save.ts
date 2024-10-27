import fs from 'fs';
import path from 'path';
import CameraRTSPImageSaver from './CameraRTSPImageSaver';

async function main() {
    // load rtsp feed settings
    const feeds = readJsonFile<IFeedSettings[]>(path.join(__dirname, '../feeds.json'));
    
    // for each feed, connect and save the latest image
    for (const feed of feeds) {
        await initAndSave(feed);
    }
}

async function initAndSave(feedSettings: IFeedSettings) {
    // initialize the camera rtsp image saver
    const cameraRTSPImageSaver = new CameraRTSPImageSaver({
        url: feedSettings.url,
        username: feedSettings.username,
        password: feedSettings.password,
        outputDirectory: feedSettings.directory,
        name: feedSettings.name,
    })

    // save the latest image
    await cameraRTSPImageSaver.saveImage().catch(console.error);
}

function readJsonFile<T>(filepath: string): T {
    return JSON.parse(fs.readFileSync(filepath, 'utf8')) as T;
} 

main().catch(console.error);

interface IFeedSettings {
    name: string;
    directory: string;
    username: string;
    password: string;
    url: string;
}