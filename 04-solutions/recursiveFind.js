import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path';
let arrayToSearch = [];
let tasks = [];
let running = 0;
const __diname = path.dirname(fileURLToPath(import.meta.url));
function recursiveFind(dir, keyword, cb) {
    tasks.push(() => {
        readFile(dir, keyword, cb)
    })
    while (tasks.length) {
        let task = tasks.shift();
        task()
    }
}

function searchKeyword(keyword, cb) {
    let coincidence = []
    arrayToSearch.forEach(file => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) cb(err)
            if (data.match(keyword)) coincidence.push({ file, data })
            arrayToSearch.shift();
            if (arrayToSearch.length === 0) return cb(null, coincidence)
        })
    })
}

function readFile(dir, keyword, cb) {

    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        running--
        if (err) return cb(err)
        if (!files) return;
        files.forEach(file => {
            let _file = path.join(file.parentPath, file.name);
            running++
            if (!file.isDirectory()) {
                arrayToSearch.push(_file)
                running--
                if (!files.some(e => e.isDirectory()) && running === -1) return searchKeyword(keyword, cb)
                return
            }
            return recursiveFind(_file, keyword, cb);

        })

    })
}

let pathToSearch = String(process.argv[2])
let keyword = String(process.argv[3])
recursiveFind(__diname + pathToSearch, keyword, (err, coincidence) => {
    if (err) return console.log('error', err);
    if (coincidence.length > 0) return console.log('I found', coincidence)
    else return console.log('Nothing was found', coincidence)
})