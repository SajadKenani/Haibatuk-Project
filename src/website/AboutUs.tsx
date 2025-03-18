import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from "./store";
import { Content, Language } from '../types';
import HaibatukSimplePage from './AcoutUsPara';


// Define the structure of the content object with keys for English and Arabic
const content: { [key in Language]: Content } = {
  english: {
    since: "Since 2008",
    hero: {
      title: "We take pride in Hebtec Company.",
      description: "That our own products are manufactured under our full supervision to ensure the highest quality standards at every stage."
    },
    buttons: {
      products: "Our Products",
      about: "About Us"
    },
    products: {
      title: "Our Products",
      description: "Discover our comprehensive range of health and wellness products, designed for your comfort and well-being.",
      categories: [
        {
          title: 'Paper Products',
          icon: 'fa-paper-plane',
          description: 'High-quality baby diapers, adult diapers, feminine hygiene pads, and tissue paper.',
          items: ['Baby Diapers', 'Adult Diapers', 'Feminine Hygiene', 'Tissue Paper']
        },
        {
          title: 'Cleaning Solutions',
          icon: 'fa-spray-can',
          description: 'Premium cleaning products designed for effectiveness and safety.',
          items: ['Detergents', 'Surface Cleaners', 'Sanitizers', 'Specialty Cleaners']
        },
        {
          title: 'Fragrances',
          icon: 'fa-wind',
          description: 'Safe and unique perfumes and air fresheners for your space.',
          items: ['Perfumes', 'Air Fresheners', 'Room Sprays', 'Car Fresheners']
        }
      ]
    },
    about: {
      title: "Our Commitment to Quality",
      description: "Since 2008, Haibatuk General Trading Limited has been committed to enhancing individual well-being through high-quality health products. We take pride in ensuring our products are manufactured under direct supervision, maintaining the highest standards at every stage.",
      features: [
        { icon: 'fa-certificate', text: 'Global Standards' },
        { icon: 'fa-flask', text: 'Rigorous Testing' },
        { icon: 'fa-shield', text: 'Safe Materials' },
        { icon: 'fa-heart', text: 'Customer Trust' }
      ]
    },
    mission: {
      title: "Toward a better future",
      description: "Our mission is to be part of your journey toward a healthy and comfortable life. We don't just offer products; we provide carefully designed experiences to meet your needs and desires.",
      values: [
        { icon: 'fa-heart', text: "Enhancing Community Health", title: "Our Purpose" },
        { icon: 'fa-star', text: "Quality Products & Services", title: "Our Promise" },
        { icon: 'fa-leaf', text: "Sustainable Development", title: "Our Vision" }
      ]
    }
  },
  arabic: {
    since: "منذ 2008",
    hero: {
      title: "نفتخر في شركة هيبتك",
      description: "بأن منتجاتنا  الخاصة بنا  مصنعة تحت إشرافنا الكامل لضمان أعلى معايير الجودة في كل مرحلة"
    },
    buttons: {
      products: "منتجاتنا",
      about: "معلومات عنا"
    },
    products: {
      title: "منتجاتنا",
      description: "اكتشف مجموعتنا الشاملة من منتجات الصحة والعافية، المصممة لراحتك ورفاهيتك.",
      categories: [
        {
          title: 'المنتجات الورقية',
          icon: 'fa-paper-plane',
          description: 'حفاضات أطفال وكبار عالية الجودة، فوط صحية نسائية، ومناديل ورقية.',
          items: ['حفاضات أطفال', 'حفاضات كبار', 'فوط صحية', 'مناديل ورقية']
        },
        {
          title: 'منتجات التنظيف',
          icon: 'fa-spray-can',
          description: 'منتجات تنظيف متميزة مصممة للفعالية والأمان.',
          items: ['منظفات', 'منظفات أسطح', 'معقمات', 'منظفات متخصصة']
        },
        {
          title: 'العطور',
          icon: 'fa-wind',
          description: 'عطور ومعطرات جو آمنة وفريدة لمساحتك.',
          items: ['عطور', 'معطرات جو', 'معطرات غرف', 'معطرات سيارات']
        }
      ]
    },
    about: {
      title: "التزامنا بالجودة",
      description: "منذ 2008، تلتزم شركة هيبتك للتجارة العامة المحدودة بتعزيز رفاهية الأفراد من خلال منتجات صحية عالية الجودة. نفخر بضمان تصنيع منتجاتنا تحت إشراف مباشر، مع الحفاظ على أعلى المعايير في كل مرحلة.",
      features: [
        { icon: 'fa-certificate', text: 'معايير عالمية' },
        { icon: 'fa-flask', text: 'اختبار دقيق' },
        { icon: 'fa-shield', text: 'مواد آمنة' },
        { icon: 'fa-heart', text: 'ثقة العملاء' }
      ]
    },
    mission: {
      title: "نحو مستقبل أفضل",
      description: "مهمتنا هي أن نكون جزءاً من رحلتك نحو حياة صحية ومريحة. نحن لا نقدم منتجات فحسب؛ بل نقدم تجارب مصممة بعناية لتلبية احتياجاتك ورغباتك.",
      values: [
        { icon: 'fa-heart', text: "تعزيز صحة المجتمع", title: "هدفنا" },
        { icon: 'fa-star', text: "منتجات وخدمات عالية الجودة", title: "وعدنا" },
        { icon: 'fa-leaf', text: "التنمية المستدامة", title: "رؤيتنا" }
      ]
    }
  }
};


export default function About() {
  const theme = useSelector((state: RootState) => state.theme);
  // Get current language content
  const lang = useSelector((state: RootState) => state.language) as Language; // Assuming language is 'english' or 'arabic'

  // Get the content based on the selected language
  const t = content[lang];


  return (
    <div className={`min-h-screen `} dir={lang === 'arabic' ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br  py-32`}>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-20 bg-cover bg-center"></div>
        <div className={`absolute inset-0 bg-gradient-to-br`}></div>
        <div className="container relative mx-auto px-6 lg:px-40">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 space-y-8">
              <div className="inline-block px-4 py-2 bg-teal-500/20 rounded-full">
                <span className={`${theme === "dark" ? "text-teal-200" : "text-teal-900"} font-medium`}>{t.since}</span>
              </div>
              <h1 className={`text-6xl font-bold ${theme === "dark" ? "text-white" : "text-black"} leading-tight`}>
                {t.hero.title}
              </h1>
              <p className={` ${theme === "dark" ? "text-teal-100" : "text-teal-900"}  text-xl max-w-lg`}>
                {t.hero.description}
              </p>
              <div className="flex gap-4">
                <button className={`${theme === "dark" ? "bg-white text-teal-900" : "bg-black text-teal-200"}  px-8 py-4 rounded-lg font-semibold hover:bg-teal-50 transition-all transform hover:scale-105`}>
                  {t.buttons.products} <i className={`fa fa-arrow-${lang === 'arabic' ? 'left' : 'right'} ml-2`}></i>
                </button>
            
              </div>
            </div>
            <div className="md:w-1/2 transform hover:scale-105 transition-all duration-500">
              <img src="https://media.licdn.com/dms/image/v2/D5612AQEUvTYvVXsxiA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1713226528438?e=2147483647&v=beta&t=HmfpU1BKPD0MXfNLV8wcXPPm2nY4RDdwN_UUYaI1NNQ" alt="Haibatuk Products" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <HaibatukSimplePage />


      {/* Product Categories */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6 lg:px-40">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-50'} mb-4`}>{t.products.title}</h2>
            <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-2xl mx-auto`}>{t.products.description}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {t.products.categories.map((category: { icon: any; title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; description: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; items: any[]; }, index: React.Key | null | undefined) => (
              <div key={index} className={`group relative p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300`}>
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-teal-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6">
                    <i className={`fa ${category.icon} text-2xl text-teal-500`}></i>
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-50'}`}>{category.title}</h3>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-4`}>{category.description}</p>
                  <ul className="space-y-2">
                    {category.items.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, idx: React.Key | null | undefined) => (
                      <li key={idx} className={`flex items-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                        <i className="fa fa-check text-teal-500 mr-2"></i>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* About Section */}
      <section className={`py-24 relative overflow-hidden`}>
        <div className="container mx-auto px-6 lg:px-40">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 space-y-6">
              <h2 className={`text-4xl font-bold  ${theme === 'light' ? 'text-gray-800' : 'text-gray-50'}`}>{t.about.title}</h2>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} text-lg`}>
                {t.about.description}
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                {t.about.features.map((item: { icon: any; text: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-500/10 rounded-full flex items-center justify-center">
                      <i className={`fa ${item.icon} text-teal-500`}></i>
                    </div>
                    <span className={` ${theme === 'light' ? 'text-gray-800' : 'text-gray-50'} font-medium`}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-teal-500/10 rounded-2xl transform -rotate-6"></div>
                <img src="https://media.licdn.com/dms/image/v2/D5612AQEUvTYvVXsxiA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1713226528438?e=2147483647&v=beta&t=HmfpU1BKPD0MXfNLV8wcXPPm2nY4RDdwN_UUYaI1NNQ" alt="About Haibatuk" className="relative rounded-2xl shadow-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-10 bg-cover bg-center"></div>
        <div className="container relative mx-auto px-6 lg:px-40">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.mission.title}</h2>
            <p className="text-teal-200 max-w-2xl mx-auto">
            {t.mission.description}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {t.mission.values.map((item: { icon: any; title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; text: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl hover:bg-white/20 transition-colors">
                <i className={`fa ${item.icon} text-3xl text-teal-400 mb-4`}></i>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-teal-100">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
