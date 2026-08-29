const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { id: 1 }, update: {},
    create: { id: 1, username: 'admin', password: hashedPassword, mustChangePass: false },
  });

  await prisma.profile.upsert({
    where: { id: 1 }, update: {},
    create: {
      id: 1, name: 'Alex Morgan',
      title: 'Full-stack Web Developer', titleAr: 'مطور ويب متكامل',
      bio1: 'I am Alex, a developer who sees code as a medium for solving real-world problems rather than just lines of text. My journey in web development began with pure curiosity, which evolved into a passion for building integrated platforms that balance stunning design with robust performance.',
      bio1Ar: 'أنا أليكس مورغان، مطور تجريبي شغوف بتطوير الويب، أرى الكود وسيلة لحل المشكلات الواقعية وليس مجرد سطور نصية. بدأت رحلتي في تطوير الويب بفضول خالص، تطور إلى شغف ببناء منصات متكاملة وأداء قوي.',
      bio1Fr: "Je suis Alex, un développeur qui voit le code comme un moyen de résoudre des problèmes réels. Mon parcours dans le développement web a commencé par une pure curiosité, qui s'est transformée en une passion pour construire des plateformes intégrées.",
      bio2: "I believe a successful user interface is one that truly understands the visitor's needs, and that clean code is the foundation of any sustainable project. I am always eager to learn new technologies to stay ahead in this fast-paced world.",
      bio2Ar: 'أعتقد أن واجهة المستخدم الناجحة هي التي تفهم احتياجات الزائر حقًا، وأن الكود النظيف هو أساس أي مشروع مستدام. أنا دائمًا متحمس لتعلم تقنيات جديدة للبقاء في المقدمة.',
      bio2Fr: "Je crois qu'une interface utilisateur réussie est celle qui comprend vraiment les besoins du visiteur, et qu'un code propre est le fondement de tout projet durable.",
      email: 'alex.morgan@example.com', phone: '+1 202-555-0147',
      github: 'https://github.com/example',
      facebook: 'https://example.com/social',
      telegram: 'https://example.com/messaging',
      whatsapp: 'https://wa.me/12025550147',
      linkedin: '', twitter: '', avatarUrl: '', resumeUrl: '',
    },
  });

  const skills = [
    { name: 'HTML5', nameAr: 'HTML5', description: 'The cornerstone for building well-structured and standard-compliant web pages.', descAr: 'حجر الأساس لبناء صفحات ويب منظمة ومتوافقة مع المعايير.', level: 90, category: 'frontend', order: 1 },
    { name: 'CSS3', nameAr: 'CSS3', description: 'My tool for transforming static designs into interactive, beautifully organized layouts.', descAr: 'أداتي لتحويل التصاميم الثابتة إلى تخطيطات تفاعلية ومنظمة بشكل جميل.', level: 85, category: 'frontend', order: 2 },
    { name: 'JavaScript', nameAr: 'جافاسكريبت', description: 'The core engine I use to inject intelligence and real-time interaction into the web.', descAr: 'المحرك الأساسي الذي استخدمه لحقن الذكاء والتفاعل في الوقت الحقيقي في الويب.', level: 80, category: 'frontend', order: 3 },
    { name: 'Node.js', nameAr: 'نود', description: 'The runtime I use to build fast, scalable backend APIs.', descAr: 'بيئة التشغيل التي أستخدمها لبناء واجهات برمجية خلفية سريعة وقابلة للتوسع.', level: 78, category: 'backend', order: 4 },
    { name: 'React.js', nameAr: 'رياكت', description: 'The library I rely on to build complex, fast, and incredibly smooth user interfaces.', descAr: 'المكتبة التي أعتمد عليها لبناء واجهات مستخدم معقدة وسريعة وسلسة بشكل لا يصدق.', level: 70, category: 'frontend', order: 5 },
    { name: 'Git & GitHub', nameAr: 'جيت', description: 'Version control and collaboration workflow for every project.', descAr: 'إدارة الإصدارات والتعاون في كل مشروع.', level: 85, category: 'tools', order: 6 },
  ];
  if ((await prisma.skill.count()) === 0) for (const s of skills) await prisma.skill.create({ data: s });

  const projects = [
    { name: 'Sudella Platform', nameAr: 'منصة سوديلا', slug: 'sudella-platform', description: "The 'Sudella' project is an exploration in building a comprehensive e-commerce store, where I focused on browsing speed and checkout simplicity while ensuring data security.", descAr: "مشروع 'سوديلا' هو استكشاف لبناء متجر إلكتروني شامل، حيث ركزت على سرعة التصفح وبساطة الدفع مع ضمان أمان البيانات.", liveUrl: 'https://sudella.com', techStack: JSON.stringify(['JavaScript', 'TypeScript', 'Sass']), featured: true, order: 1 },
    { name: 'Responsive Portfolio', nameAr: 'معرض أعمال متجاوب', slug: 'responsive-portfolio', description: 'This website you are currently browsing is the result of my efforts to merge simplicity with professionalism.', descAr: 'هذا الموقع الذي تتصفحه حاليًا هو نتيجة جهودي لدمج البساطة مع الاحترافية، بهدف تمثيل هويتي وجعل مهاراتي سهلة الوصول.', liveUrl: 'https://devmohammedtech.netlify.app', techStack: JSON.stringify(['HTML5', 'CSS3', 'JavaScript']), featured: true, order: 2 },
    { name: 'Smart Restaurant App', nameAr: 'تطبيق مطعم ذكي', slug: 'smart-restaurant-app', description: 'A dedicated restaurant application designed to digitize the ordering and booking process.', descAr: 'تطبيق مطعم مخصص مصمم لرقمنة عملية الطلب والحجز، يوفر حلاً عمليًا للمالكين وتجربة حديثة للعملاء.', liveUrl: 'https://restrant.com', techStack: JSON.stringify(['TailwindCSS', 'Node.js', 'React']), featured: false, order: 3 },
  ];
  if ((await prisma.project.count()) === 0) for (const p of projects) await prisma.project.create({ data: p });

  if ((await prisma.article.count()) === 0) {
    await prisma.article.createMany({
      data: [
        {
          title: 'Building Reliable Full-Stack Products',
          slug: 'building-reliable-full-stack-products',
          excerpt: 'A practical look at the decisions that make a web product fast, maintainable, and ready to grow.',
          content: '# Building Reliable Full-Stack Products\n\nA strong product starts with a clear data model, focused interfaces, and an API that keeps responsibilities easy to understand.\n\n## Start with the user\n\nBefore choosing a framework or database, define the user journey and the smallest useful version of the product.\n\n## Build for change\n\nReadable code, validation, and small reusable modules make future improvements safer and faster.\n\n## Measure what matters\n\nPerformance, accessibility, and error handling should be part of the first release rather than postponed until later.',
          tags: JSON.stringify(['Full-Stack', 'Web Development', 'Best Practices']),
          published: true,
        },
        {
          title: 'From Idea to Digital Experience',
          slug: 'from-idea-to-digital-experience',
          excerpt: 'How thoughtful design and dependable engineering turn an early idea into a product people enjoy using.',
          content: '# From Idea to Digital Experience\n\nTurning an idea into a useful digital experience requires more than attractive screens. It needs clear communication, deliberate interaction design, and a dependable technical foundation.\n\n## Clarity before complexity\n\nThe best interfaces guide visitors toward one meaningful action at a time.\n\n## Details build trust\n\nFast feedback, responsive layouts, and consistent states make a product feel polished and reliable.\n\n## Keep learning\n\nEvery project is an opportunity to refine the process, learn from users, and deliver a better experience next time.',
          tags: JSON.stringify(['UI/UX', 'Product Design', 'Engineering']),
          published: true,
        },
      ],
    });
  }

  if ((await prisma.message.count()) === 0) {
    await prisma.message.createMany({
      data: [
        {
          name: 'Demo Visitor',
          email: 'demo@example.com',
          subject: 'Website project inquiry',
          message: 'Hello Mohammed, I would like to discuss building a modern website for my business.',
          read: false,
        },
        {
          name: 'Sample Client',
          email: 'client@example.com',
          subject: 'E-commerce consultation',
          message: 'I am interested in an online store with product management and a simple checkout flow.',
          read: true,
        },
      ],
    });
  }

  if ((await prisma.stat.count()) === 0) {
    await prisma.stat.createMany({
      data: [
        { label: 'Projects Completed', labelAr: 'مشروع منجز', value: 25, suffix: '+', order: 1 },
        { label: 'Years of Experience', labelAr: 'سنوات خبرة', value: 4, suffix: '+', order: 2 },
        { label: 'Client Satisfaction', labelAr: 'رضا العملاء', value: 98, suffix: '%', order: 3 },
        { label: 'Response Time', labelAr: 'زمن الرد', value: 2, suffix: 'h', order: 4 },
      ],
    });
  }

  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({
      data: [
        { title: 'Landing Pages', titleAr: 'صفحات هبوط', description: 'High-converting landing pages with stunning animations and pixel-perfect design.', descAr: 'صفحات هبوط عالية التحويل بأنيميشن مبهر وتصميم متقن.', icon: 'FiLayout', price: '$199', delivery: '1 week', deliveryAr: 'أسبوع واحد', order: 1 },
        { title: 'E-commerce Stores', titleAr: 'متاجر إلكترونية', description: 'Complete online stores with payment integration, inventory and order management.', descAr: 'متاجر إلكترونية متكاملة مع بوابات دفع وإدارة مخزون وطلبات.', icon: 'FiShoppingCart', price: '$499', delivery: '3 weeks', deliveryAr: '3 أسابيع', order: 2 },
        { title: 'Dashboards & Admin Panels', titleAr: 'لوحات تحكم', description: 'Powerful admin dashboards with analytics, charts and role-based access.', descAr: 'لوحات تحكم قوية مع إحصائيات ورسوم بيانية وصلاحيات.', icon: 'FiGrid', price: '$399', delivery: '2 weeks', deliveryAr: 'أسبوعين', order: 3 },
        { title: 'SaaS MVP', titleAr: 'منتج SaaS أولي', description: 'From idea to a working MVP ready for real users and investors.', descAr: 'من الفكرة إلى منتج أولي جاهز للمستخدمين والمستثمرين.', icon: 'FiLayers', price: '$999', delivery: '4 weeks', deliveryAr: '4 أسابيع', order: 4 },
      ],
    });
  }

  if ((await prisma.experience.count()) === 0) {
    await prisma.experience.createMany({
      data: [
        { title: 'Full-Stack Developer', titleAr: 'مطور متكامل', org: 'Freelance', orgAr: 'عمل حر', period: '2024 — Present', desc: 'Building complete web platforms for clients: e-commerce, booking systems and dashboards.', descAr: 'بناء منصات ويب متكاملة للعملاء: متاجر إلكترونية وأنظمة حجز ولوحات تحكم.', icon: 'FiZap', story: 'Today I build complete products end-to-end: from the database schema and API design to the interface details that make users smile.\n\nClients come with an idea; I return a platform with authentication, payments, dashboards, and a design that feels premium.\n\nThis is the phase where everything converged: speed, quality, and obsession with detail.', storyAr: 'اليوم أبني منتجات كاملة من البداية للنهاية: من مخطط قاعدة البيانات وتصميم الـ API إلى تفاصيل الواجهة التي تُسعد المستخدم.\n\nالعميل يأتي بفكرة؛ فأعيد إليه منصة كاملة بمصادقة ومدفوعات ولوحات تحكم وتصميم فاخر.\n\nهذه المرحلة تجمع كل شيء: السرعة والجودة والهوس بالتفاصيل.', order: 1 },
        { title: 'Front-End Developer', titleAr: 'مطور واجهات', org: 'Independent Projects', orgAr: 'مشاريع مستقلة', period: '2023 — 2024', desc: 'Specialized in React and Next.js, delivering fast and responsive interfaces.', descAr: 'تخصص في React و Next.js وتسليم واجهات سريعة ومتجاوبة.', icon: 'FiCode', story: 'I went deep into React and Next.js: hooks, server components, performance budgets.\n\nInterfaces stopped being just pages — they became products with motion, state, and personality.', storyAr: 'تعمقت في React و Next.js: الخطافات ومكونات الخادم وميزانيات الأداء.\n\nالواجهات لم تعد مجرد صفحات — أصبحت منتجات لها حركة وحالة وشخصية.', order: 2 },
        { title: 'Started the Journey', titleAr: 'بداية الرحلة', org: 'Self-taught', orgAr: 'تعلم ذاتي', period: '2021 — 2023', desc: 'Curiosity turned into skill: HTML, CSS, JavaScript and the foundations of the web.', descAr: 'الفضول تحول إلى مهارة: HTML و CSS و JavaScript وأساسيات الويب.', icon: 'FiBookOpen', story: 'It started with curiosity: "How does this button work?"\n\nLate nights with HTML and CSS, the first JavaScript console.log that felt like magic — and the decision that this is what I want to do for life.\n\nEvery expert was once a beginner who refused to stop.', storyAr: 'بدأت بفضول بسيط: "كيف يعمل هذا الزر؟"\n\nليالٍ طويلة مع HTML و CSS، وأول سطر JavaScript أخرج نتيجة كانت كالسحر — وقررت حينها أن هذا طريقي.\n\nكل خبير كان يومًا مبتدئًا رفض أن يتوقف.', order: 3 },
      ],
    });
  }

  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({
      data: [
        { name: 'Ahmed K.', role: 'Startup Founder', roleAr: 'مؤسس شركة ناشئة', content: 'Mohammed delivered our platform ahead of schedule with quality that exceeded expectations. Communication was excellent throughout.', contentAr: 'سلّم محمد منصتنا قبل الموعد وبجودة فاقت التوقعات. التواصل كان ممتازًا طوال المشروع.', rating: 5, order: 1 },
        { name: 'Sara M.', role: 'Restaurant Owner', roleAr: 'صاحبة مطعم', content: 'The restaurant system he built simplified our daily operations completely. Highly recommended.', contentAr: 'نظام المطعم الذي بناه بسّط عملياتنا اليومية تمامًا. أنصح به بشدة.', rating: 5, order: 2 },
        { name: 'Omar S.', role: 'E-commerce Client', roleAr: 'عميل متجر إلكتروني', content: 'Professional, fast and detail-oriented. Our store sales improved noticeably after launch.', contentAr: 'محترف وسريع ومهتم بالتفاصيل. مبيعات متجرنا تحسنت بشكل ملحوظ بعد الإطلاق.', rating: 5, order: 3 },
      ],
    });
  }

  if ((await prisma.fAQ.count()) === 0) {
    await prisma.fAQ.createMany({
      data: [
        { q: 'How long does a typical project take?', qAr: 'كم يستغرق المشروع عادة؟', a: 'Landing pages take about a week, full stores 2-4 weeks depending on scope. You get a clear timeline before we start.', aAr: 'صفحات الهبوط تستغرق أسبوعًا تقريبًا، والمتاجر الكاملة 2-4 أسابيع حسب الحجم. ستحصل على جدول زمني واضح قبل البدء.', order: 1 },
        { q: 'Do you offer maintenance after delivery?', qAr: 'هل تقدم صيانة بعد التسليم؟', a: 'Yes, every project includes a free support period, and optional monthly maintenance plans.', aAr: 'نعم، كل مشروع يتضمن فترة دعم مجانية، مع خطط صيانة شهرية اختيارية.', order: 2 },
        { q: 'What are the payment terms?', qAr: 'ما هي شروط الدفع؟', a: 'Typically 50% upfront and 50% on delivery. Flexible arrangements for larger projects.', aAr: 'عادة 50% مقدمًا و50% عند التسليم. ترتيبات مرنة للمشاريع الكبيرة.', order: 3 },
      ],
    });
  }

  if ((await prisma.block.count()) === 0) {
    await prisma.block.createMany({
      data: [
        { title: 'Fast Delivery', titleAr: 'تسليم سريع', text: 'Your project shipped on a clear timeline — no surprises.', textAr: 'مشروعك يُسلَّم في موعد واضح — بلا مفاجآت.', icon: 'FiZap', order: 1 },
        { title: 'Clean Code', titleAr: 'كود نظيف', text: 'Readable, maintainable architecture you can build on for years.', textAr: 'بنية واضحة قابلة للصيانة تدوم لسنوات.', icon: 'FiCode', order: 2 },
        { title: 'Design Obsession', titleAr: 'هوس التصميم', text: 'Every pixel, animation and micro-detail crafted with care.', textAr: 'كل بكسل وحركة وتفصيلة صُنعت بعناية.', icon: 'FiStar', order: 3 },
        { title: 'Real Support', titleAr: 'دعم حقيقي', text: 'Fast replies, honest advice, and help after launch.', textAr: 'ردود سريعة ونصيحة صادقة ودعم بعد الإطلاق.', icon: 'FiHeart', order: 4 },
      ],
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 }, update: {},
    create: { id: 1, theme: 'dark', lang: 'en' },
  });

  const snippets = [
    ['brand.mark', 'MM', 'MM'], ['brand.suffix', '_dev', '_dev'],
    ['nav.home', 'Home', 'الرئيسية'], ['nav.about', 'About Me', 'عنّي'],
    ['nav.skills', 'My Skills', 'مهاراتي'], ['nav.services', 'Services', 'الخدمات'],
    ['nav.projects', 'My Works', 'أعمالي'], ['nav.blog', 'Blog', 'المدونة'],
    ['nav.contact', 'Contact Me', 'اتصل بي'], ['nav.available', 'Available for new projects', 'متاح لمشاريع جديدة'],
    ['nav.cta', 'Hire Me', 'وظّفني'],
    ['footer.description', 'Full-Stack Developer & Software Engineer - turning ideas into living digital products.', 'مطور متكامل ومهندس برمجيات - أحوّل الأفكار إلى منتجات رقمية حية.'],
    ['footer.cta', 'Start a Project', 'ابدأ مشروعك الآن'], ['footer.crafted', 'Crafted with', 'صُنع بـ'], ['footer.passion', '& a lot of passion', 'وكثير من الشغف'],
    ['marquee.hint', 'Click the icons - they play!', 'اضغط على الأيقونات - إنها تلعب!'],
    ['splash.cornerTop', 'MM / 01', 'MM / 01'], ['splash.cornerBottom', 'DIGITAL CRAFT / 2026', 'صناعة رقمية / 2026'],
    ['splash.brandEyebrow', 'ALEX MORGAN / PORTFOLIO', 'أليكس مورغان / معرض الأعمال'], ['splash.firstName', 'Alex', 'أليكس'], ['splash.lastName', 'Morgan', 'مورغان'],
    ['splash.role', 'Full-Stack Developer', 'مطور ويب متكامل'], ['splash.roleSuffix', 'Digital Craftsman', 'صانع تجارب رقمية'], ['splash.loading', 'Preparing experience', 'نجهز تجربتك'],
    ['splash.status', 'Available for meaningful work', 'متاح للعمل المؤثر'], ['splash.introEyebrow', 'WELCOME TO THE WORKSPACE', 'مرحباً بك في مساحة العمل'],
    ['splash.headlineLine1', 'Ideas, shaped', 'أفكار، نصوغها'], ['splash.headlineLine2', 'into', 'إلى'], ['splash.headlineAccent', 'experiences.', 'تجارب.'],
    ['splash.description', 'Thoughtful interfaces, reliable systems, and digital products built to make an impression.', 'واجهات مدروسة وأنظمة موثوقة ومنتجات رقمية صممت لتترك أثراً.'],
    ['splash.enter', 'Explore the portfolio', 'استكشف معرض الأعمال'], ['splash.skip', 'Skip intro', 'تخطي المقدمة'], ['splash.scroll', 'Scroll to discover', 'مرر للاكتشاف'], ['splash.languages', 'EN / AR', 'EN / AR'],
    ['splash.sideLeft', 'SELECTED WORKS', 'أعمال مختارة'], ['splash.sideLeftSecond', 'SYSTEMS', 'وأنظمة'], ['splash.sideRight', 'SCROLL / ENTER', 'مرر / ادخل'], ['splash.sideRightSecond', 'TO BEGIN', 'للبدء'],
  ];
  for (const [key, value, valueAr] of snippets) {
    await prisma.textSnippet.upsert({ where: { key }, update: {}, create: { key, value, valueAr } });
  }

  await prisma.admin.update({
    where: { id: 1 },
    data: {
      securityQuestion: 'What is the name of your first project?',
      securityAnswer: require('crypto').createHash('sha256').update('sudella').digest('hex'),
    },
  }).catch(() => {});

  await prisma.profile.update({
    where: { id: 1 },
    data: {
      tagline: 'I build digital products that feel alive.',
      taglineAr: 'أبني منتجات رقمية تبدو حية.',
      location: 'Sudan',
      locationAr: 'السودان',
      availability: 'Available for freelance work',
      availabilityAr: 'متاح لأعمال حرة',
    },
  }).catch(() => {});

  console.log('✅ Seeded successfully');
}
main().catch(console.error).finally(() => prisma.$disconnect());
