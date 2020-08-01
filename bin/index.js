#!/usr/bin/env node
"use strict";

const chalk = require("chalk");
const puppeteer = require("puppeteer");

const convertMain = async ({ _: [cmd, url] }) => {
  if (!url) {
    console.log(chalk.red("Missing document URL."));
    process.exit(1);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
  });
  const buffer = await page.pdf({ format: "A4" });

  process.stdout.write(buffer);

  await browser.close();
};

require("yargs")
  .scriptName("web-to-pdf")
  .usage("$0 <cmd> [args]")
  .command(
    "convert",
    "convert the Web document into PDF.",
    (yargs) => {
      yargs.positional("url", {
        type: "string",
        describe: "URL of the document to convert ot PDF",
      });
    },
    convertMain
  )
  .help().argv;
