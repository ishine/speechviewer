#!/usr/bin/env node
import "dotenv/config.js";
import { createApp } from "./api.js";
import gracefulShutdown from "http-graceful-shutdown";
import express from "express";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import fs from "node:fs";
import open from "open";

let [datasetPath, dbPath] = process.argv.slice(2);

if (!datasetPath || !dbPath) {
	console.info("Welcome to Speech Viewer!\n");
	console.info("speechviewer [dataset_path] [db_path]");
	process.exit(1);
}

datasetPath = resolve(datasetPath);

if (!fs.existsSync(datasetPath)) {
	console.error(`dataset_path: [${datasetPath}] doesn't exist!`);
	process.exit(1);
}

dbPath = resolve(dbPath);

const app = await createApp(datasetPath, dbPath);

const INDEX_HTML_PATH = fileURLToPath(
	new URL("./dist/index.html", import.meta.url),
);

const PUBLIC_PATH = fileURLToPath(new URL("./dist/", import.meta.url));

app.use(express.static(PUBLIC_PATH));
app.get("*", (req, res) => res.sendFile(INDEX_HTML_PATH));

const PORT = Number.parseInt(process.env.PORT) || 8000;
app.listen(process.env.PORT || 8000, () =>
	console.log(`SpeechViewer is {http://127.0.0.1:${PORT}}`),
);

gracefulShutdown(app);

await open(`http://127.0.0.1:${PORT}`);
