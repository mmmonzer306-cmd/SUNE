'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type Lang = 'en' | 'ar' | 'fr';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const AppContext = createContext<AppContextType>({} as AppContextType);

// All translations inline
const translations: Record<Lang, Record<string, string>> = {
  en: {
    'nav.home': 'Home', 'nav.about': 'About Me', 'nav.skills': 'My Skills',
    'nav.contact': 'Contact Me', 'nav.works': 'My Works', 'nav.blog': 'Blog',
    'hero.greeting': "Hello, I'm", 'hero.button1': 'Start a Project', 'hero.button2': 'View My Work',
    'hero.description': 'A developer passionate about turning ideas into reality. I build integrated platforms that balance stunning design with robust performance.',
    'about.title': 'A Glimpse Into My Journey',
    'skills.title': 'The Tools I Master',
    'projects.title': "Projects I'm Proud Of",
    'contact.title': "Let's Build Something Great",
    'contact.getInTouch': 'Get In Touch',
    'contact.name': 'Full Name', 'contact.email': 'Email Address',
    'contact.projectType': 'Project Type', 'contact.selectProject': 'Select a project type',
    'contact.message': 'Your Message', 'contact.submit': 'Send Message',
    'option.service': 'Service Booking', 'option.restaurant': 'Restaurant Management',
    'option.ecommerce': 'E-commerce Stores', 'option.portfolio': 'Personal Portfolio',
    'footer.quickLinks': 'Quick Links', 'footer.mySkills': 'My Skills',
    'footer.connect': 'Connect With Me',
    'footer.copyright': '© 2026 Mohammed Mohsen. All rights reserved.',
    'project.view': 'View Project', 'blog.title': 'Tech Articles',
    'form.success': "Message sent successfully! I'll get back to you soon.",
    'form.error': 'Failed to send message. Please try again.',
    'form.networkError': 'Network error. Please check your connection.',
    'hire': 'Hire Me', 'downloadCV': 'Download CV',
    'readMore': 'Read More', 'viewAll': 'View All',
    'theme.dark': 'Dark Mode', 'theme.light': 'Light Mode',
  },
  ar: {
    'nav.home': 'الرئيسية', 'nav.about': 'عنّي', 'nav.skills': 'مهاراتي',
    'nav.contact': 'اتصل بي', 'nav.works': 'أعمالي', 'nav.blog': 'المدونة',
    'hero.greeting': 'هلا، أنا', 'hero.button1': 'ابدأ مشروعك الآن', 'hero.button2': 'شاهد أعمالي',
    'hero.description': 'مطور شغوف بتحويل الأفكار إلى واقع. أبني منصات متكاملة توازن بين التصميم المذهل والأداء القوي.',
    'about.title': 'من أنا؟',
    'skills.title': 'الأدوات التي أتقنها',
    'projects.title': 'المشاريع التي أفتخر بها',
    'contact.title': 'لنبني شيئًا رائعًا معًا',
    'contact.getInTouch': 'تواصل معي',
    'contact.name': 'الاسم الكامل', 'contact.email': 'البريد الإلكتروني',
    'contact.projectType': 'نوع المشروع', 'contact.selectProject': 'اختر نوع المشروع',
    'contact.message': 'رسالتك', 'contact.submit': 'إرسال الرسالة',
    'option.service': 'حجز الخدمات', 'option.restaurant': 'إدارة المطاعم',
    'option.ecommerce': 'متاجر إلكترونية', 'option.portfolio': 'معرض أعمال شخصي',
    'footer.quickLinks': 'روابط سريعة', 'footer.mySkills': 'مهاراتي',
    'footer.connect': 'تواصل معي',
    'footer.copyright': '© 2026 محمد محسن. جميع الحقوق محفوظة.',
    'project.view': 'شاهد المشروع', 'blog.title': 'مقالات تقنية',
    'form.success': 'تم إرسال الرسالة بنجاح! سأتصل بك قريبًا.',
    'form.error': 'فشل إرسال الرسالة. الرجاء المحاولة مرة أخرى.',
    'form.networkError': 'خطأ في الشبكة. الرجاء التحقق من اتصالك.',
    'hire': 'وظّفني', 'downloadCV': 'تحميل السيرة الذاتية',
    'readMore': 'اقرأ المزيد', 'viewAll': 'عرض الكل',
    'theme.dark': 'الوضع الداكن', 'theme.light': 'الوضع الفاتح',
  },
  fr: {
    'nav.home': 'Accueil', 'nav.about': 'À propos', 'nav.skills': 'Mes compétences',
    'nav.contact': 'Contactez-moi', 'nav.works': 'Mes travaux', 'nav.blog': 'Blog',
    'hero.greeting': 'Bonjour, je suis', 'hero.button1': 'Démarrer un projet', 'hero.button2': 'Voir mes travaux',
    'hero.description': "Un développeur passionné par la transformation des idées en réalité. Je construis des plateformes intégrées qui équilibrent un design époustouflant avec des performances robustes.",
    'about.title': 'Un aperçu de mon parcours',
    'skills.title': 'Les outils que je maîtrise',
    'projects.title': 'Projets dont je suis fier',
    'contact.title': 'Construisons quelque chose de grand',
    'contact.getInTouch': 'Entrer en contact',
    'contact.name': 'Nom complet', 'contact.email': 'Adresse email',
    'contact.projectType': 'Type de projet', 'contact.selectProject': 'Sélectionnez un type de projet',
    'contact.message': 'Votre message', 'contact.submit': 'Envoyer le message',
    'option.service': 'Réservation de services', 'option.restaurant': 'Gestion de restaurant',
    'option.ecommerce': 'Boutiques e-commerce', 'option.portfolio': 'Portfolio personnel',
    'footer.quickLinks': 'Liens rapides', 'footer.mySkills': 'Mes compétences',
    'footer.connect': 'Connectez-vous avec moi',
    'footer.copyright': '© 2026 Mohammed Mohsen. Tous droits réservés.',
    'project.view': 'Voir le projet', 'blog.title': 'Articles Tech',
    'form.success': 'Message envoyé avec succès ! Je vous répondrai bientôt.',
    'form.error': "Échec de l'envoi. Veuillez réessayer.",
    'form.networkError': 'Erreur réseau. Veuillez vérifier votre connexion.',
    'hire': 'Engagez-moi', 'downloadCV': 'Télécharger CV',
    'readMore': 'Lire la suite', 'viewAll': 'Voir tout',
    'theme.dark': 'Mode sombre', 'theme.light': 'Mode clair',
  },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'dark';
    const savedLang = (localStorage.getItem('lang') as Lang) || 'en';
    setTheme(savedTheme);
    setLangState(savedLang);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const setLang = (l: Lang) => setLangState(l);
  const t = (key: string) => translations[lang][key] || translations['en'][key] || key;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, setLang, t, dir }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
