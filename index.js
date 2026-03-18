#!/usr/bin/env node

const { program } = require('commander');
const { marked } = require('marked');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 样式模板（添加中文字体支持）
const styles = {
  default: `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
        'Noto Sans SC', 'Source Han Sans SC', 'WenQuanYi Micro Hei', 'Microsoft YaHei', sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: {{padding}}px;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      color: #1a1a1a;
    }
    h1 { font-size: 2em; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    p { margin-bottom: 1em; }
    code {
      background: #f4f4f4;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Courier New', Consolas, monospace;
      font-size: 0.9em;
    }
    pre {
      background: #f4f4f4;
      padding: 1em;
      border-radius: 5px;
      overflow-x: auto;
      margin: 1em 0;
    }
    pre code {
      background: transparent;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 1em;
      color: #666;
      margin: 1em 0;
    }
    ul, ol {
      margin-left: 2em;
      margin-bottom: 1em;
    }
    li { margin-bottom: 0.5em; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 0.5em 1em;
      text-align: left;
    }
    th { background: #f4f4f4; font-weight: 600; }
    img { max-width: 100%; height: auto; }
    hr {
      border: none;
      border-top: 1px solid #eee;
      margin: 2em 0;
    }
  `,
  dark: `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
        'Noto Sans SC', 'Source Han Sans SC', 'WenQuanYi Micro Hei', 'Microsoft YaHei', sans-serif;
      line-height: 1.6;
      color: #e0e0e0;
      background: #1a1a2e;
      padding: {{padding}}px;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      color: #fff;
    }
    h1 { font-size: 2em; border-bottom: 2px solid #444; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #444; padding-bottom: 0.3em; }
    p { margin-bottom: 1em; }
    code {
      background: #2d2d44;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Courier New', Consolas, monospace;
      font-size: 0.9em;
      color: #f8f8f2;
    }
    pre {
      background: #2d2d44;
      padding: 1em;
      border-radius: 5px;
      overflow-x: auto;
      margin: 1em 0;
    }
    pre code {
      background: transparent;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #444;
      padding-left: 1em;
      color: #aaa;
      margin: 1em 0;
    }
    ul, ol {
      margin-left: 2em;
      margin-bottom: 1em;
    }
    li { margin-bottom: 0.5em; }
    a { color: #64b5f6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #444;
      padding: 0.5em 1em;
      text-align: left;
    }
    th { background: #2d2d44; font-weight: 600; }
    img { max-width: 100%; height: auto; }
    hr {
      border: none;
      border-top: 1px solid #444;
      margin: 2em 0;
    }
  `,
  minimal: `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Georgia, 'Times New Roman', 'Noto Serif SC', 'Source Han Serif SC', 'Microsoft YaHei', serif;
      line-height: 1.8;
      color: #222;
      background: #fff;
      padding: {{padding}}px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: normal;
    }
    h1 { font-size: 2.5em; }
    h2 { font-size: 2em; }
    p { margin-bottom: 1.5em; }
    code {
      background: #f9f9f9;
      padding: 0.1em 0.3em;
      font-family: 'Courier New', Consolas, monospace;
      font-size: 0.85em;
    }
    pre {
      background: #f9f9f9;
      padding: 1em;
      margin: 1.5em 0;
      overflow-x: auto;
    }
    pre code {
      background: transparent;
      padding: 0;
    }
    blockquote {
      font-style: italic;
      color: #666;
      margin: 1.5em 0;
      padding-left: 1em;
      border-left: 3px solid #ccc;
    }
    ul, ol {
      margin-left: 1.5em;
      margin-bottom: 1.5em;
    }
    li { margin-bottom: 0.5em; }
    a { color: #333; text-decoration: underline; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1.5em 0;
    }
    th, td {
      border: none;
      border-bottom: 1px solid #ddd;
      padding: 0.5em;
      text-align: left;
    }
    img { max-width: 100%; height: auto; }
    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 2em 0;
    }
  `
};

// 将 Markdown 转换为 HTML
function markdownToHtml(markdown) {
  return marked(markdown);
}

// 生成完整的 HTML 文档
function generateHtml(content, options) {
  const style = styles[options.style] || styles.default;
  const processedStyle = style.replace(/\{\{padding\}\}/g, options.padding.toString());

  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${processedStyle}
    body {
      font-size: ${options.fontSize}px;
      width: ${options.width}px;
    }
    /* 确保中文字体优先加载 */
    * {
      font-family: 'Noto Sans SC', 'Source Han Sans SC', 'Microsoft YaHei', 'WenQuanYi Micro Hei', sans-serif !important;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>
  `.trim();
}

// 使用 Puppeteer 渲染 HTML 并截图
async function renderToPng(html, outputPath, options) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--font-render-hinting=none']
  });

  try {
    const page = await browser.newPage();

    // 设置视口大小
    await page.setViewport({
      width: options.width,
      height: 1080
    });

    // 设置 HTML 内容，等待字体加载完成
    await page.setContent(html, { waitUntil: ['networkidle0', 'load'] });

    // 额外等待字体渲染完成
    await page.evaluateHandle('document.fonts.ready');

    // 获取内容实际高度
    const bodyHeight = await page.evaluate(() => {
      return document.body.scrollHeight;
    });

    // 调整视口高度以适应内容
    await page.setViewport({
      width: options.width,
      height: bodyHeight
    });

    // 根据格式选择输出方式
    if (options.format === 'pdf') {
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        },
        preferCSSPageSize: false
      });
    } else {
      await page.screenshot({
        path: outputPath,
        fullPage: true,
        type: options.format
      });
    }

    console.log(`Successfully generated: ${outputPath}`);
  } finally {
    await browser.close();
  }
}

// 批量转换目录下的所有 Markdown 文件
async function convertDirectory(dirPath, outputDir, options) {
  // 获取目录下所有.md 文件
  const files = fs.readdirSync(dirPath);
  const mdFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.markdown'));

  if (mdFiles.length === 0) {
    console.log(`No markdown files found in: ${dirPath}`);
    return;
  }

  console.log(`Found ${mdFiles.length} markdown file(s) in: ${dirPath}`);

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 启动一个浏览器实例处理所有文件
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    for (const file of mdFiles) {
      const inputPath = path.join(dirPath, file);
      const baseName = path.basename(file, path.extname(file));
      const outputPath = path.join(outputDir, `${baseName}.${options.format}`);

      console.log(`Converting: ${file} -> ${baseName}.${options.format}`);

      const markdown = fs.readFileSync(inputPath, 'utf-8');
      const html = markdownToHtml(markdown);
      const fullHtml = generateHtml(html, options);

      await renderToPngWithBrowser(fullHtml, outputPath, options, browser);
    }
    console.log(`\nSuccessfully converted ${mdFiles.length} file(s) to: ${outputDir}`);
  } finally {
    await browser.close();
  }
}

// 使用已有的浏览器实例渲染（批量转换用）
async function renderToPngWithBrowser(html, outputPath, options, browser) {
  const page = await browser.newPage();

  try {
    // 设置视口大小
    await page.setViewport({
      width: options.width,
      height: 1080
    });

    // 设置 HTML 内容
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // 获取内容实际高度
    const bodyHeight = await page.evaluate(() => {
      return document.body.scrollHeight;
    });

    // 调整视口高度以适应内容
    await page.setViewport({
      width: options.width,
      height: bodyHeight
    });

    // 截图保存
    await page.screenshot({
      path: outputPath,
      fullPage: true
    });
  } finally {
    await page.close();
  }
}

// 主入口函数
async function main() {
  program
    .name('m2p')
    .description('Convert Markdown to PNG image')
    .argument('[input]', 'Markdown string or input file path')
    .option('-o, --output <file>', 'Output PNG file path', 'output.png')
    .option('-w, --width <number>', 'Image width in pixels', '800')
    .option('--font-size <number>', 'Font size in pixels', '16')
    .option('--padding <number>', 'Padding in pixels', '40')
    .option('-s, --style <preset>', 'Style preset (default/dark/minimal)', 'default')
    .option('-f, --format <format>', 'Output format (png/jpeg/pdf)', 'png')
    .option('-d, --dir <directory>', 'Convert all markdown files in directory')
    .option('--stdin', 'Read markdown from stdin')
    .helpOption('-h, --help', 'Show this help message')
    .parse();

  const options = program.opts();
  let markdown = '';

  // 验证样式选项
  if (!['default', 'dark', 'minimal'].includes(options.style)) {
    console.error(`Error: Invalid style "${options.style}". Valid options are: default, dark, minimal`);
    process.exit(1);
  }

  // 验证格式选项
  if (!['png', 'jpeg', 'pdf'].includes(options.format)) {
    console.error(`Error: Invalid format "${options.format}". Valid options are: png, jpeg, pdf`);
    process.exit(1);
  }

  // 解析选项值
  options.width = parseInt(options.width, 10);
  options.fontSize = parseInt(options.fontSize, 10);
  options.padding = parseInt(options.padding, 10);

  // 验证数值选项
  if (isNaN(options.width) || options.width < 100) {
    console.error('Error: Width must be a number >= 100');
    process.exit(1);
  }
  if (isNaN(options.fontSize) || options.fontSize < 8) {
    console.error('Error: Font size must be a number >= 8');
    process.exit(1);
  }
  if (isNaN(options.padding) || options.padding < 0) {
    console.error('Error: Padding must be a number >= 0');
    process.exit(1);
  }

  // 处理目录转换模式
  if (options.dir) {
    if (!fs.existsSync(options.dir)) {
      console.error(`Error: Directory not found: ${options.dir}`);
      process.exit(1);
    }
    const outputDir = options.output !== 'output.png' ? options.output : `${options.dir}/output`;
    await convertDirectory(options.dir, outputDir, options);
    return;
  }

  // 获取 Markdown 内容
  if (options.stdin) {
    // 从 stdin 读取
    markdown = fs.readFileSync(0, 'utf-8');
  } else if (program.args.length === 0) {
    // 没有提供输入，显示帮助
    program.help();
  } else {
    const input = program.args[0];

    // 检查是否为文件路径
    if (fs.existsSync(input)) {
      // 从文件读取
      markdown = fs.readFileSync(input, 'utf-8');
      console.log(`Reading from file: ${input}`);
    } else {
      // 直接作为 Markdown 字符串
      markdown = input;
    }
  }

  if (!markdown.trim()) {
    console.error('Error: No markdown content provided');
    process.exit(1);
  }

  // 确保输出目录存在
  const outputDir = path.dirname(options.output);
  if (outputDir && outputDir !== '.' && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 核心处理流程
  console.log('Converting Markdown to PNG...');

  const html = markdownToHtml(markdown);
  const fullHtml = generateHtml(html, options);

  await renderToPng(fullHtml, options.output, options);
}

// 运行主程序
main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
