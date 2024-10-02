import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let directorys = [];
let running = 0;
function nestedFiles(dir, cb) {
    readFile(dir, cb)
}

nestedFiles(__dirname + "/../", (err, data) => {
    if (err) return console.log("error: ", err);
    console.log("list", data);
});

function readFile(directory, cb) {

    fs.readdir(directory, { encoding: 'utf8', withFileTypes: true }, (err, dirs) => {
        running--
        if (!dirs) {
            if (!directorys.includes(directory)) directorys.push(directory);
            if (running === -1) return cb(null, directorys)
            return;
        }
        for (let i = 0; i < dirs.length; i++) {
            const file = dirs[i];
            let f = path.join(file.parentPath, file.name)
            if (!file.isDirectory() && !directorys.includes(f)) directorys.push(f);
            running++
            process.nextTick(() => readFile(f, cb))
        }
    });

}