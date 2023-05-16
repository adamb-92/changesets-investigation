const parseChangelog = require("changelog-parser");
const fs = require("fs");

const changelogPath = process.argv[2];

parseChangelog(changelogPath, function (err, result) {
  if (err) throw err;

  // changelog object
  const { body, version } = result?.versions?.[0];

  fs.writeFileSync("./.changeset/release-notes.md", body);

  console.log(version);
});
