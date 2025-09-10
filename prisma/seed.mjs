import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1) Author
  const password = await bcrypt.hash('demo1234', 10)
  const author = await prisma.user.upsert({
    where: { email: 'author@example.com' },
    update: {},
    create: {
      name: 'Demo Author',
      email: 'author@example.com',
      password,
      role: 'USER'
    }
  })

  // 2) Category & Tag
  const [general, featured] = await Promise.all([
    prisma.category.upsert({ where: { name: 'General' }, update: {}, create: { name: 'General' } }),
    prisma.tag.upsert({ where: { name: 'Featured' }, update: {}, create: { name: 'Featured' } })
  ])

  // 3) Posts
  const basePosts = [
    {
      title: 'โพสต์ตัวอย่างแรก',
      slug: 'first-demo-post',
      excerpt: 'นี่คือโพสต์ตัวอย่างสำหรับทดสอบหน้า Home',
      content: '<p>เนื้อหาทดสอบโพสต์แรก</p>',
    },
    {
      title: 'ลองขับ Bigbike รอบเมือง',
      slug: 'demo-ride-around-town',
      excerpt: 'แชร์ประสบการณ์ลองขับรอบเมืองสั้นๆ',
      content: '<p>คอนเทนต์สั้นๆ เกี่ยวกับการลองขับ</p>',
    },
    {
      title: 'Dev Tips: จัดระเบียบโปรเจกต์ Nuxt 4',
      slug: 'dev-tips-nuxt4-structure',
      excerpt: 'แนวทางโครงสร้างโปรเจกต์ให้ maintainable',
      content: '<p>Best practices สำหรับโครงสร้างโปรเจกต์</p>',
    },
  ]

  for (const p of basePosts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        coverImageUrl: null,
        publishedAt: new Date(),
        authorId: author.id,
        categories: {
          create: [{ categoryId: general.id }]
        },
        tags: {
          create: [{ tagId: featured.id }]
        }
      }
    })
  }

  console.log('Seed completed: users, categories, tags, posts created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
