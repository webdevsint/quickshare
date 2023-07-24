import data from "../data.json" assert { type: "json" };

const id = window.location.href.split("/").pop();

const file = data.filter((f) => f.id === id)[0];

if (file === undefined) {
  console.log("File not found!");
} else {
  document.title = `File - ${file.name}`;

  document.querySelector(".file-name").innerHTML = file.name;
  document.querySelector(".file-type").innerHTML = file.mimeType;
  document.querySelector(".file-size").innerHTML = file.size;

  const link = document.createElement("a");
  link.innerHTML = "Download File";
  link.download = file.name;
  link.href = file.path;

  document.querySelector(".download").appendChild(link);

  const shareData = {
    title: document.title,
    url: window.location.href,
  };

  document.querySelector(".share-button").onclick = async () => {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log(err);
    }
  };
}
