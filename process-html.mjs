import fs from "node:fs/promises";
import { globby } from "globby";
import { minify } from "html-minifier";

// Get all HTML files from the output directory
const path = "./.dist/";
const files = await globby(`./dist/**/*.html`);

await Promise.all(
  files.map(async (file) => {
    console.log("Minifying file:", file);
    let html = await fs.readFile(file, "utf-8");

    // Minify the HTML
    html = minify(html, {
      removeComments: true,
      preserveLineBreaks: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyJS: true,
    });
    await fs.writeFile(file, html);
  })
);
