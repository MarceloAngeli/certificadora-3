// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Executando seed...');

  // Criar admin
  const adminPass = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@agenda.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@agenda.com',
      password: adminPass,
      role: 'ADMIN',
    },
  });

  // Criar usuário comum
  const userPass = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@agenda.com' },
    update: {},
    create: {
      name: 'Usuário Padrão',
      email: 'user@agenda.com',
      password: userPass,
      role: 'USER',
    },
  });

  // Criar eventos de exemplo
  const today = new Date();
  const events = [
    {
      title: 'Reunião de planejamento',
      description: 'Reunião mensal de planejamento estratégico da equipe.',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 9, 0),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 11, 0),
      location: 'Sala de Reuniões A',
      color: '#4F46E5',
    },
    {
      title: 'Apresentação de resultados',
      description: 'Apresentação dos resultados do trimestre para os stakeholders.',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 14, 0),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 16, 0),
      location: 'Auditório Principal',
      color: '#059669',
    },
    {
      title: 'Workshop de React',
      description: 'Treinamento interno sobre boas práticas em React.',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 8, 0),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 17, 0),
      location: 'Laboratório de TI',
      color: '#DC2626',
    },
    {
      title: 'Confraternização da empresa',
      description: 'Festa de fim de ano com toda a equipe.',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15, 19, 0),
      location: 'Terraço do Edifício',
      color: '#D97706',
    },
  ];

  for (const evt of events) {
    await prisma.event.create({ data: evt });
  }

  console.log('✅ Seed concluído!');
  console.log(`   Admin: admin@agenda.com / admin123`);
  console.log(`   User:  user@agenda.com / user123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
