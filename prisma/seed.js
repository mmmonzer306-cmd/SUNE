const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { id: 1 }, update: {},
    create: { id: 1, username: 'admin', password: hashedPassword, mustChangePass: true },
  });

  await prisma.profile.upsert({
    where: { id: 1 }, update: {},
    create: {
      id: 1, name: 'Mohammed Mohsen',
      title: 'Full-stack Web Developer', titleAr: 'مطور ويب متكامل', titleFr: 'Développeur Web Full-Stack',
      bio1: 'I am Mohammed, a developer who sees code as a medium for solving real-world problems rather than just lines of text. My journey in web development began with pure curiosity, which evolved into a passion for building integrated platforms that balance stunning design with robust performance.',
      bio1Ar: 'أنا محمد محسن، مطور سوداني شغوف بتطوير الويب، أرى الكود وسيلة لحل المشكلات الواقعية وليس مجرد سطور نصية. بدأت رحلتي في تطوير الويب بفضول خالص، تطور إلى شغف ببناء منصات متكاملة والأداء القوي.',
      bio1Fr: "Je suis Mohammed, un développeur qui voit le code comme un moyen de résoudre des problèmes réels. Mon parcours dans le développement web a commencé par une pure curiosité, qui s'est transformée en une passion pour construire des plateformes intégrées.",
      bio2: "I believe a successful user interface is one that truly understands the visitor's needs, and that clean code is the foundation of any sustainable project. I am always eager to learn new technologies to stay ahead in this fast-paced world.",
      bio2Ar: 'أعتقد أن واجهة المستخدم الناجحة هي التي تفهم احتياجات الزائر حقًا، وأن الكود النظيف هو أساس أي مشروع مستدام. أنا دائمًا متحمس لتعلم تقنيات جديدة للبقاء في المقدمة.',
      bio2Fr: "Je crois qu'une interface utilisateur réussie est celle qui comprend vraiment les besoins du visiteur, et qu'un code propre est le fondement de tout projet durable.",
      email: 'MohammedMohseng@gmail.com', phone: '00249992161079',
      github: 'https://www.github.com/ENGmohammedmohsen',
      facebook: 'https://web.facebook.com/MohammedMohsenEng/',
      telegram: 'https://t.me/mohammedmohseng/',
      linkedin: '', twitter: '', avatarUrl: '', resumeUrl: '',
    },
  });

  const skills = [
    { name: 'HTML5', nameAr: 'HTML5', nameFr: 'HTML5', description: 'The cornerstone for building well-structured and standard-compliant web pages.', descAr: 'حجر الأساس لبناء صفحات ويب منظمة ومتوافقة مع المعايير.', descFr: 'La pierre angulaire pour construire des pages web bien structurées et conformes aux normes.', level: 90, order: 1 },
    { name: 'CSS3', nameAr: 'CSS3', nameFr: 'CSS3', description: 'My tool for transforming static designs into interactive, beautifully organized layouts.', descAr: 'أداتي لتحويل التصاميم الثابتة إلى تخطيطات تفاعلية ومنظمة بشكل جميل.', descFr: 'Mon outil pour transformer des designs statiques en mises en page interactives.', level: 85, order: 2 },
    { name: 'JavaScript', nameAr: 'جافاسكريبت', nameFr: 'JavaScript', description: 'The core engine I use to inject intelligence and real-time interaction into the web.', descAr: 'المحرك الأساسي الذي استخدمه لحقن الذكاء والتفاعل في الوقت الحقيقي في الويب.', descFr: "Le moteur principal que j'utilise pour injecter de l'intelligence et de l'interaction en temps réel.", level: 80, order: 3 },
    { name: 'Sass', nameAr: 'ساس', nameFr: 'Sass', description: 'My preferred way to write professional, scalable, and maintainable CSS styles.', descAr: 'طريقتي المفضلة لكتابة أنماط CSS احترافية وقابلة للتطوير والصيانة.', descFr: "Ma façon préférée d'écrire des styles CSS professionnels, évolutifs et maintenables.", level: 75, order: 4 },
    { name: 'React.js', nameAr: 'رياكت', nameFr: 'React.js', description: 'The library I rely on to build complex, fast, and incredibly smooth user interfaces.', descAr: 'المكتبة التي أعتمد عليها لبناء واجهات مستخدم معقدة وسريعة وسلسة بشكل لا يصدق.', descFr: "La bibliothèque sur laquelle je compte pour construire des interfaces utilisateur complexes, rapides et incroyablement fluides.", level: 70, order: 5 },
  ];
  for (const s of skills) await prisma.skill.create({ data: s });

  const projects = [
    { name: 'Sudella Platform', nameAr: 'منصة سوديلا', nameFr: 'Plateforme Sudella', description: "The 'Sudella' project is an exploration in building a comprehensive e-commerce store, where I focused on browsing speed and checkout simplicity while ensuring data security.", descAr: "مشروع 'سوديلا' هو استكشاف لبناء متجر إلكتروني شامل، حيث ركزت على سرعة التصفح وبساطة الدفع مع ضمان أمان البيانات.", descFr: "Le projet 'Sudella' est une exploration dans la construction d'une boutique e-commerce complète.", liveUrl: 'https://sudella.com', techStack: ['JavaScript', 'TypeScript', 'Sass'], featured: true, order: 1 },
    { name: 'Responsive Portfolio', nameAr: 'معرض أعمال متجاوب', nameFr: 'Portfolio Responsive', description: 'This website you are currently browsing is the result of my efforts to merge simplicity with professionalism.', descAr: 'هذا الموقع الذي تتصفحه حاليًا هو نتيجة جهودي لدمج البساطة مع الاحترافية، بهدف تمثيل هويتي وجعل مهاراتي سهلة الوصول.', descFr: "Ce site que vous parcourez actuellement est le résultat de mes efforts pour fusionner simplicité et professionnalisme.", liveUrl: 'https://devmohammedtech.netlify.app', techStack: ['HTML5', 'CSS3', 'JavaScript'], featured: true, order: 2 },
    { name: 'Smart Restaurant App', nameAr: 'تطبيق مطعم ذكي', nameFr: 'Application de Restaurant Intelligent', description: 'A dedicated restaurant application designed to digitize the ordering and booking process.', descAr: 'تطبيق مطعم مخصص مصمم لرقمنة عملية الطلب والحجز، يوفر حلاً عمليًا للمالكين وتجربة حديثة للعملاء.', descFr: "Une application de restaurant dédiée conçue pour numériser le processus de commande et de réservation.", liveUrl: 'https://restrant.com', techStack: ['TailwindCSS', 'Node.js', 'React'], featured: false, order: 3 },
  ];
  for (const p of projects) await prisma.project.create({ data: p });

  await prisma.siteSettings.upsert({
    where: { id: 1 }, update: {},
    create: { id: 1, theme: 'dark', lang: 'en' },
  });

  console.log('✅ Seeded successfully');
}
main().catch(console.error).finally(() => prisma.$disconnect());
