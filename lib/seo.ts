export const seo = {
  title: 'Hyman Zhu | 开发者、架构师、AI新人、梦想家',
  description:
    '我是Hyman，一位充满激情的资深软件工程师兼架构师，在区块链技术和人工智能领域不断探索的新锐力量。',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://cali.so'
      : 'http://localhost:3000'
  ),
} as const
