---
name: cloud-run-node-preview-deploy
description: Deploy a Node.js repository, especially Web Speed Hackathon style applications, directly to Google Cloud Run from source without a Dockerfile. Use when Claude needs to wire GitHub Actions based delivery with one Cloud Run preview service per pull request, automatic preview cleanup on PR close, and automatic production deploys when the main branch is updated.
---

# Cloud Run Node Preview Deploy

Use this skill to ship a Node.js repository to Cloud Run with `gcloud run deploy --source .` and GitHub Actions.

Prefer the bundled scaffold script and templates instead of hand-writing the workflows each time.

## Quick Start

1. Verify that the application is Cloud Run ready.
   - Confirm the app listens on `process.env.PORT`.
   - Confirm `package.json` has a working `start` script, or add a `Procfile`.
   - Confirm the correct lockfile is committed.
   - For past Web Speed Hackathon projects, check whether the app keeps state in a local SQLite file, local upload directory, or in-process session store. If it does, keep the Cloud Run service on a single instance.
2. Read `references/setup-checklist.md` and perform the one-time Google Cloud and GitHub OIDC setup if the repository is not wired yet.
3. Scaffold the files into the target repository:

```bash
python3 scripts/scaffold_cloud_run_preview.py \
  --project-dir /path/to/repo \
  --project-id my-gcp-project \
  --region asia-northeast1 \
  --service-name my-web-app \
  --workload-identity-provider projects/123456789/locations/global/workloadIdentityPools/github/providers/my-repo \
  --deployer-service-account github-cloud-run-deployer@my-gcp-project.iam.gserviceaccount.com
```

4. Review the generated `.github/workflows/*.yml` files and commit them.

## Workflow

1. Assess the existing deployment path.
   - Preserve an existing Dockerfile or Terraform based deployment unless the user explicitly wants direct source deploys.
   - Prefer this skill when the project is a plain Node.js repository and the user wants the fastest path to Cloud Run.
2. Make the Node.js app buildpack friendly.
   - Keep `package.json`, the lockfile, and the `start` command in sync.
   - If the default buildpack behavior is wrong, adjust `gcp-build` or `GOOGLE_NODE_RUN_SCRIPTS` instead of inventing ad hoc shell steps.
   - Read `references/setup-checklist.md` for the verified Node.js buildpack behavior.
   - If the repository still pins an old Node.js line such as Node 16, verify that the current buildpack still accepts it before relying on source deploy. Prefer updating to a current supported LTS when the project can tolerate it.
3. Bootstrap trust and IAM.
   - Use Workload Identity Federation instead of long-lived JSON credentials.
   - Restrict the provider with repository specific conditions before granting impersonation.
   - Use a dedicated deployer service account.
4. Scaffold the workflow files.
   - Run `scripts/scaffold_cloud_run_preview.py`.
   - The script copies a preview workflow, a production workflow, and a PR comment helper into the target repository.
   - The preview workflow truncates preview service names to stay within Cloud Run's 49 character limit.
   - For Web Speed Hackathon style apps, the generated workflows pin preview and production to one Cloud Run instance by default because the historical projects rely on local disk or per-instance state.
5. Verify repository specific details.
   - Keep preview deployments on `pull_request` events for same-repository PRs.
   - Keep production deployments on pushes to the stable branch, defaulting to `main`.
   - Adjust runtime service account or environment variables only when the application needs them.
   - If the app uses local SQLite or in-process sessions, do not raise `max-instances` above `1` unless you first externalize that state.
6. Validate the deployment shape.
   - Open or update a pull request and confirm a dedicated preview URL appears.
   - Merge to `main` and confirm the stable service URL updates.
   - Close a pull request and confirm the preview service is removed.

## Rules

- Never use `pull_request_target` to build or deploy untrusted pull request code unless the user explicitly accepts that risk.
- Default preview deployments to same-repository pull requests because GitHub does not pass normal secrets to forked PR workflows.
- Keep preview and production on separate Cloud Run services. Do not reuse the production service for previews.
- For Web Speed Hackathon style apps that reset state with `/initialize`, default Cloud Run scaling to a single instance.
- Keep credentials out of the repository. Use OIDC and Workload Identity Federation.
- Read `references/setup-checklist.md` whenever you need the exact `gcloud` commands, IAM roles, or GitHub security caveats.

## Resources

- `scripts/scaffold_cloud_run_preview.py`: Copy the bundled templates into a target repository and fill in project specific values.
- `references/setup-checklist.md`: Verified setup notes for IAM, Workload Identity Federation, Node.js buildpacks, and GitHub Actions security constraints.
- `assets/templates/github/workflows/cloud-run-preview.yml.tmpl`: Deploy one preview service per PR and delete it when the PR closes.
- `assets/templates/github/workflows/cloud-run-production.yml.tmpl`: Deploy the stable Cloud Run service on pushes to the production branch.
- `assets/templates/github/scripts/upsert_preview_comment.py.tmpl`: Upsert a PR comment that points reviewers to the latest preview URL.
