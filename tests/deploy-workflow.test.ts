import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("VPS deploy workflow", () => {
  it("uses SSH-based GitHub Actions deployment", () => {
    const workflowPath = resolve(process.cwd(), ".github/workflows/deploy.yml");
    const source = readFileSync(workflowPath, "utf8");

    expect(source).toContain("appleboy/ssh-action@v1");
    expect(source).toContain("scripts/deploy/deploy.sh");
    expect(source).toContain("DEPLOY_HOST");
    expect(source).toContain("DEPLOY_SSH_KEY");
  });

  it("ships a server-side deploy script", () => {
    const scriptPath = resolve(process.cwd(), "scripts/deploy/deploy.sh");

    expect(existsSync(scriptPath)).toBe(true);

    const source = readFileSync(scriptPath, "utf8");

    expect(source).toContain("REPO_DIR=");
    expect(source).toContain("SITE_PATH=");
    expect(source).toContain("npm ci");
    expect(source).toContain("npm run build");
  });
});
