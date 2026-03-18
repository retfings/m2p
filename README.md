# m2p - Markdown to PNG Converter

将 Markdown 文本转换为图片的命令行工具，支持中文，支持批量转换。

## 安装

```bash
npm install -g @retfings/m2p
```

## 使用方法

### 基本用法

```bash
# 直接传入 Markdown 字符串
node index.js "# Hello **World**" -o output.png

# 从文件读取 Markdown
node index.js input.md -o output.png

# 从 stdin 读取
echo "# Hello" | node index.js --stdin -o output.png
```

### 命令行选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-o, --output <file>` | 输出文件路径 | `output.png` |
| `-w, --width <number>` | 图片宽度（像素） | `800` |
| `--font-size <number>` | 字体大小（像素） | `16` |
| `--padding <number>` | 内边距（像素） | `40` |
| `-s, --style <preset>` | 样式预设：default/dark/minimal | `default` |
| `-f, --format <format>` | 输出格式：png/jpeg/pdf | `png` |
| `-d, --dir <directory>` | 批量转换目录下所有 .md 文件 | - |
| `--stdin` | 从标准输入读取 Markdown | - |
| `-h, --help` | 显示帮助信息 | - |

### 示例

```bash
# 使用深色主题
node index.js "# Hello World" -o dark.png -s dark

# 自定义宽度和字体
node index.js "Content here" -o custom.png -w 1024 --font-size 18

# 从文件读取并使用极简风格
node index.js readme.md -o minimal.png -s minimal --padding 60

# 批量转换目录下所有 Markdown 文件
node index.js -d ./docs -o ./output

# 输出为 PDF 格式
node index.js "content" -o output.pdf -f pdf

# 输出为 JPEG 格式
node index.js "content" -o output.jpg -f jpeg
```

## 样式预设

- **default**: 经典 GitHub 风格，适合技术文档
- **dark**: 深色主题，护眼时尚
- **minimal**: 极简风格，使用衬线字体，适合长文阅读

## 功能特性

- 支持中文显示（内置中文字体支持）
- 支持多种输出格式：PNG、JPEG、PDF
- 支持批量转换整个目录的 Markdown 文件
- 三种预设样式可选
- 可自定义宽度、字体大小、内边距

## 技术栈

- [marked](https://github.com/markedjs/marked) - Markdown 解析
- [puppeteer](https://github.com/puppeteer/puppeteer) - 无头浏览器渲染
- [commander](https://github.com/tj/commander.js) - CLI 参数解析

## 注意事项

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

ISC
