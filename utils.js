const { existsSync, mkdirSync, readdirSync, rmdirSync, unlinkSync, writeFileSync } = require("fs");
const { branch, output_dir, owner, repo } = require("./config");
const { join } = require("path");
const { Octokit} = require("@octokit/rest");
require('dotenv').config();

const kit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

function clearOutputFolder() {
    if (existsSync(output_dir)) {
        const files = readdirSync(output_dir);
        files.forEach((file) => {
            const filePath = join(output_dir, file);
            unlinkSync(filePath);
        });
        rmdirSync(output_dir);
    }
    mkdirSync(output_dir);
}

async function downloadFiles(tree) {
    for (const entry of tree) {
        const filePath = join(output_dir, entry.path);

        const { data } = await kit.repos.getContent({
            owner,
            repo,
            path: entry.path,
            ref: branch,
        });

        writeFileSync(filePath, Buffer.from(data.content, 'base64'));
    }
}
function getDate() {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}.${minutes}.${seconds}`;
}

module.exports = {
    clearOutputFolder,
    downloadFiles,
    getDate
}