import { test } from "node:test";
import assert from "node:assert/strict";
import { safeImage, safeLink, validateUpload, projectSchema, postSchema, toolSchema } from "../src/features/content/validation";
import { demoProjects, demoPosts, demoTools } from "../src/features/content/demo";

function writable<T extends { id: string; created_at: string; updated_at: string }>(record: T) {
  const { id: _id, created_at: _created, updated_at: _updated, ...rest } = record; return rest;
}
test("unsafe link schemes and credential-bearing URLs are rejected", () => {
  for (const value of ["javascript:alert(1)", "data:text/html,hello", "//evil.example", "https://user:password@example.com"]) assert.equal(safeLink.safeParse(value).success, false);
  assert.equal(safeLink.safeParse("https://example.com/app").success, true);
});
test("image sources accept local paths and https but reject protocol-relative and script URLs", () => {
  for (const value of ["javascript:alert(1)", "data:image/svg+xml,<svg/>", "//evil.example/a.png", "/\\evil.example/a.png"]) assert.equal(safeImage.safeParse(value).success, false);
  assert.equal(safeImage.safeParse("/images/project.webp").success, true);
});
test("published writing needs a date and body; thumbnails need alternative text", () => {
  assert.equal(postSchema.safeParse({ ...writable(demoPosts[0]), published_at: null }).success, false);
  assert.equal(postSchema.safeParse({ ...writable(demoPosts[0]), body: "" }).success, false);
  assert.equal(projectSchema.safeParse({ ...writable(demoProjects[0]), thumbnail_url: "https://example.com/image.png", thumbnail_alt: "" }).success, false);
});
test("unknown fields cannot be passed through to database writes", () => {
  assert.equal(projectSchema.safeParse({ ...writable(demoProjects[0]), created_at: "2020-01-01" }).success, false);
});
test("a custom tool needs no catalogue match and can use an initial", () => {
  assert.equal(toolSchema.safeParse({ ...writable(demoTools[0]), name: "My private utility", url: null, icon_slug: null, icon_url: null }).success, true);
});
test("uploads enforce size and supported raster types", () => {
  assert.equal(validateUpload({ size: 1024, type: "image/webp" }), null);
  assert.ok(validateUpload({ size: 1024, type: "image/svg+xml" }));
  assert.ok(validateUpload({ size: 6 * 1024 * 1024, type: "image/png" }));
});
