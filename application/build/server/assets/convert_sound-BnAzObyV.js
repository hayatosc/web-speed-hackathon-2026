import { t as loadFFmpeg } from "./load_ffmpeg-CO1wUm5-.js";
import Encoding from "encoding-japanese";
//#region src/utils/extract_metadata_from_sound.ts
var UNKNOWN_ARTIST = "Unknown Artist";
var UNKNOWN_TITLE = "Unknown Title";
async function extractMetadataFromSound(data) {
	try {
		const ffmpeg = await loadFFmpeg();
		const exportFile = "meta.txt";
		await ffmpeg.writeFile("file", new Uint8Array(await data.arrayBuffer()));
		await ffmpeg.exec([
			"-i",
			"file",
			"-f",
			"ffmetadata",
			exportFile
		]);
		const output = await ffmpeg.readFile(exportFile);
		ffmpeg.terminate();
		const meta = parseFFmetadata(Encoding.convert(output, {
			to: "UNICODE",
			from: "AUTO",
			type: "string"
		}));
		return {
			artist: meta.artist ?? UNKNOWN_ARTIST,
			title: meta.title ?? UNKNOWN_TITLE
		};
	} catch {
		return {
			artist: UNKNOWN_ARTIST,
			title: UNKNOWN_TITLE
		};
	}
}
function parseFFmetadata(ffmetadata) {
	return Object.fromEntries(ffmetadata.split("\n").filter((line) => !line.startsWith(";") && line.includes("=")).map((line) => line.split("=")).map(([key, value]) => [key.trim(), value.trim()]));
}
//#endregion
//#region src/utils/convert_sound.ts
async function convertSound(file, options) {
	const ffmpeg = await loadFFmpeg();
	const exportFile = `export.${options.extension}`;
	await ffmpeg.writeFile("file", new Uint8Array(await file.arrayBuffer()));
	const metadata = await extractMetadataFromSound(file);
	await ffmpeg.exec([
		"-i",
		"file",
		"-metadata",
		`artist=${metadata.artist}`,
		"-metadata",
		`title=${metadata.title}`,
		"-vn",
		exportFile
	]);
	const output = await ffmpeg.readFile(exportFile);
	ffmpeg.terminate();
	return new Blob([output]);
}
//#endregion
export { convertSound };
