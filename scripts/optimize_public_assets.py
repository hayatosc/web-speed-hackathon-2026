from __future__ import annotations

import json
import shutil
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path

import pillow_avif  # noqa: F401
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "application" / "public"
IMAGES_DIR = PUBLIC_DIR / "images"
PROFILE_IMAGES_DIR = IMAGES_DIR / "profiles"
FONTS_DIR = PUBLIC_DIR / "fonts"
SERVER_SEEDS_DIR = ROOT / "application" / "server" / "seeds"
TERM_PAGE_PATH = ROOT / "application" / "app" / "components" / "term" / "TermPage.tsx"
PUBLIC_ASSET_MANIFEST_PATH = ROOT / "application" / "app" / "utils" / "public_asset_manifest.ts"

EXIF_IMAGE_DESCRIPTION = 0x010E


@dataclass(frozen=True)
class ImageOptimizationPolicy:
    max_edge: int
    jpeg_quality: int
    avif_quality: int


IMAGE_POLICY = ImageOptimizationPolicy(max_edge=2048, jpeg_quality=82, avif_quality=52)
PROFILE_IMAGE_POLICY = ImageOptimizationPolicy(max_edge=512, jpeg_quality=84, avif_quality=58)


def decode_alt(raw: object) -> str:
    if isinstance(raw, bytes):
        for encoding in ("utf-8", "utf-16le", "latin-1"):
            try:
                return raw.decode(encoding).rstrip("\x00")
            except UnicodeDecodeError:
                continue
        return ""

    if isinstance(raw, str):
        return raw.rstrip("\x00")

    return ""


def load_alt_lookup(path: Path) -> dict[str, str]:
    lookup: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line:
            continue
        record = json.loads(line)
        lookup[record["id"]] = record.get("alt", "")
    return lookup


def extract_image_metadata(
    path: Path,
    image: Image.Image,
    alt_lookup: dict[str, str],
) -> dict[str, int | str]:
    alt = alt_lookup.get(path.stem, "")
    width, height = image.size

    if alt == "":
        with Image.open(path) as original:
            exif = original.getexif()
            alt = decode_alt(exif.get(EXIF_IMAGE_DESCRIPTION, ""))

    return {
        "alt": alt,
        "height": height,
        "width": width,
    }


def save_sidecar(path: Path, metadata: dict[str, int | str]) -> None:
    sidecar_path = path.with_suffix(".json")
    sidecar_path.write_text(
        json.dumps(metadata, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )


def render_optimized_image(
    path: Path,
    policy: ImageOptimizationPolicy,
    alt_lookup: dict[str, str],
) -> tuple[int, int]:
    before_size = path.stat().st_size

    with Image.open(path) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")

    width, height = image.size
    longest_edge = max(width, height)
    if longest_edge > policy.max_edge:
        scale = policy.max_edge / longest_edge
        image = image.resize(
            (max(1, round(width * scale)), max(1, round(height * scale))),
            Image.Resampling.LANCZOS,
        )

    metadata = extract_image_metadata(path, image, alt_lookup)
    save_sidecar(path, metadata)

    with tempfile.TemporaryDirectory(dir=path.parent) as temp_dir_name:
        temp_dir = Path(temp_dir_name)
        temp_jpeg_path = temp_dir / path.name
        temp_avif_path = temp_dir / f"{path.stem}.avif"

        image.save(
            temp_jpeg_path,
            format="JPEG",
            optimize=True,
            progressive=True,
            quality=policy.jpeg_quality,
            subsampling="4:2:0",
        )
        image.save(
            temp_avif_path,
            format="AVIF",
            quality=policy.avif_quality,
            speed=8,
        )

        temp_jpeg_path.replace(path)
        temp_avif_path.replace(path.with_suffix(".avif"))

    return before_size, path.stat().st_size


def optimize_image_directory(
    directory: Path,
    policy: ImageOptimizationPolicy,
    alt_lookup: dict[str, str],
) -> tuple[int, int]:
    before_total = 0
    after_total = 0

    for path in sorted(directory.glob("*.jpg")):
        before_size, after_size = render_optimized_image(path, policy, alt_lookup)
        before_total += before_size
        after_total += after_size

    return before_total, after_total


def write_public_asset_manifest() -> None:
    image_ids = sorted(path.stem for path in IMAGES_DIR.glob("*.avif"))
    profile_image_ids = sorted(path.stem for path in PROFILE_IMAGES_DIR.glob("*.avif"))

    PUBLIC_ASSET_MANIFEST_PATH.write_text(
        "\n".join(
            [
                "export const publicImageIds = new Set([",
                *[f'  "{image_id}",' for image_id in image_ids],
                "]);",
                "",
                "export const publicProfileImageIds = new Set([",
                *[f'  "{image_id}",' for image_id in profile_image_ids],
                "]);",
                "",
            ]
        ),
        encoding="utf-8",
    )


def build_font_subset(path: Path, text_file: Path) -> tuple[int, int]:
    before_size = path.stat().st_size
    output_path = path.with_suffix(".woff2")

    subprocess.run(
        [
            "pyftsubset",
            str(path),
            f"--output-file={output_path}",
            "--flavor=woff2",
            f"--text-file={text_file}",
            "--layout-features=*",
            "--glyph-names",
            "--symbol-cmap",
            "--legacy-cmap",
            "--notdef-glyph",
            "--notdef-outline",
            "--recommended-glyphs",
        ],
        check=True,
        cwd=ROOT,
    )

    return before_size, output_path.stat().st_size


def optimize_fonts() -> tuple[int, int]:
    with tempfile.TemporaryDirectory() as temp_dir_name:
        text_file = Path(temp_dir_name) / "terms.txt"
        text_file.write_text(TERM_PAGE_PATH.read_text(encoding="utf-8"), encoding="utf-8")

        before_total = 0
        after_total = 0
        for path in sorted(FONTS_DIR.glob("*.otf")):
            before_size, after_size = build_font_subset(path, text_file)
            before_total += before_size
            after_total += after_size

    return before_total, after_total


def format_bytes(size: int) -> str:
    units = ["B", "KB", "MB", "GB"]
    value = float(size)
    for unit in units:
        if value < 1024 or unit == units[-1]:
            return f"{value:.1f}{unit}"
        value /= 1024
    return f"{size}B"


def main() -> None:
    image_alt_lookup = load_alt_lookup(SERVER_SEEDS_DIR / "images.jsonl")
    profile_image_alt_lookup = load_alt_lookup(SERVER_SEEDS_DIR / "profileImages.jsonl")

    image_before, image_after = optimize_image_directory(IMAGES_DIR, IMAGE_POLICY, image_alt_lookup)
    profile_before, profile_after = optimize_image_directory(
        PROFILE_IMAGES_DIR,
        PROFILE_IMAGE_POLICY,
        profile_image_alt_lookup,
    )
    write_public_asset_manifest()
    font_before, font_after = optimize_fonts()

    total_before = image_before + profile_before + font_before
    total_after = image_after + profile_after + font_after

    print(
        "\n".join(
            [
                f"images jpg fallback: {format_bytes(image_before)} -> {format_bytes(image_after)}",
                f"profile images jpg fallback: {format_bytes(profile_before)} -> {format_bytes(profile_after)}",
                f"fonts (otf source size vs subset woff2): {format_bytes(font_before)} -> {format_bytes(font_after)}",
                f"total fallback/source footprint: {format_bytes(total_before)} -> {format_bytes(total_after)}",
            ]
        )
    )


if __name__ == "__main__":
    main()
