const { owner, repo, branch} = require("./config");
const { clearOutputFolder, downloadFiles, getDate } = require('./utils');
const { Octokit } = require("@octokit/rest");
require('dotenv').config();

const kit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})
let lastCommitSha = '';

async function checkCommits()
{
    try {
        const { data: commits } = await kit.repos.listCommits({
            owner,
            repo,
            sha: branch
        });

        if(commits.length > 0 && commits[0].sha !== lastCommitSha) {
            console.log(`[${getDate()}] New commit detected.`, commits[0].sha)

            clearOutputFolder();

            const { data: tree } = await kit.git.getTree({
                owner,
                repo,
                tree_sha: commits[0].commit.tree.sha,
                recursive: true
            });

            await downloadFiles(tree.tree);
            lastCommitSha = commits[0].sha
        } else {
            console.log(`[${getDate()}] No new commits were found.`)
        }
    } catch (error) {
        console.error(`[${getDate()}] エラー出ました。`, error.message)
    }
}

module.exports = {
    checkCommits
}