#! /usr/bin/env node

const { Command } = require("commander");

const program = new Command();

program
  .version("1.0.0")
  .description("Custom CLI tool for compressing and decompressing files");

program
  .command("compress <file>")
  .description("Compress a file")
  // .option("-f,--force", "如果创建的文件存在则直接覆盖")
  .action((file, option) => {
    require("../lib/compress")(file, { ...option, type: "compress" });
  });

program
  .command("decompress <file>")
  .description("Decompress a file")
  .action((file, option) => {
    require("../lib/compress")(file, { ...option, type: "decompress" });
  });

program.parse(process.argv);
