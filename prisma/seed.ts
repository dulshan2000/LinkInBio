import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.click.deleteMany({ where: { user: { username: "demo" } } });
  await prisma.link.deleteMany({ where: { user: { username: "demo" } } });
  await prisma.user.deleteMany({ where: { username: "demo" } });

  const hashedPassword = await bcrypt.hash("demo1234", 12);

  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@linkinbio.app",
      password: hashedPassword,
      username: "demo",
      bio: "This is a demo account 🎉 Click any link below to see the tracking in action.",
      theme: "default",
      links: {
        create: [
          { title: "My Portfolio",    url: "https://example.com",             icon: "💼", order: 0, active: true },
          { title: "YouTube Channel", url: "https://youtube.com",             icon: "📺", order: 1, active: true },
          { title: "Twitter / X",     url: "https://x.com",                   icon: "🐦", order: 2, active: true },
          { title: "Instagram",       url: "https://instagram.com",           icon: "📸", order: 3, active: true },
          { title: "Newsletter",      url: "https://example.com/newsletter",  icon: "✉️", order: 4, active: true },
        ],
      },
    },
    include: { links: true },
  });

  // 30 days of fake click data
  const now = new Date();
  const devices = ["mobile", "desktop", "tablet"];
  const countries = ["US", "GB", "DE", "IN", "CA", "AU", "FR", "JP", "BR", null];

  for (const link of user.links) {
    const clickCount = Math.floor(Math.random() * 80 + 20);
    const clicks = Array.from({ length: clickCount }, () => {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      return {
        linkId: link.id,
        userId: user.id,
        device: devices[Math.floor(Math.random() * devices.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        createdAt: date,
      };
    });
    await prisma.click.createMany({ data: clicks });
  }

  console.log("✅ Seed complete!");
  console.log("   Demo account: email=demo@linkinbio.app  password=demo1234");
  console.log("   Public page:  /demo");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
