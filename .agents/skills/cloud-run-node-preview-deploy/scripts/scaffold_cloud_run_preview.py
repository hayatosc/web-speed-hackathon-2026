#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


TEMPLATES = {
    "assets/templates/github/workflows/cloud-run-preview.yml.tmpl": ".github/workflows/cloud-run-preview.yml",
    "assets/templates/github/workflows/cloud-run-production.yml.tmpl": ".github/workflows/cloud-run-production.yml",
    "assets/templates/github/scripts/upsert_preview_comment.py.tmpl": ".github/scripts/upsert_preview_comment.py",
}

SERVICE_NAME_PATTERN = re.compile(r"^[a-z]([-a-z0-9]*[a-z0-9])?$")
GITIGNORE_MARKER = "# Cloud Run GitHub Actions"
GITIGNORE_ENTRY = "gha-creds-*.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Scaffold GitHub Actions workflows for deploying a Node.js repository "
            "to Cloud Run from source with per-PR preview services."
        )
    )
    parser.add_argument("--project-dir", required=True, help="Target repository directory")
    parser.add_argument("--project-id", required=True, help="Google Cloud project ID")
    parser.add_argument("--region", required=True, help="Cloud Run region, for example asia-northeast1")
    parser.add_argument("--service-name", required=True, help="Stable Cloud Run service name")
    parser.add_argument(
        "--workload-identity-provider",
        required=True,
        help="Full Workload Identity Provider resource name",
    )
    parser.add_argument(
        "--deployer-service-account",
        required=True,
        help="Google Cloud deployer service account email",
    )
    parser.add_argument(
        "--production-branch",
        default="main",
        help="Git branch that triggers stable deployments",
    )
    parser.add_argument(
        "--preview-max-instances",
        type=int,
        default=1,
        help="Maximum Cloud Run instances for preview services",
    )
    parser.add_argument(
        "--preview-min-instances",
        type=int,
        default=0,
        help="Minimum Cloud Run instances for preview services",
    )
    parser.add_argument(
        "--production-max-instances",
        type=int,
        default=1,
        help="Maximum Cloud Run instances for the stable service",
    )
    parser.add_argument(
        "--production-min-instances",
        type=int,
        default=1,
        help="Minimum Cloud Run instances for the stable service",
    )
    visibility = parser.add_mutually_exclusive_group()
    visibility.add_argument(
        "--public",
        dest="public",
        action="store_true",
        help="Deploy public Cloud Run services with --allow-unauthenticated",
    )
    visibility.add_argument(
        "--private",
        dest="public",
        action="store_false",
        help="Deploy private Cloud Run services with --no-allow-unauthenticated",
    )
    parser.set_defaults(public=True)
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing generated files",
    )
    return parser.parse_args()


def validate_args(args: argparse.Namespace, project_dir: Path) -> None:
    if not project_dir.is_dir():
        raise SystemExit(f"Target directory does not exist: {project_dir}")

    if not (project_dir / "package.json").is_file():
        raise SystemExit(f"Expected package.json in target directory: {project_dir}")

    if len(args.service_name) > 49:
        raise SystemExit("Cloud Run service names must be 49 characters or fewer")

    if not SERVICE_NAME_PATTERN.fullmatch(args.service_name):
        raise SystemExit(
            "Cloud Run service names must start with a letter and contain only "
            "lowercase letters, digits, and hyphens"
        )

    if not args.production_branch.strip():
        raise SystemExit("Production branch must not be empty")

    for name in (
        "preview_max_instances",
        "preview_min_instances",
        "production_max_instances",
        "production_min_instances",
    ):
        if getattr(args, name) < 0:
            raise SystemExit(f"{name.replace('_', '-')} must be zero or greater")

    if args.preview_min_instances > args.preview_max_instances:
        raise SystemExit("preview-min-instances must be less than or equal to preview-max-instances")

    if args.production_min_instances > args.production_max_instances:
        raise SystemExit(
            "production-min-instances must be less than or equal to production-max-instances"
        )


def load_template(template_path: Path) -> str:
    return template_path.read_text(encoding="utf-8")


def render_template(template: str, replacements: dict[str, str]) -> str:
    rendered = template
    for key, value in replacements.items():
        rendered = rendered.replace(key, value)
    return rendered


def write_file(path: Path, content: str, force: bool) -> None:
    if path.exists() and not force:
        raise SystemExit(f"Refusing to overwrite existing file without --force: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def ensure_gitignore(project_dir: Path) -> None:
    gitignore_path = project_dir / ".gitignore"
    if gitignore_path.exists():
        content = gitignore_path.read_text(encoding="utf-8")
    else:
        content = ""

    if GITIGNORE_ENTRY in content:
        return

    block = f"{GITIGNORE_MARKER}\n{GITIGNORE_ENTRY}\n"
    if content and not content.endswith("\n"):
        content += "\n"
    content += block
    gitignore_path.write_text(content, encoding="utf-8")


def main() -> int:
    args = parse_args()
    skill_dir = Path(__file__).resolve().parent.parent
    project_dir = Path(args.project_dir).resolve()
    validate_args(args, project_dir)

    auth_flag = "--allow-unauthenticated" if args.public else "--no-allow-unauthenticated"
    replacements = {
        "__PROJECT_ID__": args.project_id,
        "__REGION__": args.region,
        "__SERVICE_NAME__": args.service_name,
        "__WORKLOAD_IDENTITY_PROVIDER__": args.workload_identity_provider,
        "__DEPLOYER_SERVICE_ACCOUNT__": args.deployer_service_account,
        "__PRODUCTION_BRANCH__": args.production_branch,
        "__PREVIEW_MAX_INSTANCES__": str(args.preview_max_instances),
        "__PREVIEW_MIN_INSTANCES__": str(args.preview_min_instances),
        "__PRODUCTION_MAX_INSTANCES__": str(args.production_max_instances),
        "__PRODUCTION_MIN_INSTANCES__": str(args.production_min_instances),
        "__AUTH_FLAG__": auth_flag,
    }

    written_files: list[Path] = []
    for source_relative, destination_relative in TEMPLATES.items():
        source_path = skill_dir / source_relative
        destination_path = project_dir / destination_relative
        rendered = render_template(load_template(source_path), replacements)
        write_file(destination_path, rendered, args.force)
        written_files.append(destination_path)

    ensure_gitignore(project_dir)

    print("Generated files:")
    for path in written_files:
        print(f"- {path}")
    print(f"- {project_dir / '.gitignore'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
