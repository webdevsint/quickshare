const folderName = window.location.href.split("/").pop();

import(`../uploads/folders/${folderName}/data.json`, {
  assert: { type: "json" },
})
  .then((module) => {
    const data = module.default;

    document.title = `Folder - ${data.name}`;

    document.querySelector(".folder-name").innerHTML = data.name;

    data.files.forEach((file) => {
      const fileName = document.createElement("h2");
      fileName.innerHTML = file.name;

      const ul = document.createElement("ul");

      const fileType = document.createElement("li");
      fileType.innerHTML = file.mimeType;

      const fileSize = document.createElement("li");
      fileSize.innerHTML = file.size;

      const download = document.createElement("li");
      download.innerHTML = `<a href="${file.path}" download="${file.name}">Download File</a>`;

      ul.appendChild(fileType);
      ul.appendChild(fileSize);
      ul.appendChild(download);

      document.querySelector(".files").appendChild(fileName);
      document.querySelector(".files").appendChild(ul);

      const shareData = {
        title: `Folder - ${data.name}`,
        url: window.location.href,
      };

      document.querySelector(".share-button").onclick = async () => {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.log(err);
        }
      };
    });
  })
  .catch((error) => {
    // console.log("Folder not found!");
  });
