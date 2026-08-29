'use client';
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

export type Theme = 'dark' | 'light';
export type Lang = 'en' | 'ar';

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
    'footer.copyright': '© 2026 Alex Morgan. All rights reserved.',
    'project.view': 'View Project', 'blog.title': 'Tech Articles',
    'form.success': "Message sent successfully! I'll get back to you soon.",
    'form.error': 'Failed to send message. Please try again.',
    'form.networkError': 'Network error. Please check your connection.',
    'hire': 'Hire Me', 'downloadCV': 'Download CV',
    'readMore': 'Read More', 'viewAll': 'View All',
    'theme.dark': 'Dark Mode', 'theme.light': 'Light Mode',
    'available': 'Available for new projects',
    'stats.title': 'Numbers That Speak',
    'services.title': 'What I Offer',
    'services.subtitle': 'Services tailored to take your idea from concept to a polished product',
    'services.cta': 'Order Now',
    'services.from': 'starting from',
    'experience.title': 'My Journey',
    'testimonials.title': 'What Clients Say',
    'faq.title': 'Frequently Asked Questions',
    'cta.title': 'Ready to build your next idea?',
    'cta.subtitle': "Let's turn your vision into a product that stands out.",
    'cta.call': 'Book a Call',
    'cta.message': 'Send a Message',
    'contact.emailCopied': 'Email copied to clipboard',
    'contact.clickToCopy': 'Click to copy',
    'marquee.title': 'Technologies I Work With',
    'marquee.hint': '✨ click the icons — they play!',
    'projects.hint': 'Click any project to read the full story',
    'scroll': 'Scroll',
    'hero.badge': 'Full-Stack ✓',
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
    'footer.copyright': '© 2026 أليكس مورغان. جميع الحقوق محفوظة.',
    'project.view': 'شاهد المشروع', 'blog.title': 'مقالات تقنية',
    'form.success': 'تم إرسال الرسالة بنجاح! سأتصل بك قريبًا.',
    'form.error': 'فشل إرسال الرسالة. الرجاء المحاولة مرة أخرى.',
    'form.networkError': 'خطأ في الشبكة. الرجاء التحقق من اتصالك.',
    'hire': 'وظّفني', 'downloadCV': 'تحميل السيرة الذاتية',
    'readMore': 'اقرأ المزيد', 'viewAll': 'عرض الكل',
    'theme.dark': 'الوضع الداكن', 'theme.light': 'الوضع الفاتح',
    'available': 'متاح لمشاريع جديدة',
    'stats.title': 'أرقام تتحدث عني',
    'services.title': 'ماذا أقدم لك',
    'services.subtitle': 'خدمات مصممة لتحويل فكرتك من مفهوم إلى منتج متكامل',
    'services.cta': 'اطلب الآن',
    'services.from': 'ابتداءً من',
    'experience.title': 'مسيرتي',
    'testimonials.title': 'ماذا يقول العملاء',
    'faq.title': 'الأسئلة الشائعة',
    'cta.title': 'جاهز لبناء فكرتك القادمة؟',
    'cta.subtitle': 'لنحوّل رؤيتك إلى منتج يترك أثرًا.',
    'cta.call': 'احجز مكالمة',
    'cta.message': 'أرسل رسالة',
    'contact.emailCopied': 'تم نسخ البريد الإلكتروني',
    'contact.clickToCopy': 'اضغط للنسخ',
    'marquee.title': 'التقنيات التي أعمل بها',
    'marquee.hint': '✨ اضغط على الأيقونات — إنها تلعب!',
    'projects.hint': 'اضغط على أي مشروع لرؤية القصة الكاملة',
    'scroll': 'مرر للأسفل',
    'hero.badge': 'مطور متكامل ✓',
  },
};

function readTheme(fallback: Theme): Theme {
  const saved = localStorage.getItem('theme');
  return saved === 'light' || saved === 'dark' ? saved : fallback;
}

function readLang(fallback: Lang): Lang {
  const saved = localStorage.getItem('lang');
  return saved === 'ar' || saved === 'en' ? saved : fallback;
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function applyLang(lang: Lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

export function AppProvider({ children, initialTheme, initialLang }: { children: ReactNode; initialTheme?: Theme; initialLang?: Lang }) {
  const [theme, setTheme] = useState<Theme>(initialTheme || 'dark');
  const [lang, setLangState] = useState<Lang>(initialLang === 'ar' ? 'ar' : 'en');
  const skipThemeWrite = useRef(true);
  const skipLangWrite = useRef(true);

  useEffect(() => {
    const nextTheme = readTheme(initialTheme || 'dark');
    const nextLang = readLang(initialLang === 'ar' ? 'ar' : 'en');
    setTheme(nextTheme);
    setLangState(nextLang);
    applyTheme(nextTheme);
    applyLang(nextLang);
  }, [initialLang, initialTheme]);

  useEffect(() => {
    if (skipThemeWrite.current) {
      skipThemeWrite.current = false;
      return;
    }
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (skipLangWrite.current) {
      skipLangWrite.current = false;
      return;
    }
    applyLang(lang);
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-animating');
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    setTimeout(() => document.documentElement.classList.remove('theme-animating'), 400);
  };
  const setLang = (l: Lang) => setLangState(l);
  const t = (key: string) => translations[lang][key] || translations['en'][key] || key;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, setLang, t, dir }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx.t) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
