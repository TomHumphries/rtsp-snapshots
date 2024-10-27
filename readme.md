# 📸 RTSP feed snapshots
## Building
Run:
```
npm run build
```
to generate the JavaScript files in `./build`.

## About

💾 `app.js` saves an image of the rtsp feeds configured in `feeds.json` to:
1. `latest.jpg` (which is overwritten every time)
2. a file with the current time as the name e.g. `20241027T210005.jpg`

📁 The images are saved to the directories configured for each feed in the `feeds.json` file.  

📆 The saving is triggered using a cronjob, which can be edited using:
```
crontab -e
```

🕐 For example, to save a snapshot every hour, the line should be added:
```
0 * * * * /path/to/node /path/to/build/save.js
```

