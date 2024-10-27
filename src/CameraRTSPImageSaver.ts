import { spawn, ChildProcess } from "child_process";
import * as path from "path";
import * as fs from "fs";

interface IRTSPFeedSettings {
    url: string;
    username?: string;
    password?: string;
    name: string,
    outputDirectory: string;
}

class CameraRTSPImageSaver {
    private args: string[];

    constructor(
        private settings: IRTSPFeedSettings,
    ) {
        // create the folder for the recordings
        fs.mkdirSync(this.settings.outputDirectory, { recursive: true });

        this.args = [
            "-hide_banner",
            "-y", // overwrite files without asking
            "-loglevel", "error",
            "-i", this.url,
            "-frames:v", "1",
            `${path.join(this.settings.outputDirectory, "latest.jpg")}`,
            "-strftime", "1",
            "-frames:v", "1",
            `${path.join(this.settings.outputDirectory, "%Y%m%dT%H%M%S.jpg")}`,
        ];
    }

    private get url(): string {
        let url = this.settings.url;
        if (this.settings.username && this.settings.password) {
            url = url.replace("rtsp://", `rtsp://${this.settings.username}:${this.settings.password}@`);
        }
        return url;
    }

    log(message: string, ...optionalParams: any[]): void {
        console.log(`${new Date().toISOString()} [${this.settings.name}] ${message}`, ...optionalParams);
    }

    saveImage(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const ffmpegProcess: ChildProcess = spawn("ffmpeg", this.args, {});
    
                ffmpegProcess.stdout?.on('data', (data) => {
                    this.log('[STDOUT]', data.toString());
                });
    
                ffmpegProcess.stderr?.setEncoding("utf8");
    
                ffmpegProcess.stderr?.on('data', (data) => {
                    this.log('[STDERR]', data.toString());
                });
    
                ffmpegProcess.on('exit', (code) => {
                    this.log(`[EXIT] code ${code}`);
                    resolve();
                });
    
                ffmpegProcess.on('error', (err) => {
                    this.log(`[ERROR]`, err);
                    reject(err);
                });
    
                ffmpegProcess.on('disconnect', () => {
                    this.log("Process disconnect");
                });
    
                ffmpegProcess.on('close', (code) => {
                    this.log(`[CLOSE] code ${code}`);
                    resolve();
                });
    
            } catch (error) {
                this.log('saveImage error', error);
                reject(error);
            }
        });
    }
}

export default CameraRTSPImageSaver;