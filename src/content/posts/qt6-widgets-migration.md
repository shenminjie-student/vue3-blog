---
title: 把 Qt Widgets 项目迁到 Qt 6：踩过的 8 个坑
date: 2025-06-18
tags: [技术, Qt, C++]
summary: 一个跑了七年的桌面客户端从 Qt 5.15 迁到 Qt 6.7 的实录：兼容模块、编码、事件循环和打包，每一步都有人踩过。
pinned: true
---

## 为什么现在才迁

项目从 2018 年开始写，一直停在 Qt 5.15 + MSVC 2019。迁移的动机很朴素：新系统上装不上旧版运行库了，而且 Qt 6 的 HiDPI 支持确实好很多。

整体迁移花了大约三周，其中两天用来改代码，剩下的时间都在处理构建和打包。下面是真正卡住我的几个点。

## 1. 兼容模块不是「可选项」

Qt 6 把一堆模块搬进了 `qt5compat`，编译时才会发现头文件找不到：

```cmake
find_package(Qt6 REQUIRED COMPONENTS Core Gui Widgets)
# 旧代码里的 QTextCodec / QRegExp 需要这个
find_package(Qt6 REQUIRED COMPONENTS Core5Compat)
target_link_libraries(app PRIVATE Qt6::Core5Compat)
```

好消息是能用，坏消息是它只是过渡方案。`QTextCodec` 在我们的报表导出模块里被用了 40 多次，最后统一换成了 `QStringConverter`。

## 2. `QRegExp` → `QRegularExpression`

这是改动量最大的一项。API 名字差不多，语义差得不少：

| Qt 5 | Qt 6 | 注意点 |
| --- | --- | --- |
| `QRegExp` | `QRegularExpression` | 不再默认贪婪匹配整个字符串 |
| `exactMatch()` | `match().hasMatch()` | 需要自己判断完整匹配 |
| 反向引用 `\1` | `\1` | 基本一致 |

建议直接用 `QRegularExpression` 的 `anchoredPattern()`，避免漏掉边界：

```cpp
const QRegularExpression re(QRegularExpression::anchoredPattern("v(\\d+)\\.(\\d+)"));
const auto match = re.match(versionString);
if (match.hasMatch()) {
    const int major = match.captured(1).toInt();
}
```

## 3. 高 DPI 缩放变成默认行为

Qt 5 里我们手动设了 `AA_EnableHighDpiScaling`，Qt 6 里这个属性已经废弃。迁移后最直观的变化是：所有写死像素的边距都变小了。

解决方式不是乘以缩放系数，而是尽量改用布局和 `QStyle` 提供的尺寸：

```cpp
// 之前：写死
button->setFixedSize(96, 32);

// 现在：交给样式
button->setMinimumHeight(button->sizeHint().height());
```

## 4. 隐式共享容器的迭代器差异

`QList` 在 Qt 6 里就是 `QVector`，`QHash` 的迭代顺序也不再稳定。我们有一段代码依赖 `QHash` 的遍历顺序生成导出文件的列顺序，迁移后导出结果顺序变了，测试直接红。

结论：任何依赖容器顺序的地方都要显式排序，不要赌实现细节。

## 5. 信号槽的连接语法

旧代码里还有 `SIGNAL()` / `SLOT()` 宏写法，Qt 6 虽然还能编，但遇到重载函数就会失败。趁迁移一次性换成函数指针写法：

```cpp
connect(button, &QPushButton::clicked, this, &MainWindow::onClicked);
connect(worker, &Worker::finished, this, &MainWindow::onFinished, Qt::QueuedConnection);
```

## 6. 构建系统：qmake 到 CMake

Qt 6 官方主推 CMake，qmake 还能用但不再增加新特性。我们顺手做了两件事：

1. 用 `qt_add_executable` / `qt_add_resources` 替换手写的资源编译步骤；
2. 把公共配置抽成 `cmake/ProjectDefaults.cmake`，避免每个子目录重复写编译选项。

## 7. 打包与运行库

Windows 上用 `windeployqt` 时，Qt 6 的插件目录结构变了，`platforms/qwindows.dll` 少一个就白屏。CI 里加了这一步检查：

```bash
windeployqt --release --no-translations --no-system-d3d-compiler dist/app.exe
test -f dist/platforms/qwindows.dll || (echo "missing platform plugin" && exit 1)
```

## 8. 别忘了 QSS 的兼容性

自定义控件里有不少 QSS 依赖 Qt 5 的盒模型行为，Qt 6 里 `padding` 与 `border` 的组合表现略有不同。逐个截图对比太慢，我的做法是写一个「样式回归页」，把项目里所有自定义控件放上去，迁移前后各截一张图对比。

## 复盘

如果重来一次，我会按这个顺序做：

- 先升级构建系统，让新旧两套 Qt 可以并存编译；
- 再处理编译错误（大多是机械替换）；
- 最后跑一遍全量 UI 截图对比，专门抓样式与布局回归。

迁移本身不可怕，可怕的是没有测试的项目在迁移后「看起来没问题」。
