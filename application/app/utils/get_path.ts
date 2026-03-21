import { publicImageIds, publicProfileImageIds } from "@web-speed-hackathon-2026/client/app/utils/public_asset_manifest";

export function getImagePath(imageId: string): string {
  return `/images/${imageId}.jpg`;
}

export function getImageAvifPath(imageId: string): string {
  return `/images/${imageId}.avif`;
}

export function getMoviePath(movieId: string): string {
  return `/movies/${movieId}.webm`;
}

export function getSoundPath(soundId: string): string {
  return `/sounds/${soundId}.mp3`;
}

export function getProfileImagePath(profileImageId: string): string {
  return `/images/profiles/${profileImageId}.jpg`;
}

export function getProfileImageAvifPath(profileImageId: string): string {
  return `/images/profiles/${profileImageId}.avif`;
}

export function hasImageAvifAsset(imageId: string): boolean {
  return publicImageIds.has(imageId);
}

export function hasProfileImageAvifAsset(profileImageId: string): boolean {
  return publicProfileImageIds.has(profileImageId);
}
