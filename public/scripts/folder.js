const folderName = window.location.href.split("/").pop();

import(`../uploads/folders/${folderName}/data.json`, {
  assert: { type: "json" },
})
  .then((module) => {
    const data = module.default;

    console.log(data);
  })
  .catch((error) => {
    console.log("Folder not found!");
  });
