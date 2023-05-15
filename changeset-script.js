const fm = require("front-matter");
const fs = require("fs");
const {} = require("changesets");

const changesetFiles = process.argv.filter(function (val) {
  return val.match(/^.changeset\/((?!README)).*\.md$/);
});

changesetFiles.forEach((changesetPath) => {
  fs.access(changesetPath, fs.F_OK, (err) => {
    if (err) {
      // changeset removed from repo
      return;
    }

    const changesetContent = fs.readFileSync(changesetPath, "utf8", {
      encoding: "utf8",
    });

    const { attributes, body } = fm(changesetContent);

    const updatedPackages = Object.keys(attributes);

    if (updatedPackages.length < 2) {
      return;
    }

    console.log("Identified one changeset with multiple packages linked");
    console.log(
      "Attempting to create individual changesets for each package\n"
    );

    updatedPackages.forEach((package) => {
      const changesetContent = `---\n"${package}": ${attributes[package]}\n---\n\n${body}`;
      fs.writeFileSync(
        `${changesetPath.split(".md")[0]}-${package}.md`,
        changesetContent
      );
    });

    fs.unlink(changesetPath, function (err) {
      if (err) {
        // other errors, e.g. maybe we don't have enough permission
        console.error("Error occurred while trying to remove file");
      } else {
        console.log("Successfully separated changeset");
      }
    });
  });
});
