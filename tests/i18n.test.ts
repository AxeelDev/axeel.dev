import { test } from "node:test";
import assert from "node:assert/strict";
import { localeFromAcceptLanguage } from "../src/lib/i18n/config";
import { localize, translationSchema } from "../src/features/content/translations";
import { demoProjects } from "../src/features/content/demo";

test("the device language picks Estonian or German only when preferred over English", () => {
  assert.equal(localeFromAcceptLanguage("et-EE,et;q=0.9,en;q=0.8"), "et");
  assert.equal(localeFromAcceptLanguage("de-AT,de;q=0.9"), "de");
  assert.equal(localeFromAcceptLanguage("en-US,en;q=0.9,et;q=0.8"), "en");
  assert.equal(localeFromAcceptLanguage("fr-FR,fr;q=0.9"), "en");
  assert.equal(localeFromAcceptLanguage("fr;q=0.9,et;q=0.5"), "et");
  assert.equal(localeFromAcceptLanguage("et;q=0,de;q=0.4"), "de");
  assert.equal(localeFromAcceptLanguage(null), "en");
});

test("translated fields replace English ones, and empty ones fall back to English", () => {
  const project = { ...demoProjects[0], translations: { et: { summary: "Eesti kokkuvõte", category: "  ", gallery_alts: "Esimene\n\nKolmas" } } };
  const et = localize(project, "et");
  assert.equal(et.summary, "Eesti kokkuvõte");
  assert.equal(et.category, project.category);
  assert.deepEqual(et.gallery.map((image) => image.alt), ["Esimene", project.gallery[1].alt, "Kolmas"]);
  assert.equal(localize(project, "de").summary, project.summary);
  assert.equal(localize(project, "en"), project);
  assert.equal(localize({ ...project, translations: undefined }, "et").summary, project.summary);
});

test("stored translations drop empty fields and reject unknown or oversized ones", () => {
  const schema = translationSchema("tools");
  assert.deepEqual(schema.parse({ et: { notes: "Märkus" }, de: { notes: " " } }), { et: { notes: "Märkus" } });
  assert.deepEqual(schema.parse(undefined), {});
  assert.equal(schema.safeParse({ et: { name: "Renamed" } }).success, false);
  assert.equal(schema.safeParse({ fr: { notes: "Note" } }).success, false);
  assert.equal(schema.safeParse({ et: { notes: "x".repeat(281) } }).success, false);
});
