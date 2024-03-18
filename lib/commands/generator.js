const AdmZip = require("adm-zip");
const path = require("path");
const extra = require("fs-extra");
const ora = require("ora");
const process = require("child_process");
const babelParser = require("@babel/parser"); // 将JS源码转换为语法树
const traverse = require("@babel/traverse").default; // 遍历和更新节点
const generator = require("@babel/generator").default; // 把AST抽象语法树反解

// 使用 ora 初始化，传入提示信息message
const spinner = ora("Loading unicorns");

/**
 * @wrapLoading 交互加载动画
 * @param {*} fn 在 wrapLoading 函数中执行的方法
 * @param {*} message 执行动画时的提示信息
 * @param {...any} args 传递给 fn 方法的参数
 */
async function wrapLoading(fn, message, ...args) {
  spinner.test = message.loadingMsg;
  // 开始加载动画
  spinner.start();

  try {
    // 执行传入的方法 fn
    const result = await fn(...args);
    // 动画修改为成功
    spinner.succeed(message.seccessfunlMsg);
    return result;
  } catch (error) {
    // 动画修改为失败
    spinner.fail(message.failedMsg + ":", error);
  }
}

class CreateGenerator {
  constructor(name, dir) {
    this.name = name;
    this.dir = dir;
  }

  async create() {
    spinner.start();
    const file = new AdmZip();
    file.addLocalFolder(path.join(this.dir, "docs"));

    const configPath = path.resolve(this.dir, "docusaurus.config.js");
    const configData = await this.readJSX(configPath);
    const routesPath = path.resolve(
      this.dir,
      "docusaurus.config.d",
      "routes.js"
    );

    // 解析 docusaurus.config
    const parsed = babelParser.parse(configData, {
      sourceType: "module",
      plugins: ["jsx"],
    });

    const config = {
      menu: eval(await this.readJSX(routesPath)),
    };
    const option = ["title", "tagline", "baseUrl", "i18n"];
    parsed.program.body.forEach((node) => {
      if (
        node.type === "VariableDeclaration" &&
        node.declarations[0].id.name === "docConfig"
      ) {
        node.declarations[0].init.properties.forEach((item) => {
          if (option.includes(item.key.name)) {
            config[item.key.name] = eval(
              "(" + generator(item.value).code + ")"
            );
          }
        });
      }
    });
    config.i18n.locales.forEach((locale) => {
      const swaggerPath = path.join(this.dir, "swagger", locale);
      if (locale !== config.i18n.defaultLocale) {
        file.addLocalFolder(
          path.join(
            this.dir,
            config.i18n.path,
            locale,
            "docusaurus-plugin-content-docs",
            "current"
          ),
          locale
        );
        file.addLocalFolder(swaggerPath, `${locale}/swagger`);
      } else {
        file.addLocalFolder(swaggerPath, "swagger");
      }
    });
    file.addFile("info.json", Buffer.from(JSON.stringify(config)));
    extra.writeFileSync(path.join(this.dir, this.name), file.toBuffer());
    extra.remove(path.join(this.dir, "docs"));
    extra.remove(path.join(this.dir, "i18n"));
    extra.remove(path.join(this.dir, "swagger"));
    spinner.succeed("压缩成功！");
  }

  async analysis() {
    spinner.start();
    const zip = new AdmZip(path.join(this.dir, this.name));
    // 获取entry对应的text
    const info = JSON.parse(zip.readAsText(zip.getEntry("info.json"), "utf8"));
    const i18n = info.i18n;
    const base_url_path = path.join(this.dir, info.baseUrl);

    extra.ensureDirSync(base_url_path);

    if (i18n.path) extra.ensureDirSync(path.join(this.dir, i18n.path));

    i18n.locales.forEach((locale) => {
      if (locale !== i18n.defaultLocale) {
        extra.ensureDir(
          path.join(
            this.dir,
            i18n.path,
            locale,
            "docusaurus-plugin-content-docs",
            "current"
          )
        );
      }
      extra.ensureDir(path.join(this.dir, "swagger", locale));
    });

    zip.getEntries().forEach((entry) => {
      // 读取所以mdx文件 根据locales进行存放
      const localesStr = i18n.locales.find((item) =>
        entry.entryName.includes(`${item}/`)
      );
      if (/\.mdx?$/.test(entry.entryName)) {
        const isDefaultLocale = !i18n.locales.some((item) =>
          entry.entryName.includes(`${item}/`)
        );
        if (isDefaultLocale) {
          zip.extractEntryTo(entry, base_url_path, false, true);
        } else {
          const localesPath = path.join(
            this.dir,
            i18n.path,
            localesStr,
            "docusaurus-plugin-content-docs",
            "current"
          );
          zip.extractEntryTo(entry, localesPath, false, true);
        }
      }

      if (entry.entryName.includes("swagger/")) {
        const localesPath = path.join(
          this.dir,
          "swagger",
          localesStr || i18n.defaultLocale
        );
        zip.extractEntryTo(entry, localesPath, false, true);
      }
    });
    i18n.locales.forEach((locale) => {
      if (locale !== i18n.defaultLocale) {
        process.exec(
          `npm run write-translations -- --locale ${locale}`,
          (error) => {
            if (!error) {
              // 成功
              spinner.succeed("解析成功！");
            } else {
              spinner.fail(error);
            }
          }
        );
      }
    });
    extra.remove(path.join(this.dir, this.name));
  }

  readJSX = async (path) => {
    return new Promise((resolve, reject) => {
      extra.readFile(path, "utf8", (err, data) => {
        if (err) {
          reject(err);
          throw spinner.fail(err);
        }
        resolve(data);
      });
    });
  };
}

module.exports = CreateGenerator;
