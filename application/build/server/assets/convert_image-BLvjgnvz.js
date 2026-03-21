import { ImageMagick, MagickFormat, initializeImageMagick } from "@imagemagick/magick-wasm";
import { ImageIFD, dump, insert } from "piexifjs";
//#region node_modules/.pnpm/@imagemagick+magick-wasm@0.0.37/node_modules/@imagemagick/magick-wasm/dist/magick.wasm?url
var magick_default = "/assets/magick-DgWW1YxY.wasm";
//#endregion
//#region src/utils/convert_image.ts
var imageMagickInitializationPromise = null;
async function initializeMagick() {
	if (imageMagickInitializationPromise == null) imageMagickInitializationPromise = initializeImageMagick(new URL(magick_default, window.location.href)).catch((error) => {
		imageMagickInitializationPromise = null;
		throw error;
	});
	await imageMagickInitializationPromise;
}
async function convertImage(file, options) {
	await initializeMagick();
	const byteArray = new Uint8Array(await file.arrayBuffer());
	const outputFormat = (() => {
		switch (options.extension) {
			case "jpeg": return MagickFormat.Jpg;
		}
	})();
	return new Promise((resolve) => {
		ImageMagick.read(byteArray, (img) => {
			img.format = outputFormat;
			const comment = img.comment;
			img.write((output) => {
				if (comment == null) {
					resolve(new Blob([output]));
					return;
				}
				const binary = Array.from(output).map((b) => String.fromCharCode(b)).join("");
				const descriptionBinary = Array.from(new TextEncoder().encode(comment)).map((b) => String.fromCharCode(b)).join("");
				const outputWithExif = insert(dump({ "0th": { [ImageIFD.ImageDescription]: descriptionBinary } }), binary);
				const bytes = Uint8Array.from(outputWithExif.split("").map((c) => c.charCodeAt(0)));
				resolve(new Blob([bytes]));
			});
		});
	});
}
//#endregion
export { convertImage };
