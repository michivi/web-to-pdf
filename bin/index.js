#!/usr/bin/env node
"use strict";

const chalk = require("chalk");
const puppeteer = require("puppeteer");

const convertToPdf = async ({ url }) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
  });
  const buffer = await page.pdf({ format: "A4" });

  process.stdout.write(buffer);

  await browser.close();
};

const convertMain = async ({ _: [cmd, path] }) => {
  if (!path) {
    console.log(chalk.red("Missing document path."));
    process.exit(1);
  }

  const url = new URL(path, `file://${process.cwd()}/`).toString();

  return await convertToPdf({ url });
};

const downloadMain = async ({ _: [cmd, url] }) => {
  if (!url) {
    console.log(chalk.red("Missing document URL."));
    process.exit(1);
  }

  return await convertToPdf({ url });
};

require("yargs")
  .scriptName("web-to-pdf")
  .usage("$0 <cmd> [args]")
  .command(
    "convert",
    "convert the local Web document into PDF.",
    (yargs) => {
      yargs.positional("path", {
        type: "string",
        describe: "Path of the document to convert ot PDF",
      });
    },
    convertMain
  )
  .command(
    "download",
    "convert the remote Web document into PDF.",
    (yargs) => {
      yargs.positional("url", {
        type: "string",
        describe: "URL of the document to convert ot PDF",
      });
    },
    downloadMain
  )
  .help().argv;
