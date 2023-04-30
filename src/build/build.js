const path = require("path");
const ejs = require("ejs");
const fs = require("fs-extra");

const assetsPathSource = path.join(__dirname, "../../dist/assets");
let assetsPathDestination = path.join(__dirname, "../../dev/assets");
const templatePathSource = path.join(__dirname, "./index.ejs");
let templatePathDestination = path.join(__dirname, "../../dev/index.html");

let config = {
  MODE: "development",
  TITLE: "Stream Overlay",
  DESCRIPTION: "Stream overlay for activating video memes.",
};

let production = false;
if (process.argv[2] == "production") {
  production = true;
  console.log("Production mode.");
}

if (production) {
  config.MODE = "production";
  templatePathDestination = path.join(__dirname, "../../dist/index.html");
}

if (!production) {
  fs.copy(assetsPathSource, assetsPathDestination, (error) => {
    if (error) {
      console.log(error);
      return false;
    }
    console.log("Asset files copied.");
  });
}

fs.readFile(templatePathSource, "utf8", (error, ejsRendered) => {
  if (error) {
    console.log(error);
    return false;
  }

  const ejsCompiled = ejs.compile(ejsRendered);
  const ejsHTML = ejsCompiled(config);

  fs.writeFile(templatePathDestination, ejsHTML, (error) => {
    if (error) {
      console.log(error);
      return false;
    }
    console.log("Index.html file generated.");
    return true;
  });
});
