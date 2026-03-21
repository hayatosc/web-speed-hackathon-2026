import { t as loadFFmpeg } from "./load_ffmpeg-CO1wUm5-.js";
//#region src/utils/convert_movie.ts
/**
* 先頭 5 秒のみ、正方形にくり抜かれた無音動画を作成します
*/
async function convertMovie(file, options) {
	const ffmpeg = await loadFFmpeg();
	const cropOptions = ["'min(iw,ih)':'min(iw,ih)'", options.size ? `scale=${options.size}:${options.size}` : void 0].filter(Boolean).join(",");
	const exportFile = `export.${options.extension}`;
	await ffmpeg.writeFile("file", new Uint8Array(await file.arrayBuffer()));
	await ffmpeg.exec([
		"-i",
		"file",
		"-t",
		"5",
		"-r",
		"10",
		"-vf",
		`crop=${cropOptions}`,
		"-an",
		exportFile
	]);
	const output = await ffmpeg.readFile(exportFile);
	ffmpeg.terminate();
	return new Blob([output]);
}
//#endregion
export { convertMovie };
