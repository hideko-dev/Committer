const { Octokit } = require("@octokit/rest");
const { checkCommits } = require('./commits')
const { interval } = require('./config')
require('dotenv').config();

checkCommits()
setInterval(checkCommits, interval)