const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const fs = require("fs");
const progress = require("progress-stream");

async function extractVideoLinks(playlistUrl) {
  try {
    // Fetch the playlist information
    const playlistInfo = await ytpl(playlistUrl);
    // const playlistInfo = await ytdl.getPlaylist(playlistUrl);
    const playlistId: string = await ytpl.getPlaylistID(playlistUrl);
    try {
      fs.mkdir(playlistId, (err) => {
        if (err) {
          throw Error(err.message);
        }
        console.log("Successfully created the directory!");
      });
    } catch (e) {
      throw Error(e.message);
    }
    playlistInfo.items.forEach(async (vid) => {
        await downloadVideo(vid.url, `${process.cwd()}/${playlistId}`);
    });
    // Extract and print video links
    // playlistInfo.items.forEach((video) => {
    //   console.log(video.url);
    // });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function downloadVideo(videoUrl, outputDir) {
  try {
    // Get video info to determine the highest quality format
    const info = await ytdl.getInfo(videoUrl);
    //   console.log(info);
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
    if (!formats.length) {
      console.error(`No video and audio formats available for ${info.videoDetails.title}`);
    }

    // Create a progress bar
    const totalSize = parseInt(formats[0].contentLength);
    const progressBar = progress({
      length: totalSize,
      time: 100,
    });
    const videoTitle: string = info.videoDetails.title.replace('\/', '-');

    // Create a write stream to save the video to a file
    const outputFilePath = `${outputDir}/${videoTitle}.mp4`;
    const outputStream = fs.createWriteStream(outputFilePath);

    // Pipe the video download progress to the progress bar
    let prevProgress = 0;
    console.log("Downloading: ", videoTitle);
    progressBar.on("progress", (progress) => {
    
      const currentProgress = Math.floor(progress.percentage);
      if (currentProgress !== prevProgress) {
        process.stdout.write(`Downloading[${currentProgress}%]: [${'#\s'.repeat(currentProgress)}${'.'.repeat((totalSize - currentProgress))}}]%\r`);
        prevProgress = currentProgress;
      }
    });

    await new Promise((resolve, reject) => {
        // Start downloading the video
    ytdl(videoUrl, { format: formats[0] })
    .pipe(progressBar)
    .pipe(outputStream).on('finish', () => {
      console.log(`Downloaded ${info.videoDetails.title} to: ${outputFilePath}`);
      resolve(null);    
    }).on('error', er => {
      console.error("Error: ", er.message);
      reject(er);
    });
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}


const args = process.argv.slice(2);
if (args.length !== 1) throw Error("Usage: node ytdown.js <playlist-url>");

const playlistUrl = args[0];

extractVideoLinks(playlistUrl);
