# Cloud Run Source Deploy Checklist

Use this reference when you need the exact setup details behind the scaffolded workflows.

## Contents

- Verified Platform Facts
- Past Web Speed Hackathon Compatibility
- One-Time Google Cloud Setup
- GitHub Actions Constraints
- Node.js Readiness Checklist
- Official Docs

## Verified Platform Facts

- `gcloud run deploy SERVICE --source .` deploys directly from source code and uses Google Cloud buildpacks plus Cloud Build behind the scenes.
- Source deploys store built images in Artifact Registry. If the regional `cloud-run-source-deploy` repository does not exist yet, Cloud Run creates it automatically.
- Cloud Run service names must be 49 characters or fewer. The preview workflow therefore truncates the base service name before appending `-pr-<number>`.
- Cloud Run container file systems are writable, but they are in-memory and do not persist when the instance stops.
- The Node.js buildpack detects the package manager from the lockfile. Yarn takes precedence over pnpm, pnpm over Bun, Bun over npm, and npm is the fallback when no lockfile is present.
- The Node.js buildpack uses `scripts.start` from `package.json`, or `npm start` if `scripts.start` is absent. A `Procfile` is still a good explicit override when startup behavior is ambiguous.
- If a `build` script exists, the buildpack runs it by default. Override this with `gcp-build` in `package.json` or `GOOGLE_NODE_RUN_SCRIPTS` only when necessary.
- Cloud Run defaults to allowing up to 80 concurrent requests per instance. If the code is not concurrency safe, lower this explicitly. If the code keeps mutable local state, keep the service on one instance.

## Past Web Speed Hackathon Compatibility

Past public Web Speed Hackathon repositories are broadly compatible with source deploy, but they share an important constraint: they keep mutable state on the instance.

- 2021: Yarn workspaces monorepo, `express-session`, local SQLite file, `POST /api/v1/initialize`.
- 2022: Yarn 3 project, local SQLite file, `POST /api/initialize`.
- 2023: pnpm app, local SQLite file, `koa-session`, `POST /initialize`.
- 2024: pnpm workspace monorepo, `better-sqlite3`, signed cookies, `POST /api/v1/initialize`.

Implications for Cloud Run:

- These projects can be built from the repository root with buildpacks because they have a root `package.json` and a committed lockfile.
- They should not scale out to multiple instances unless their local state is moved out of the container.
- Preview and production services should each use `max-instances=1`.
- Production should usually use `min-instances=1` to avoid cold starts during scoring.
- Preview can keep `min-instances=0` to save cost.
- If a historical project pins an old runtime such as Node 16, confirm the current buildpack still accepts it. The buildpack officially supports Current and Active LTS releases, while older releases are only available on a best-effort basis.

## One-Time Google Cloud Setup

Run the following commands once per Google Cloud project and GitHub repository.

### 1. Enable APIs

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com
```

### 2. Create a deployer service account

```bash
gcloud iam service-accounts create github-cloud-run-deployer \
  --display-name="GitHub Cloud Run deployer"
```

### 3. Grant the deployer roles required for source deploy

Replace `PROJECT_ID` and `DEPLOYER_SA_EMAIL`.

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:DEPLOYER_SA_EMAIL" \
  --role="roles/run.sourceDeveloper"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:DEPLOYER_SA_EMAIL" \
  --role="roles/serviceusage.serviceUsageConsumer"
```

Grant `roles/iam.serviceAccountUser` on the runtime service account that Cloud Run should use. If the app does not need a custom runtime identity, use a dedicated runtime service account anyway so permissions stay explicit.

```bash
gcloud iam service-accounts add-iam-policy-binding RUNTIME_SA_EMAIL \
  --member="serviceAccount:DEPLOYER_SA_EMAIL" \
  --role="roles/iam.serviceAccountUser"
```

### 4. Grant the Cloud Build role required by source deploy

Replace `PROJECT_ID` and `PROJECT_NUMBER`.

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/run.builder"
```

This role can take a few minutes to propagate.

### 5. Create the Workload Identity pool and provider

Prefer numeric GitHub IDs over mutable names. Replace `PROJECT_ID`, `PROJECT_NUMBER`, `GITHUB_OWNER_ID`, and `GITHUB_REPO_ID`.

```bash
gcloud iam workload-identity-pools create github \
  --project=PROJECT_ID \
  --location=global \
  --display-name="GitHub Actions"

gcloud iam workload-identity-pools providers create-oidc repo \
  --project=PROJECT_ID \
  --location=global \
  --workload-identity-pool=github \
  --display-name="GitHub repository provider" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository_id=assertion.repository_id,attribute.repository_owner_id=assertion.repository_owner_id" \
  --attribute-condition="assertion.repository_owner_id=='GITHUB_OWNER_ID' && assertion.repository_id=='GITHUB_REPO_ID'"
```

### 6. Allow the repository to impersonate the deployer service account

Replace `PROJECT_ID`, `PROJECT_NUMBER`, `GITHUB_REPO_ID`, and `DEPLOYER_SA_EMAIL`.

```bash
gcloud iam service-accounts add-iam-policy-binding DEPLOYER_SA_EMAIL \
  --project=PROJECT_ID \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository_id/GITHUB_REPO_ID"
```

### 7. Extract the provider resource name for GitHub Actions

```bash
gcloud iam workload-identity-pools providers describe repo \
  --project=PROJECT_ID \
  --location=global \
  --workload-identity-pool=github \
  --format="value(name)"
```

Use the returned value for `--workload-identity-provider` in the scaffold script.

## GitHub Actions Constraints

- Use `permissions: id-token: write` so the workflow can request an OIDC token.
- Keep preview deploys on `pull_request` events by default.
- Do not expect normal secrets on forked PRs. GitHub does not pass repository secrets to `pull_request` workflows triggered from forks, and the `GITHUB_TOKEN` is read-only there.
- Avoid `pull_request_target` for deployment jobs. GitHub explicitly warns that running untrusted code there can expose secrets or write privileges.
- If the user insists on fork previews, stop and design a separate trusted pipeline. Do not silently switch triggers.

## Node.js Readiness Checklist

- Confirm the application binds to `process.env.PORT`.
- Confirm `package.json` exists at the deploy root.
- Commit exactly one lockfile whenever possible.
- Set `engines.node` when the runtime version matters.
- Use `gcp-build` or `GOOGLE_NODE_RUN_SCRIPTS` only when the buildpack default is wrong.
- Keep the production service name short enough that preview names remain readable after truncation.
- If the app writes to local SQLite or local upload directories, account for the fact that Cloud Run storage is in-memory and counts against instance memory.
- If the app uses in-process sessions or other per-instance memory, keep `max-instances=1`.

## Official Docs

- Cloud Run source deploy: https://docs.cloud.google.com/run/docs/deploying-source-code
- Cloud Run deployment overview and service name limit: https://docs.cloud.google.com/run/docs/deploying
- Cloud Run Node.js buildpack: https://docs.cloud.google.com/docs/buildpacks/nodejs
- Cloud Run container runtime contract: https://docs.cloud.google.com/run/docs/container-contract
- Cloud Run concurrency: https://docs.cloud.google.com/run/docs/about-concurrency
- Cloud Run minimum instances: https://docs.cloud.google.com/run/docs/configuring/min-instance
- Workload Identity Federation for deployment pipelines: https://docs.cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines
- GitHub OIDC with Google Cloud: https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-google-cloud-platform
- GitHub workflow events and pull request security notes: https://docs.github.com/en/enterprise-server@3.17/actions/reference/workflows-and-actions/events-that-trigger-workflows
