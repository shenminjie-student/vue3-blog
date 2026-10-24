/**
 * 电影清单数据。
 *
 * 字段说明：
 * - id            唯一标识（用于 key）
 * - title         片名
 * - originalTitle 原名
 * - year          上映年份
 * - director      导演
 * - region        地区
 * - genres        类型标签
 * - duration      片长（分钟）
 * - score         个人评分（0–10）
 * - cover         封面图（放在 public/covers/ 下，可替换成自己的图片）
 * - bilibiliUrl   哔哩哔哩播放页地址；留空则自动跳转到 B 站搜索页
 * - note          一句话短评
 */
export const movies = [
  {
    id: 'let-the-bullets-fly',
    title: '让子弹飞',
    originalTitle: 'Let the Bullets Fly',
    year: 2010,
    director: '姜文',
    region: '中国大陆',
    genres: ['剧情', '喜剧', '动作'],
    duration: 132,
    score: 9.1,
    cover: '/covers/let-the-bullets-fly.svg',
    bilibiliUrl: '',
    note: '站着，还把钱挣了。每句台词都值得再品一遍。',
  },
  {
    id: 'interstellar',
    title: '星际穿越',
    originalTitle: 'Interstellar',
    year: 2014,
    director: '克里斯托弗·诺兰',
    region: '美国',
    genres: ['科幻', '冒险', '剧情'],
    duration: 169,
    score: 9.4,
    cover: '/covers/interstellar.svg',
    bilibiliUrl: '',
    note: '把相对论拍成了诗，看完会想给家里打个电话。',
  },
  {
    id: 'witness-for-the-prosecution',
    title: '控方证人',
    originalTitle: 'Witness for the Prosecution',
    year: 1957,
    director: '比利·怀尔德',
    region: '美国',
    genres: ['悬疑', '犯罪', '剧情'],
    duration: 116,
    score: 9.6,
    cover: '/covers/witness-for-the-prosecution.svg',
    bilibiliUrl: '',
    note: '剧本与表演的教科书，最后十分钟永远会起鸡皮疙瘩。',
  },
  {
    id: 'the-legend-of-1900',
    title: '海上钢琴师',
    originalTitle: 'The Legend of 1900',
    year: 1998,
    director: '朱塞佩·托纳多雷',
    region: '意大利',
    genres: ['剧情', '音乐'],
    duration: 165,
    score: 9.3,
    cover: '/covers/the-legend-of-1900.svg',
    bilibiliUrl: '',
    note: '关于边界与自由，钢琴对决那一段可以反复看。',
  },
  {
    id: 'spirited-away',
    title: '千与千寻',
    originalTitle: 'Spirited Away',
    year: 2001,
    director: '宫崎骏',
    region: '日本',
    genres: ['动画', '奇幻', '冒险'],
    duration: 125,
    score: 9.4,
    cover: '/covers/spirited-away.svg',
    bilibiliUrl: '',
    note: '小时候看热闹，长大后看告别。',
  },
  {
    id: 'the-grand-budapest-hotel',
    title: '布达佩斯大饭店',
    originalTitle: 'The Grand Budapest Hotel',
    year: 2014,
    director: '韦斯·安德森',
    region: '美国 / 德国',
    genres: ['喜剧', '剧情', '冒险'],
    duration: 99,
    score: 8.9,
    cover: '/covers/the-grand-budapest-hotel.svg',
    bilibiliUrl: '',
    note: '每一帧都能截图当壁纸，对称构图的极致。',
  },
  {
    id: 'zootopia',
    title: '疯狂动物城',
    originalTitle: 'Zootopia',
    year: 2016,
    director: '拜伦·霍华德 / 瑞奇·摩尔',
    region: '美国',
    genres: ['动画', '喜剧', '冒险'],
    duration: 109,
    score: 9.2,
    cover: '/covers/zootopia.svg',
    bilibiliUrl: '',
    note: '设定做得太聪明了，成年人和小孩能看两部电影。',
  },
  {
    id: 'the-godfather',
    title: '教父',
    originalTitle: 'The Godfather',
    year: 1972,
    director: '弗朗西斯·福特·科波拉',
    region: '美国',
    genres: ['犯罪', '剧情'],
    duration: 175,
    score: 9.3,
    cover: '/covers/the-godfather.svg',
    bilibiliUrl: '',
    note: '三个小时的家族史，光线和节奏都值得拆开学。',
  },
  {
    id: 'dune',
    title: '沙丘',
    originalTitle: 'Dune',
    year: 2021,
    director: '丹尼斯·维伦纽瓦',
    region: '美国 / 加拿大',
    genres: ['科幻', '冒险', '剧情'],
    duration: 156,
    score: 8.1,
    cover: '/covers/dune.svg',
    bilibiliUrl: '',
    note: '视听层面的史诗，建议戴耳机在安静的时候看。',
  },
  {
    id: 'your-name',
    title: '你的名字。',
    originalTitle: 'Your Name.',
    year: 2016,
    director: '新海诚',
    region: '日本',
    genres: ['动画', '爱情', '奇幻'],
    duration: 106,
    score: 8.5,
    cover: '/covers/your-name.svg',
    bilibiliKeyword: '你的名字 动画电影',
    bilibiliUrl: '',
    note: '画面与音乐的配合太能打，逢年过节都要重看。',
  },
]

/** 去重后的类型列表（用于筛选） */
export const movieGenres = [...new Set(movies.flatMap((movie) => movie.genres))].sort((a, b) =>
  a.localeCompare(b, 'zh-CN'),
)

export default movies
