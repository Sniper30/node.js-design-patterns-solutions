import fs from "fs";
let count = 0;
let txt = "";
function concatFunction(dest, cb, ...files) {
  let file = String(files.shift());

  fs.readFile(file, "utf8", (err, data) => {
    txt += data;
    if (files.length === 0) return write(dest, txt, cb);
    concatFunction(dest, cb, files);
  });
}
const write = (dest, text, cb) =>
  fs.writeFile(dest, text, "utf8", (err) => (err ? cb(err) : cb(null, text)));

concatFunction(
  "dest.txt",
  (err, data) => {
    if (err) return console.log("error ", err);
    console.log(data);
  },
  "foo.txt",
  "boo.txt"
);
