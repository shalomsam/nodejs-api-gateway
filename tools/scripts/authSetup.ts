#!/usr/bin/env node

import * as yargs from "yargs";
import { v4 as uuidv4 } from "uuid";
import { randomBytes } from "crypto";
import { writeFile, existsSync, appendFile, symlink } from "fs";
import { resolve } from "path";
import { config as envConfig } from "dotenv";

const _rootPath = process.cwd();

const argv = yargs
    .version("1.0.0")
    .scriptName("authSetup")
    .option("env", {
        alias: "e",
        default: "development",
    })
    .option("app", {
        alias: "a",
        required: true,
    })
    .option("appsBasePath", {
        default: resolve(_rootPath, "./apps"),
    })
    .option("rootPath", {
        default: _rootPath
    })
    .help()
    .argv;

function authSetup() {
    const { env, app, appsBasePath, rootPath } = argv;
    let filename = env === "development" ? '.local.env' : '.env';
    const filePath = resolve(rootPath, filename)
    const fileExists = existsSync(filePath);
    const adminClientKeys = uuidv4();
    const adminClientSecret = randomBytes(256).toString('base64');

    const fileContent = `
    ADMIN_CLIENT_API_KEY="${adminClientKeys}"
    ADMIN_CLIENT_API_SECRET="${adminClientSecret}"
    `.replace(/ +/g, "").trim();

    // If .env doesn't exist 
    if (!fileExists) {
        console.log(`Creating env file '${filePath}'.\n`);
        writeFile(filePath, fileContent, (err) => {
            if (err) {
                console.log(`failed to write file '${filePath}'`);
            } else {
                console.log(`'${filePath}' generated successfully!`);
            }
        });
    } else {
        // if ADMIN_CLIENT_API_KEY does not exists in .env
        // append to file
        const envVars = envConfig({ path: filePath });
        if (!envVars['ADMIN_CLIENT_API_KEY']) {
            appendFile(filePath, fileContent, (err) => {
                if (err) {
                    console.log(`failed to write(append) file '${filePath}'`);
                } else {
                    console.log(`ADMIN_CLIENT key and secret added to '${filePath}' successfully!`);
                }
            });
        }
    }

    // create symlink to app
    const symlinkPath = resolve(appsBasePath, app as string, filename);
    symlink(filePath, symlinkPath, (err) => {
        if (err) {
            console.log(`failed to create symlink for '${app}' @ '${symlinkPath}' to '${filePath}'`);
        } else {
            console.log(`Symlink '${symlinkPath}' created successfully!`);
        }
    });
}

authSetup();
