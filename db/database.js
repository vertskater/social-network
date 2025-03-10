
    const {PrismaClient} = require('@prisma/client');
    const prisma = new PrismaClient({
      omit: {
        user: {
          password: true
        }
      }
    });
    
    async function main() {
      await prisma.$connect();
    }
    
    main().then(async () => {
      await prisma.$disconnect()
    }).catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
    
    module.exports = prisma;
  