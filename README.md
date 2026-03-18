# m2p - Markdown to PNG/PDF Converter

将 Markdown 文本转换为精美的 PNG 图片或 PDF 文档的命令行工具。

## 特性

- 支持多种输出格式：PNG、JPEG、PDF
- 内置三种样式主题：default（默认）、dark（暗黑）、minimal（极简）
- 支持中文字体（Noto Sans SC、Source Han Sans SC、Microsoft YaHei 等）
- 可自定义宽度、字体大小、内边距
- 支持批量转换目录下的所有 Markdown 文件
- 支持从 stdin 读取内容
- 支持图片分割模式（适合小红书等社交媒体发布）

## 安装

```bash
npm install
```

## 使用方法

### 基本用法

```bash
# 转换 Markdown 字符串
node index.js "# Hello World" -o output.png

# 转换 Markdown 文件
node index.js README.md -o output.png

# 从 stdin 读取
echo "# Hello World" | node index.js --stdin -o output.png
```

### 命令行选项

| 选项 | 简写 | 说明 | 默认值 |
|------|------|------|--------|
| `--output <file>` | `-o` | 输出文件路径 | `output.png` |
| `--width <number>` | `-w` | 图片宽度（像素） | `800` |
| `--font-size <number>` | - | 字体大小（像素） | `16` |
| `--padding <number>` | - | 内边距（像素） | `40` |
| `--style <preset>` | `-s` | 样式主题 (default/dark/minimal) | `default` |
| `--format <format>` | `-f` | 输出格式 (png/jpeg/pdf) | `png` |
| `--dir <directory>` | `-d` | 批量转换目录下的所有 Markdown 文件 | - |
| `--stdin` | - | 从标准输入读取 Markdown | - |
| `--split` | `-S` | 分割输出为多张图片 | - |
| `--split-height <number>` | - | 分割后每张图片的高度 | `1600` |
| `--split-width <number>` | - | 分割后每张图片的宽度 | `1080` |
| `--keep-original` | - | 分割后保留原始完整图片 | - |
| `--help` | `-h` | 显示帮助信息 | - |

### 样式主题

#### default（默认）
简洁明亮风格，适合技术文档、博客文章。

#### dark（暗黑）
深色背景，护眼且适合代码展示。

#### minimal（极简）
衬线字体，留白更多，适合正式文档。

## 使用示例

### 转换单个文件

```bash
# 默认样式输出 PNG
node index.js article.md -o article.png

# 暗黑样式输出
node index.js article.md -o article-dark.png -s dark

# 输出 PDF
node index.js article.md -o article.pdf -f pdf
```

### 自定义样式

```bash
# 设置宽度、字体大小、内边距
node index.js article.md -o output.png -w 1000 --font-size 18 --padding 50
```

### 批量转换目录

```bash
# 转换 docs 目录下所有 Markdown 文件到 output 目录
node index.js -d ./docs -o ./output

# 批量转换为 PDF
node index.js -d ./docs -o ./pdf-output -f pdf
```

### 图片分割（适合社交媒体）

```bash
# 分割成长图，适合小红书发布
node index.js article.md -o xiaohongshu.png -S

# 自定义分割高度
node index.js article.md -o output.png -S --split-height 2000

# 分割后保留原图
node index.js article.md -o output.png -S --keep-original
```

### 管道输入

```bash
# 从管道读取
cat README.md | node index.js --stdin -o readme.png
```

## 全局安装（可选）

```bash
# 全局安装
npm install -g .

# 然后可以直接使用命令
m2p "# Hello World" -o output.png
```

## 依赖

- [commander](https://www.npmjs.com/package/commander) - 命令行解析
- [marked](https://www.npmjs.com/package/marked) - Markdown 解析
- [puppeteer](https://www.npmjs.com/package/puppeteer) - Headless Chrome 渲染
- [sharp](https://www.npmjs.com/package/sharp) - 图片处理（分割功能）

## 注意事项

1. 首次运行需要下载 Chromium（puppeteer 依赖）
2. 确保系统有足够的内存运行 headless Chrome
3. 中文字体渲染需要系统安装相应字体，或依赖浏览器内置字体

### 中文显示问题

如果发现生成的图片中中文显示为方框（□□□），需要安装中文字体。

**Ubuntu/Debian:**
```bash
apt-get install -y fonts-noto-cjk fonts-wqy-microhei fonts-wqy-zenhei
```

**Alpine:**
```bash
apk add --no-cache font-noto-cjk
```

**CentOS/RHEL:**
```bash
yum install -y google-noto-sans-cjk-fonts
```

安装完成后重新运行转换命令即可正常显示中文。

## License

MIT
