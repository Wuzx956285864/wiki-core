const extra = require("fs-extra");
const ZipGenerator = require("./commands/generator");

module.exports = async function (name, options) {
  const dir = process.cwd();
  if (options.force) {
    const docsAir = path.join(dir, "docs");
    const i18nAir = path.join(dir, "i18n");
    const swagger = path.join(dir, "swagger");
    await extra.remove(docsAir);
    await extra.remove(i18nAir);
    await extra.remove(swagger);
  }
  if (options.type === "compress") {
    compressGenerator(name, dir);
  }
  if (options.type === "decompress") {
    decompressGenerator(name, dir);
  }
};
// 读取当前目录下所有文档进行压缩
const compressGenerator = (name, targeAir) => {
  const generator = new ZipGenerator(name, targeAir);

  generator.create();
};
// 解析指定压缩包 根据配置分别导出至指定目录
const decompressGenerator = (name, targeAir) => {
  const generator = new ZipGenerator(name, targeAir);

  generator.analysis();
};
