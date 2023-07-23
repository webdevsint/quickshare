import data from "../data.json" assert { type: "json" };

const id = window.location.href.split("/").pop();

const file = data.filter((f) => f.id === id)[0];

if (file === undefined) {
  console.log("File not found!");
} else {
  console.log(file);
}
