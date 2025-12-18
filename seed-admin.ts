const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('123456', 10) // Senha inicial: 123456

  const user = await prisma.user.upsert({
    where: { email: 'admin@atelie.com' },
    update: {},
    create: {
      email: 'admin@atelie.com',
      name: 'Administrador',
      password,
      role: 'ADMIN',
    },
  })
  console.log({ user })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })