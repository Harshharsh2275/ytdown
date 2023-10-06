var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ytdl = require("ytdl-core");
var ytpl = require("ytpl");
var fs = require("fs");
var progress = require("progress-stream");
function extractVideoLinks(playlistUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var playlistInfo, playlistId_1, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, ytpl(playlistUrl)];
                case 1:
                    playlistInfo = _a.sent();
                    return [4 /*yield*/, ytpl.getPlaylistID(playlistUrl)];
                case 2:
                    playlistId_1 = _a.sent();
                    try {
                        fs.mkdir(playlistId_1, function (err) {
                            if (err) {
                                throw Error(err.message);
                            }
                            console.log("Successfully created the directory!");
                        });
                    }
                    catch (e) {
                        throw Error(e.message);
                    }
                    playlistInfo.items.forEach(function (vid) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, downloadVideo(vid.url, "".concat(process.cwd(), "/").concat(playlistId_1))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error:", error_1.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function downloadVideo(videoUrl, outputDir) {
    return __awaiter(this, void 0, void 0, function () {
        var info_1, formats_1, totalSize_1, progressBar_1, videoTitle, outputFilePath_1, outputStream_1, prevProgress_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, ytdl.getInfo(videoUrl)];
                case 1:
                    info_1 = _a.sent();
                    formats_1 = ytdl.filterFormats(info_1.formats, 'videoandaudio');
                    if (!formats_1.length) {
                        console.error("No video and audio formats available for ".concat(info_1.videoDetails.title));
                    }
                    totalSize_1 = parseInt(formats_1[0].contentLength);
                    progressBar_1 = progress({
                        length: totalSize_1,
                        time: 100,
                    });
                    videoTitle = info_1.videoDetails.title.replace('\/', '-');
                    outputFilePath_1 = "".concat(outputDir, "/").concat(videoTitle, ".mp4");
                    outputStream_1 = fs.createWriteStream(outputFilePath_1);
                    prevProgress_1 = 0;
                    console.log("Downloading: ", videoTitle);
                    progressBar_1.on("progress", function (progress) {
                        var currentProgress = Math.floor(progress.percentage);
                        if (currentProgress !== prevProgress_1) {
                            process.stdout.write("Downloading[".concat(currentProgress, "%]: [").concat('#\s'.repeat(currentProgress)).concat('.'.repeat((totalSize_1 - currentProgress)), "}]%\r"));
                            prevProgress_1 = currentProgress;
                        }
                    });
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            // Start downloading the video
                            ytdl(videoUrl, { format: formats_1[0] })
                                .pipe(progressBar_1)
                                .pipe(outputStream_1).on('finish', function () {
                                console.log("Downloaded ".concat(info_1.videoDetails.title, " to: ").concat(outputFilePath_1));
                                resolve(null);
                            }).on('error', function (er) {
                                console.error("Error: ", er.message);
                                reject(er);
                            });
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error:", error_2.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var args = process.argv.slice(2);
if (args.length !== 1)
    throw Error("Usage: node ytdown.js <playlist-url>");
var playlistUrl = args[0];
extractVideoLinks(playlistUrl);
