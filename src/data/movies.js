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
    id: 'heidi-and-grandpa',
    title: '海蒂和爷爷',
    originalTitle: 'Heidi and Grandpa',
    year: 2015,
    director: '阿兰·葛斯彭纳',
    region: '瑞士 / 德国',
    genres: ['小说改', '冒险', '剧情', '家庭'],
    duration: 132,
    score: 9.9,
    cover: 'https://i2.hdslb.com/bfs/archive/f8c6acb262c66511b7c25ebaaa5c08e682979c64.jpg@424w_240h.webp',
    bilibiliUrl: 'https://www.bilibili.com/bangumi/play/ss26976?theme=movie&spm_id_from=333.337.0.0',
    note: '海蒂很小就失去了父母，被送到阿尔卑斯山上和爷爷生活。爷爷是个脾气古怪的老人，海蒂却用她的善良和纯真融化了爷爷的心，也让周围的人们重新找回了温暖和希望。',
  }
]

/** 去重后的类型列表（用于筛选） */
export const movieGenres = [...new Set(movies.flatMap((movie) => movie.genres))].sort((a, b) =>
  a.localeCompare(b, 'zh-CN'),
)

export default movies
