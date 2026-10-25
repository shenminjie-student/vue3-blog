/**
 * 个人资料：关于我页面与首页的全部内容都在这里维护。
 * 所有文案都是占位示例，按自己的真实经历替换即可。
 */
export const profile = {
  name: '沈敏杰',
  alias: 'struct@杰构体',
  role: '软件开发工程师',
  tagline: '用 Qt 写桌面，用 Vue 写网页，用文字记录折腾。',
  avatar: '/avatar.svg',
  location: '中国 · 上海',
  status: '在职 · 欢迎技术交流',
  experienceYears: 3,
  bio: [
    '你好，我是沈敏杰，网名 struct@杰构体。目前主要做桌面客户端开发，日常工作围绕 C++、Qt 与构建工具展开。',
    '喜欢把事情拆到「结构」层面去理解：一个界面由哪些组件组成、一个模块的边界在哪里、一次构建为什么慢。写博客也是这个习惯的延伸——把踩过的坑和想明白的事留下来。',
    '工作之外会看很多电影，偶尔剪点视频、拍点照片。这里的文章不保证正确，但保证是亲手试过的。',
  ],
  /** 基本信息，渲染为两栏信息卡 */
  info: [
    { label: '坐标', value: '中国 · 上海', icon: 'map-pin' },
    { label: '职业', value: 'C++ / Qt 客户端开发', icon: 'briefcase' },
    { label: '关注方向', value: '桌面应用 · 工具链 · 前端可视化', icon: 'code' },
    { label: '邮箱', value: 'hello@example.com', href: 'mailto:hello@example.com', icon: 'mail' },
    { label: '技术栈', value: 'C++17 · Qt 6 · Vue 3 · CMake', icon: 'layers' },
    { label: '可用状态', value: '在职 · 开放技术交流', icon: 'sparkles' },
  ],
  /** 履历：工作与教育都放在同一条时间线上，type 决定图标与配色 */
  timeline: [
    {
      period: '2026.06 — 至今',
      title: '软件开发',
      org: '中航航空模拟系统有限公司',
      type: 'work',
      description:
        '参与工业软件上位机的功能开发，独立完成数据采集面板与日志模块，第一次完整体验了从需求到发版的全流程。',
      highlights: ['上位机', '数据采集'],
    },
    {
      period: '2023.09 — 2026.06',
      title: '新一代电子信息技术 · 硕士',
      org: '南昌航空大学',
      type: 'edu',
      description:
        '参与工业软件上位机的功能开发，独立完成数据采集面板与日志模块，第一次完整体验了从需求到发版的全流程。',
      highlights: ['上位机', '数据采集'],
    },
    {
      period: '2019.09 — 2023.06',
      title: '通信工程 · 本科',
      org: '南昌航空大学',
      type: 'edu',
      description:
        '加入学校的技术社团，开始写 C++ 与前端。第一次用 Vue 做完一个完整的项目，也第一次意识到工程规范的重要性。',
      highlights: ['C++', 'Vue', '社团'],
    },
  ],
  /** 技能：level 为 1–5，用于渲染熟练度条 */
  skills: [
    {
      group: '编程语言',
      icon: 'code',
      items: [
        { name: 'C++', level: 5, note: '主要生产语言，熟悉现代 C++ 与性能调优' },
        { name: 'TypeScript / JavaScript', level: 4, note: '前端与脚本工具' },
        { name: 'Python', level: 3, note: '自动化脚本与数据处理' },
        { name: 'SQL', level: 3, note: '日常查询与简单优化' },
      ],
    },
    {
      group: '桌面开发',
      icon: 'monitor',
      items: [
        { name: 'Qt Widgets', level: 5, note: '复杂业务界面与自定义绘制' },
        { name: 'QML / Qt Quick', level: 4, note: '动画与可视化界面' },
        { name: 'CMake', level: 4, note: '多平台构建与依赖管理' },
        { name: '多线程 / 网络', level: 3, note: '线程池、异步任务与 HTTP 通信' },
      ],
    },
    {
      group: '前端',
      icon: 'feather',
      items: [
        { name: 'Vue 3', level: 4, note: '组合式 API、组件设计' },
        { name: 'Vite', level: 4, note: '构建配置与插件' },
        { name: 'CSS / 设计系统', level: 4, note: '设计令牌与响应式布局' },
        { name: 'Node.js', level: 3, note: '命令行工具与构建脚本' },
      ],
    },
    {
      group: '工程与工具',
      icon: 'tool',
      items: [
        { name: 'Git', level: 5, note: '分支模型与代码评审' },
        { name: 'Linux', level: 4, note: '日常开发与部署环境' },
        { name: 'Docker', level: 3, note: '构建环境隔离' },
        { name: 'GitHub Actions', level: 3, note: '自动化构建与发布' },
      ],
    },
  ],
  /** 兴趣标签，首页展示 */
  interests: ['电影', '摄影', '骑行', '视频剪辑', '机械键盘', '独立开发'],
}

export default profile
