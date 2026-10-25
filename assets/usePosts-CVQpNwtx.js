import{C as e,D as t,N as n,b as r,f as i,h as a,j as o,m as s,p as c,u as l}from"./vue-vendor-DGEqt0Xr.js";import{n as u}from"./index-D1m0LqDt.js";import{n as d}from"./markdown-DQpw9snZ.js";var f={key:0,class:`tag__count`},p=[`href`],m={key:0,class:`tag__count`},h={key:0,class:`tag__count`},g=u({__name:`BaseTag`,props:{label:{type:String,required:!0},to:{type:[String,Object],default:null},href:{type:String,default:``},tone:{type:String,default:`default`},size:{type:String,default:`md`},count:{type:[Number,String],default:null}},setup(l){let u=l;return(l,d)=>{let g=e(`RouterLink`);return u.to?(r(),i(g,{key:0,to:u.to,class:o([`tag`,[`tag--${u.tone}`,`tag--${u.size}`]])},{default:t(()=>[a(n(u.label)+` `,1),u.count===null?c(``,!0):(r(),s(`span`,f,n(u.count),1))]),_:1},8,[`to`,`class`])):u.href?(r(),s(`a`,{key:1,href:u.href,class:o([`tag`,[`tag--${u.tone}`,`tag--${u.size}`]]),target:`_blank`,rel:`noopener noreferrer`},[a(n(u.label)+` `,1),u.count===null?c(``,!0):(r(),s(`span`,m,n(u.count),1))],10,p)):(r(),s(`span`,{key:2,class:o([`tag`,[`tag--${u.tone}`,`tag--${u.size}`]])},[a(n(u.label)+` `,1),u.count===null?c(``,!0):(r(),s(`span`,h,n(u.count),1))],2))}}},[[`__scopeId`,`data-v-e8a224ed`]]),_=`---\r
title: 重写 CMake 构建脚本：从 300 行到 90 行\r
date: 2025-01-05\r
tags: [技术, Qt, CMake]\r
summary: 一个越写越长的 CMakeLists.txt 是怎么被拆成可复用模块的，以及拆完之后构建快了多少。\r
---\r
\r
## 起点：一个没人敢改的文件\r
\r
接手项目时，根目录的 \`CMakeLists.txt\` 有 312 行，被复制到了四个子项目里。任何人都能看出来它有问题，但没人愿意动——毕竟「能编过」。\r
\r
问题清单：\r
\r
- 编译选项在五个地方重复定义；\r
- 有新同事加了一个源文件，忘了加进构建，直到运行时链接失败；\r
- Debug 构建误用了 Release 的第三方库；\r
- CI 上编译要 12 分钟。\r
\r
## 目标\r
\r
不追求「现代 CMake」的纯度，只求三件事：\r
\r
1. **单一事实来源**：编译选项、依赖版本只写一次；\r
2. **目标清晰**：每个子项目只声明自己需要什么；\r
3. **构建可缓存**：能上 \`ccache\` 与 \`sccache\`。\r
\r
## 第一步：抽出公共模块\r
\r
新建 \`cmake/ProjectDefaults.cmake\`，提供几个函数：\r
\r
\`\`\`cmake\r
function(project_defaults target)\r
  target_compile_features(\${target} PRIVATE cxx_std_17)\r
  target_compile_options(\${target} PRIVATE\r
    $<$<CXX_COMPILER_ID:MSVC>:/W4 /permissive->\r
    $<$<NOT:$<CXX_COMPILER_ID:MSVC>>:-Wall -Wextra -Wpedantic>\r
  )\r
  set_target_properties(\${target} PROPERTIES\r
    CXX_STANDARD 17\r
    CXX_STANDARD_REQUIRED ON\r
    AUTOMOC ON\r
    AUTOUIC ON\r
    AUTORCC ON\r
  )\r
endfunction()\r
\`\`\`\r
\r
子项目里只需要：\r
\r
\`\`\`cmake\r
add_library(core STATIC \${CORE_SOURCES})\r
project_defaults(core)\r
target_link_libraries(core PUBLIC Qt6::Core Qt6::Widgets)\r
\`\`\`\r
\r
## 第二步：用 target_* 代替全局变量\r
\r
旧的写法：\r
\r
\`\`\`cmake\r
include_directories(\${CMAKE_SOURCE_DIR}/include)\r
link_directories(\${THIRD_PARTY}/lib)\r
add_definitions(-DENABLE_LOG)\r
\`\`\`\r
\r
新写法：\r
\r
\`\`\`cmake\r
target_include_directories(core PUBLIC include)\r
target_link_directories(core PRIVATE \${THIRD_PARTY}/lib)\r
target_compile_definitions(core PRIVATE ENABLE_LOG)\r
\`\`\`\r
\r
好处是依赖关系变成可追踪的：谁用了什么，从 \`target_link_libraries\` 一眼能看出来。\r
\r
## 第三步：把第三方库变成 imported target\r
\r
\`\`\`cmake\r
add_library(thirdparty::fmt SHARED IMPORTED)\r
set_target_properties(thirdparty::fmt PROPERTIES\r
  IMPORTED_LOCATION "\${THIRD_PARTY}/lib/fmt.dll"\r
  IMPORTED_IMPLIB   "\${THIRD_PARTY}/lib/fmt.lib"\r
  INTERFACE_INCLUDE_DIRECTORIES "\${THIRD_PARTY}/include"\r
)\r
\`\`\`\r
\r
这样 \`fmt\` 的头文件路径和库文件不会散落到各个子项目里。\r
\r
## 第四步：配置与构建分离\r
\r
\`\`\`bash\r
cmake -S . -B build -G Ninja \\\r
  -DCMAKE_BUILD_TYPE=Release \\\r
  -DCMAKE_CXX_COMPILER_LAUNCHER=ccache\r
\r
cmake --build build --parallel\r
\`\`\`\r
\r
\`-S/-B\` 的写法避免在源码目录里生成一堆中间文件，也方便同时保留 Debug 和 Release 两个构建目录。\r
\r
## 结果\r
\r
| 指标 | 改造前 | 改造后 |\r
| --- | --- | --- |\r
| 根 CMakeLists 行数 | 312 | 94 |\r
| 重复的编译选项 | 5 处 | 1 处 |\r
| CI 构建耗时 | 12 min | 7 min |\r
| 新增文件出错率 | 偶尔 | 0（用 \`file(GLOB_RECURSE CONFIGURE_DEPENDS)\`） |\r
\r
最后一条要提醒：\`GLOB\` 在社区里常被批评，但加上 \`CONFIGURE_DEPENDS\` 之后，主流生成器都会在文件变化时重新配置。对内部项目来说，这点便利比理论上的洁癖更值钱。\r
\r
## 一点点经验\r
\r
- 重构构建脚本时，**先让新旧两套并存**，确认能编出同样的产物再删旧的；\r
- 每拆一步都跑一遍 CI，不要一口气改完；\r
- \`cmake --graphviz\` 可以导出依赖图，排查循环依赖很有用。\r
\r
构建脚本也是代码，它也值得被认真对待。\r
`,v=`---\r
title: 用 Vite 和 Markdown 搭一个不需要后端的小站\r
date: 2025-05-02\r
tags: [技术, 前端, Vite]\r
summary: 不接 CMS、不租数据库，把 Markdown 文件直接打包进前端产物。顺便聊聊为什么最后选了 import.meta.glob。\r
---\r
\r
## 需求只有一句话\r
\r
「想写文章的时候，新建一个 \`.md\` 文件就行。」\r
\r
这句话拆开来看，其实包含了三个约束：\r
\r
1. 写作不依赖后台；\r
2. 发布过程要能进 Git；\r
3. 构建产物必须是纯静态文件。\r
\r
满足这三点的方案很多，最后我选择了 **Vite + Vue 3 + \`import.meta.glob\`**。\r
\r
## 文章是怎么被找到的\r
\r
Vite 支持在构建期把文件内容直接读成字符串：\r
\r
\`\`\`js\r
const modules = import.meta.glob('../content/posts/*.md', {\r
  query: '?raw',\r
  import: 'default',\r
  eager: true,\r
})\r
\r
console.log(Object.keys(modules)) // ['../content/posts/hello.md', ...]\r
\`\`\`\r
\r
\`eager: true\` 表示不生成异步 chunk，而是直接打进主包。对几十篇博客来说完全够用，而且省掉了「点击文章 → 等待加载」的体验断点。\r
\r
## Front Matter 用 YAML\r
\r
每篇文章开头写一段元信息，交给 \`js-yaml\` 解析：\r
\r
\`\`\`yaml\r
---\r
title: 用 Vite 和 Markdown 搭一个不需要后端的小站\r
date: 2025-05-02\r
tags: [技术, 前端, Vite]\r
summary: 一段摘要，会显示在列表页。\r
---\r
\`\`\`\r
\r
解析代码只有十几行：\r
\r
\`\`\`js\r
import yaml from 'js-yaml'\r
\r
function parseFrontMatter(raw) {\r
  const match = /^---\\r?\\n([\\s\\S]*?)\\r?\\n---\\r?\\n?/.exec(raw)\r
  if (!match) return { data: {}, content: raw }\r
  return { data: yaml.load(match[1]) || {}, content: raw.slice(match[0].length) }\r
}\r
\`\`\`\r
\r
## 渲染 Markdown\r
\r
\`markdown-it\` 的插件生态很成熟，标题锚点、代码高亮、外链处理都能通过覆写 renderer 实现：\r
\r
\`\`\`js\r
md.renderer.rules.heading_open = (tokens, idx) => {\r
  const text = tokens[idx + 1].content\r
  tokens[idx].attrSet('id', slugify(text))\r
  return \`<\${tokens[idx].tag}\${md.renderer.renderAttrs(tokens[idx])}>\`\r
}\r
\`\`\`\r
\r
代码高亮用 \`highlight.js\` 的按需注册，只引入实际用到的语言，产物会小很多：\r
\r
\`\`\`js\r
import hljs from 'highlight.js/lib/core'\r
import cpp from 'highlight.js/lib/languages/cpp'\r
\r
hljs.registerLanguage('cpp', cpp)\r
\`\`\`\r
\r
## 目录结构\r
\r
\`\`\`text\r
src/\r
├── content/posts/     # 文章\r
├── components/        # 可复用组件\r
├── composables/       # 跨页面逻辑\r
├── data/              # 个人资料、电影清单\r
└── views/             # 页面\r
\`\`\`\r
\r
一个原则：**数据、逻辑、视图分开**。改个人信息不应该动组件，改组件不应该碰数据。\r
\r
## 几个容易忽略的细节\r
\r
- **时区**：\`new Date('2025-05-02')\` 是 UTC 时间，在东八区之外的机器上会显示成前一天。手动拆年月日最稳。\r
- **锚点与哈希路由**：如果路由用哈希模式，文章里的 \`href="#id"\` 会把路由冲掉，必须自己拦截点击。\r
- **草稿**：用 \`draft: true\` 标记，开发环境显示、生产环境过滤，写完到发布之间留出余地。\r
\r
## 值不值得\r
\r
如果你的文章数量在三位数以内、更新频率按周算，这个方案比自己搭一套 CMS 轻松太多。反之，如果要做多作者协作、评论、全文检索，那就该考虑正经的后端或者现成的静态博客生成器了。\r
`,y=`---\r
title: QML 还是 Widgets：一个小工具的选型复盘\r
date: 2025-03-08\r
tags: [技术, Qt, 前端]\r
summary: 给内部工具选界面技术栈，最后没选看起来更酷的 QML。原因和你想的不太一样。\r
---\r
\r
## 背景\r
\r
要做一个内部用的数据核对工具：\r
\r
- 单机运行，Windows 为主；\r
- 主要界面是表格 + 若干表单弹窗；\r
- 使用者是运营同学，不是工程师；\r
- 只有我一个人开发，预计两周上线。\r
\r
候选方案就两个：Qt Widgets，或者 Qt Quick（QML）。\r
\r
## 先说不重要的因素\r
\r
### 「哪个更现代」\r
\r
QML 看起来更现代，动画和自定义样式更方便。但这个工具的核心界面是**密集表格**，现代不现代几乎不影响使用体验。\r
\r
### 「哪个性能更好」\r
\r
两个都够用。表格最多几千行，Widgets 的 \`QTableView\` 配 \`QAbstractTableModel\` 可以轻松应付；QML 的 \`TableView\` 也能做，但需要更小心地处理 delegate 复用。\r
\r
## 真正决定选型的因素\r
\r
### 1. 表格控件成熟度\r
\r
\`QTableView\` 是我最熟悉的东西：排序、委托、右键菜单、列宽持久化，都有现成套路。QML 的 \`TableView\` 在这几年进步很大，但要在两周内做到同等细腻，风险不小。\r
\r
### 2. 和现有代码复用\r
\r
项目里已经有一套基于 Widgets 的日志窗口与设置对话框，可以直接搬过来。选 QML 意味着这些要重写一遍。\r
\r
### 3. 打包体积\r
\r
QML 需要带上 Qt Quick 相关的库与 QML 模块，安装包会大十几 MB。对一个内部工具来说这不是致命问题，但也没必要。\r
\r
### 4. 团队维护成本\r
\r
这条最重要。工具上线后大概率会交给别人接手，而团队里熟悉 Widgets 的人明显更多。\r
\r
## 什么时候会选 QML\r
\r
反过来想，如果满足下面任意两条，我会选 QML：\r
\r
- 界面以动画、图表、自定义绘制为主；\r
- 需要跑在移动端或嵌入式设备上；\r
- 设计稿对样式要求很高，Widgets 靠 QSS 很难还原；\r
- 团队里有人熟悉 QML。\r
\r
## 结果\r
\r
用 Widgets 两周上线，后面迭代了三个版本，没遇到什么结构性问题。\r
\r
界面确实谈不上好看，但运营同学的原话是：「比之前用 Excel 快多了。」——对一个内部工具来说，这就是最高评价。\r
\r
## 一点感受\r
\r
技术选型里最容易被高估的是「先进」，最容易被低估的是「熟悉」和「可维护」。\r
\r
不是说不要用新技术，而是要先想清楚：这个项目真正的约束是什么。如果约束是两周交付和一个人开发，那答案通常很清楚。\r
`,b=`---\r
title: 把 Qt Widgets 项目迁到 Qt 6：踩过的 8 个坑\r
date: 2025-06-18\r
tags: [技术, Qt, C++]\r
summary: 一个跑了七年的桌面客户端从 Qt 5.15 迁到 Qt 6.7 的实录：兼容模块、编码、事件循环和打包，每一步都有人踩过。\r
pinned: true\r
---\r
\r
## 为什么现在才迁\r
\r
项目从 2018 年开始写，一直停在 Qt 5.15 + MSVC 2019。迁移的动机很朴素：新系统上装不上旧版运行库了，而且 Qt 6 的 HiDPI 支持确实好很多。\r
\r
整体迁移花了大约三周，其中两天用来改代码，剩下的时间都在处理构建和打包。下面是真正卡住我的几个点。\r
\r
## 1. 兼容模块不是「可选项」\r
\r
Qt 6 把一堆模块搬进了 \`qt5compat\`，编译时才会发现头文件找不到：\r
\r
\`\`\`cmake\r
find_package(Qt6 REQUIRED COMPONENTS Core Gui Widgets)\r
# 旧代码里的 QTextCodec / QRegExp 需要这个\r
find_package(Qt6 REQUIRED COMPONENTS Core5Compat)\r
target_link_libraries(app PRIVATE Qt6::Core5Compat)\r
\`\`\`\r
\r
好消息是能用，坏消息是它只是过渡方案。\`QTextCodec\` 在我们的报表导出模块里被用了 40 多次，最后统一换成了 \`QStringConverter\`。\r
\r
## 2. \`QRegExp\` → \`QRegularExpression\`\r
\r
这是改动量最大的一项。API 名字差不多，语义差得不少：\r
\r
| Qt 5 | Qt 6 | 注意点 |\r
| --- | --- | --- |\r
| \`QRegExp\` | \`QRegularExpression\` | 不再默认贪婪匹配整个字符串 |\r
| \`exactMatch()\` | \`match().hasMatch()\` | 需要自己判断完整匹配 |\r
| 反向引用 \`\\1\` | \`\\1\` | 基本一致 |\r
\r
建议直接用 \`QRegularExpression\` 的 \`anchoredPattern()\`，避免漏掉边界：\r
\r
\`\`\`cpp\r
const QRegularExpression re(QRegularExpression::anchoredPattern("v(\\\\d+)\\\\.(\\\\d+)"));\r
const auto match = re.match(versionString);\r
if (match.hasMatch()) {\r
    const int major = match.captured(1).toInt();\r
}\r
\`\`\`\r
\r
## 3. 高 DPI 缩放变成默认行为\r
\r
Qt 5 里我们手动设了 \`AA_EnableHighDpiScaling\`，Qt 6 里这个属性已经废弃。迁移后最直观的变化是：所有写死像素的边距都变小了。\r
\r
解决方式不是乘以缩放系数，而是尽量改用布局和 \`QStyle\` 提供的尺寸：\r
\r
\`\`\`cpp\r
// 之前：写死\r
button->setFixedSize(96, 32);\r
\r
// 现在：交给样式\r
button->setMinimumHeight(button->sizeHint().height());\r
\`\`\`\r
\r
## 4. 隐式共享容器的迭代器差异\r
\r
\`QList\` 在 Qt 6 里就是 \`QVector\`，\`QHash\` 的迭代顺序也不再稳定。我们有一段代码依赖 \`QHash\` 的遍历顺序生成导出文件的列顺序，迁移后导出结果顺序变了，测试直接红。\r
\r
结论：任何依赖容器顺序的地方都要显式排序，不要赌实现细节。\r
\r
## 5. 信号槽的连接语法\r
\r
旧代码里还有 \`SIGNAL()\` / \`SLOT()\` 宏写法，Qt 6 虽然还能编，但遇到重载函数就会失败。趁迁移一次性换成函数指针写法：\r
\r
\`\`\`cpp\r
connect(button, &QPushButton::clicked, this, &MainWindow::onClicked);\r
connect(worker, &Worker::finished, this, &MainWindow::onFinished, Qt::QueuedConnection);\r
\`\`\`\r
\r
## 6. 构建系统：qmake 到 CMake\r
\r
Qt 6 官方主推 CMake，qmake 还能用但不再增加新特性。我们顺手做了两件事：\r
\r
1. 用 \`qt_add_executable\` / \`qt_add_resources\` 替换手写的资源编译步骤；\r
2. 把公共配置抽成 \`cmake/ProjectDefaults.cmake\`，避免每个子目录重复写编译选项。\r
\r
## 7. 打包与运行库\r
\r
Windows 上用 \`windeployqt\` 时，Qt 6 的插件目录结构变了，\`platforms/qwindows.dll\` 少一个就白屏。CI 里加了这一步检查：\r
\r
\`\`\`bash\r
windeployqt --release --no-translations --no-system-d3d-compiler dist/app.exe\r
test -f dist/platforms/qwindows.dll || (echo "missing platform plugin" && exit 1)\r
\`\`\`\r
\r
## 8. 别忘了 QSS 的兼容性\r
\r
自定义控件里有不少 QSS 依赖 Qt 5 的盒模型行为，Qt 6 里 \`padding\` 与 \`border\` 的组合表现略有不同。逐个截图对比太慢，我的做法是写一个「样式回归页」，把项目里所有自定义控件放上去，迁移前后各截一张图对比。\r
\r
## 复盘\r
\r
如果重来一次，我会按这个顺序做：\r
\r
- 先升级构建系统，让新旧两套 Qt 可以并存编译；\r
- 再处理编译错误（大多是机械替换）；\r
- 最后跑一遍全量 UI 截图对比，专门抓样式与布局回归。\r
\r
迁移本身不可怕，可怕的是没有测试的项目在迁移后「看起来没问题」。\r
`,x=`---\r
title: 一个人看电影的仪式感\r
date: 2025-02-14\r
tags: [闲谈, 电影]\r
summary: 为什么我更喜欢一个人去电影院，以及那些散场后独自走回家的路。\r
---\r
\r
## 从「没人陪」到「就要一个人」\r
\r
最开始一个人看电影是因为约不到人。\r
\r
后来发现，一个人看电影和一群人看电影，看的其实是两部片子。\r
\r
## 仪式感清单\r
\r
我的流程很固定：\r
\r
1. 选工作日的下午场，人最少；\r
2. 提前十分钟进场，看完所有片头字幕；\r
3. 手机静音，放进口袋最深处；\r
4. 片尾字幕放完才起身——除非影厅已经开始拖地。\r
\r
听起来有点做作，但这套流程的作用是**把注意力收回来**。两个小时里只有屏幕和声音，没有待办事项，没有消息提醒。\r
\r
对现在的我来说，这是很难得的完整时间。\r
\r
## 散场之后的那段路\r
\r
从影院走回家大概二十分钟。\r
\r
这段路是我最喜欢的部分。刚看完的电影还在脑子里转，路灯和车流会莫名其妙地跟片子里的某个镜头重叠。有时候想着想着就笑了，有时候会突然很想给谁打个电话。\r
\r
上次看《海上钢琴师》，走回家的路上一直在想 1900 为什么不下来。那天很冷，但我走得很慢。\r
\r
## 关于「看不懂」\r
\r
一个人看电影的时候，不会有人在旁边问「这里什么意思」。\r
\r
这既是自由也是压力——看不懂的部分只能自己回去查影评。但也因此，那些自己琢磨明白的瞬间，比被人讲解要爽得多。\r
\r
## 偶尔也会想有个人一起\r
\r
当然。\r
\r
比如看到特别喜欢的段落，会下意识想转头说点什么，然后发现旁边是空的。\r
\r
那一刻会有点想笑：哦，对，我一个人来的。\r
\r
然后继续看。\r
\r
## 推荐片单\r
\r
如果你也想试试一个人看，我会推荐这几部：\r
\r
- 《控方证人》——注意力会被钉在屏幕上；\r
- 《千与千寻》——散场后适合慢慢走；\r
- 《布达佩斯大饭店》——每一帧都想暂停，但忍住了更好；\r
- 《海上钢琴师》——看完会想在海边走一走。\r
\r
电影院的意义可能不只在电影本身。那两个小时里，你被允许什么都不做，只是看。\r
`,S=`---\r
title: 写了三年博客，我得到了什么\r
date: 2025-04-11\r
tags: [闲谈]\r
summary: 没有涨粉，没有变现，但我确实从写作里拿走了一些东西。\r
---\r
\r
## 起点是一个 bug\r
\r
第一篇文章是因为一个 Qt 的 bug 卡了我两天。解决之后我把它写了下来，发在一个没什么人看的地方。\r
\r
那篇的阅读量大概是 20。其中 5 次是我自己刷的。\r
\r
但我很快就发现了写作的第一个好处：**为了写清楚，你必须真的想清楚。** 卡住我的那个问题是「信号槽在跨线程时为什么偶尔丢消息」，写到一半我发现自己其实没完全搞懂，于是又回去翻了文档和源码。\r
\r
写博客的过程，本质上是一次自检。\r
\r
## 第二个好处：搜索自己的过去\r
\r
现在我的习惯是，遇到报错先在自己的博客里搜一遍。\r
\r
三年下来积累了三十多篇，覆盖了构建、部署、Qt、前端这些我反复踩坑的地方。有些细节（比如某个 CMake 变量到底是干嘛的）写在博客里比记在笔记里更容易找回，因为写的时候有上下文。\r
\r
## 第三个好处：被迫整理\r
\r
写「一次迁移的记录」和写「随便记几笔」是完全不同的两件事。\r
\r
前者要求我把散落的操作整理成有顺序的步骤，把「不知道为什么但这样能跑」的地方标出来。这个过程会暴露知识结构里的洞——通常写着写着就发现了。\r
\r
## 没得到的东西\r
\r
诚实一点：\r
\r
- 没有涨粉，也没有变现；\r
- 没有变成技术大 V；\r
- 有些文章写完就再也没看过。\r
\r
如果把写博客当成一个投入产出比的生意，那大概率是亏的。但它的收益本来就不在外部。\r
\r
## 现在怎么写\r
\r
我给自己定了三条很松的规矩：\r
\r
1. **只写自己做过的事**，不写「据说」；\r
2. **允许不完美**，先把过程记下来，正确性可以后续修正；\r
3. **不追热点**，写完能帮到未来的自己就算及格。\r
\r
## 给想开始的你\r
\r
不用等「有东西可写」。把今天解决的一个小问题写 300 字，就是一篇。\r
\r
真正难的不是写，是持续写。而持续的诀窍是降低门槛：不要排版、不要配图、不要想标题，先把内容敲出来。\r
\r
至于这个博客——它大概会一直保持现在这种朴素的样子。毕竟它首先是给自己看的。\r
`;function C(e){let t=String(e??``).replace(/^\uFEFF/,``),n=/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(t);if(!n)return{data:{},content:t};let r={};try{let e=d.load(n[1]);e&&typeof e==`object`&&!Array.isArray(e)&&(r=e)}catch(e){console.warn(`[front-matter] 解析失败，已按无元数据处理：`,e.message)}return{data:r,content:t.slice(n[0].length)}}var w=220,T=350;function E(e){if(!e)return null;if(e instanceof Date)return Number.isNaN(e.getTime())?null:e;let t=String(e).trim(),n=/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/.exec(t);if(n){let e=new Date(Number(n[1]),Number(n[2])-1,Number(n[3]));return Number.isNaN(e.getTime())?null:e}let r=new Date(t);return Number.isNaN(r.getTime())?null:r}function D(e){let t=E(e);return t?`${t.getFullYear()} 年 ${t.getMonth()+1} 月 ${t.getDate()} 日`:``}function O(e){let t=E(e);if(!t)return``;let n=String(t.getMonth()+1).padStart(2,`0`),r=String(t.getDate()).padStart(2,`0`);return`${t.getFullYear()}-${n}-${r}`}function k(e){let t=String(e??``).replace(/```[\s\S]*?```/g,` `).replace(/!\[[^\]]*\]\([^)]*\)/g,` `).replace(/\[[^\]]*\]\([^)]*\)/g,` `).replace(/[#>*_`~-]/g,` `),n=(t.match(/[\u4e00-\u9fa5]/g)||[]).length,r=t.replace(/[\u4e00-\u9fa5]/g,` `).split(/\s+/).filter(Boolean).length,i=n/T+r/w;return Math.max(1,Math.round(i))}function A(e,t=120){let n=String(e??``).replace(/```[\s\S]*?```/g,` `).replace(/!\[[^\]]*\]\([^)]*\)/g,` `).replace(/\[([^\]]*)\]\([^)]*\)/g,`$1`).replace(/<[^>]+>/g,` `).replace(/^#{1,6}\s+/gm,``).replace(/^>\s?/gm,``).replace(/[*_~`]/g,``).replace(/\s+/g,` `).trim();return n.length<=t?n:`${n.slice(0,t).trimEnd()}…`}var j=Object.assign({"../content/posts/cmake-refactor.md":_,"../content/posts/markdown-blog-with-vite.md":v,"../content/posts/qml-vs-widgets.md":y,"../content/posts/qt6-widgets-migration.md":b,"../content/posts/watching-movies-alone.md":x,"../content/posts/why-i-write.md":S});function M(e){if(!e)return[];let t=Array.isArray(e)?e:String(e).split(/[,，、]+/);return[...new Set(t.map(e=>String(e).trim()).filter(Boolean))]}function N(e,t){let n=e.split(`/`).pop().replace(/\.md$/i,``),{data:r,content:i}=C(t),a=r.date||``;return{slug:String(r.slug||n),title:r.title||n,date:a,dateText:D(a),isoDate:O(a),timestamp:E(a)?.getTime()??0,tags:M(r.tags),summary:r.summary||A(i,110),cover:r.cover||``,draft:!!r.draft,pinned:!!r.pinned,readingTime:k(i),content:i}}var P=Object.entries(j).map(([e,t])=>N(e,t)).filter(e=>!e.draft).sort((e,t)=>e.pinned===t.pinned?t.timestamp-e.timestamp:e.pinned?-1:1),F=l(()=>{let e=new Map;for(let t of P)for(let n of t.tags)e.set(n,(e.get(n)||0)+1);return[...e.entries()].map(([e,t])=>({name:e,count:t})).sort((e,t)=>t.count-e.count||e.name.localeCompare(t.name,`zh-CN`))});function I(){let e=l(()=>P),t=l(()=>F.value);function n(e){return P.find(t=>t.slug===e)||null}function r(e){let t=P.findIndex(t=>t.slug===e);return t===-1?{newer:null,older:null}:{newer:t>0?P[t-1]:null,older:t<P.length-1?P[t+1]:null}}function i(e,t=2){let r=n(e);return r?P.filter(t=>t.slug!==e).map(e=>({post:e,score:e.tags.filter(e=>r.tags.includes(e)).length})).filter(e=>e.score>0).sort((e,t)=>t.score-e.score||t.post.timestamp-e.post.timestamp).slice(0,t).map(e=>e.post):[]}return{posts:e,tags:t,getPost:n,getNeighbors:r,getRelated:i}}export{g as n,I as t};