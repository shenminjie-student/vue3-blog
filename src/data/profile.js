/**
 * 个人资料：关于我页面与首页的全部内容都在这里维护。
 * 所有文案都是占位示例，按自己的真实经历替换即可。
 */
export const profile = {
  name: 'struct@杰构体',
  alias: 'struct@杰构体',
  role: '软件开发工程师',
  tagline: '希望成为一名优秀的开发者，能在技术与艺术之间找到平衡。',
  avatar: '/avatar.svg',
  location: '中国 · 上海',
  status: '在职 · 欢迎技术交流',
  experienceYears: 3,
  bio: [
    '你好，我是struct@杰构体。目前主要做软件开发，日常工作围绕 C++、VAPS XT、Qt 与构建工具展开。',
    '希望将平时的技术积累与生活感悟写成文章，分享给更多人。',
    '工作之外会看很多电影，偶尔剪点视频、拍点照片。',
  ],
  /** 基本信息，渲染为两栏信息卡 */
  info: [
    { label: '坐标', value: '中国 · 上海', icon: 'map-pin' },
    { label: '职业', value: '软件开发工程师', icon: 'briefcase' },
    { label: '关注方向', value: '桌面应用 · 工具链 · 前端可视化', icon: 'code' },
    { label: '邮箱', value: 'nuch.shen@qq.com', href: 'mailto:nuch.shen@qq.com', icon: 'mail' },
    { label: '技术栈', value: 'C++17 · Qt 6 · Vue 3 · VAPS XT', icon: 'layers' },
    { label: '可用状态', value: '在职 · 开放技术交流', icon: 'sparkles' },
  ],
  /** 履历：工作与教育都放在同一条时间线上，type 决定图标与配色 */
  timeline: [
    {
      period: '2026.06 — 至今',
      title: '软件开发工程师',
      org: '中航航空模拟系统有限公司',
      type: 'work',
      description:
        '***',
      highlights: ['C++', 'VAPS XT', 'Vue 3'],
    },
    {
      period: '2023.09 — 2026.06',
      title: '新一代电子信息技术 · 硕士',
      org: '南昌航空大学',
      type: 'edu',
      description:
        '在读期间的研究方向为深度学习和计算机视觉，毕业课题为羽毛球球智能裁判与分析系统。授权多项国家发明专利和软件著作权，参与过多项科研项目，期间也为学院开发过一款导师双选微信小程序，目前仍在使用。',
      highlights: ['深度学习', '计算机视觉', 'C++', 'Qt', 'Python'],
    },
    {
      period: '2019.09 — 2023.06',
      title: '通信工程 · 本科',
      org: '南昌航空大学',
      type: 'edu',
      description:
        '在读期间加入过校学生会，组织过许多校园活动，并且也开始接触 C++ 与 Qt，做过一些小项目。',
      highlights: ['C++', 'Qt', '社团'],
    },
  ],
  /** 技能：level 为 1–5，用于渲染熟练度条 */
  skills: [
    {
      group: '编程语言',
      icon: 'code',
      items: [
        { name: 'C++', level: 4, note: '主要生产语言，熟悉现代 C++ 与性能调优' },
        { name: 'Python', level: 4, note: '自动化脚本与数据处理' },
        { name: 'SQL', level: 3, note: '日常查询与简单优化' },
        { name: 'TypeScript / JavaScript', level: 2, note: '前端与脚本工具' },
      ],
    },
    {
      group: '桌面开发',
      icon: 'monitor',
      items: [
        { name: 'Qt Widgets', level: 4, note: '复杂业务界面与自定义绘制' },
        { name: '多线程 / 网络', level: 3, note: '线程池、异步任务与 HTTP 通信' },
        { name: 'QML / Qt Quick', level: 1, note: '动画与可视化界面' },
        { name: 'CMake', level: 1, note: '多平台构建与依赖管理' },
      ],
    },
    {
      group: '前端',
      icon: 'feather',
      items: [
        { name: 'Vue 3', level: 4, note: '组合式 API、组件设计' },
        { name: 'CSS / 设计系统', level: 3, note: '设计令牌与响应式布局' },
        { name: 'Vite', level: 1, note: '构建配置与插件' },
        { name: 'Node.js', level: 1, note: '命令行工具与构建脚本' },
      ],
    },
    {
      group: '工程与工具',
      icon: 'tool',
      items: [
        { name: 'Git', level: 3, note: '分支模型与代码评审' },
        { name: 'Linux', level: 3, note: '日常开发与部署环境' },
        { name: 'GitHub Actions', level: 3, note: '自动化构建与发布' },
      ],
    },
  ],
  /** 兴趣标签，首页展示 */
  interests: ['电影', '编程', '游戏', '独立开发'],
}

export default profile
