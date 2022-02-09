#!/usr/bin/env node

const {execSync} = require('child_process');
const os = require('os');

const runCommand = cmd => {
    try{
        execSync(`${cmd}`, {stdio: 'inherit'});
    }catch(e){
        console.error(`Failed to execute ${cmd}`, e);
        return false
    }

    return true;
}

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/ariakh55/create-express-edge-app ${repoName}`;

const installDepsCommand = `cd ${repoName} && npm install`;

console.log(`Cloning the repo /w name ${repoName}`);
const checkedOut = runCommand(gitCheckoutCommand);

if(!checkedOut) process.exit(-1);

console.log(`Installing dependencies for ${repoName}`);
const installedDeps = runCommand(installDepsCommand);

if(!installedDeps) process.exit(-1);

console.log("Congrats! You are now ready. Follow the commands to start!");
console.log(`cd ${repoName} && npm run dev`);
console.log("For production build just use npm run start\nHappy hacking!");

let rmCommand = "";
switch(os.type()){
    case 'Linux':
    case 'Darwin':
        rmCommand = `cd ${repoName} && rm -rf ./bin`;
    break;
    case 'Windows_NT':
        rmCommand = `cd ${repoName} && rmdir .\\bin /s /q`;
    break;
}

runCommand(rmCommand);