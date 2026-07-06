const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");

const normalizeBasePath = (value) => {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") {
    return "";
  }

  return `/${trimmed.replace(/^\/+/, "").replace(/\/+$/, "")}`;
};

const basePath = normalizeBasePath(process.env.APP_BASE_PATH);
const manifestScope = basePath ? `${basePath}/` : "/";
const replacements = {
  __BASE_PATH__: basePath,
  __START_URL__: manifestScope,
  __SCOPE__: manifestScope,
};

const replaceTokens = (contents) =>
  Object.entries(replacements).reduce(
    (output, [token, value]) => output.split(token).join(value),
    contents
  );

for (const filename of ["index.html", "manifest.json"]) {
  const templatePath = path.join(publicDir, `${filename}.template`);
  const outputPath = path.join(publicDir, filename);
  const template = fs.readFileSync(templatePath, "utf8");
  fs.writeFileSync(outputPath, replaceTokens(template), "utf8");
}
