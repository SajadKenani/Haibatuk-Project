import { useSelector } from 'react-redux';
import { RootState } from './store';

const HaibatukSimplePage = () => {
    const lang = useSelector((state: RootState) => state.language);
    // Fixed the duplicate theme selector that was incorrectly pulling from language state
    const theme = useSelector((state: RootState) => state.theme);
  
  const content: any = {
    arabic: {
      title: 'شركة هيبتك للتجارة العامة المحدودة',
      about: {
        heading: 'عن الشركة',
        text: 'تأسست شركة هيبتك للتجارة العامة المحدودة في عام 2008 , لتكون رائدة في مجال المنتجات الصحية  ومنها المنظفات و الورقيات إضافة الى منتجات العطور والمعطرات  وكل ما يعزز من صحة الفرد. وتقدم شركة هيبتك العلامات الخاصة بها ذات الجودة العالية التي تلبي احتياجات المجتمع مع الالتزام التام بمعايير الجودة العالمية.'
      },
      products: {
        heading: 'منتجاتنا',
        text: 'تقدم شركة هيبتك المنتجات الخاصة بها من المنتجات الورقية ( حفاضات الأطفال بجميع أنواعها وكبار السن والفوط النسائية إضافة الى المناديل الورقية ) الى جانب مجموعة متنوعة منتجات التنظيف عالية الجودة ومنتجات العطور والمعطرات , كل منتجاتنا مصنعة من مواد امنة وخضعت لفحوصات حازمة لضمان جودتها .'
      },
      quality: {
        heading: 'التزامنا بالجودة والتطوير',
        text: 'نفتخر في شركة هيبتك بأن منتجاتنا  الخاصة بنا  مصنعة تحت إشرافنا الكامل لضمان أعلى معايير الجودة في كل مرحلة. ومن خلال استثمارنا المستمر في دعم وتطوير كوادر الشركة ، نحرص على تقديم فرص التطوير الشخصي والمهني، مؤمنين بأهمية الشباب والكفاءات .'
      },
      brands: {
        heading: 'علاماتنا التجارية',
        text: 'تتمتع علاماتنا التجارية بثقة عالية عند المستهلكين ، حيث نركز على تقديم منتجات متاحة للجميع، تعكس كل منها جودة علامتنا وهدفنا في تعزيز صحة المجتمع. تمتاز منتجاتنا بانتشارها وثقة العملاء بها، لتكون بذلك مرجعًا في الجودة والموثوقية .'
      },
      mission: {
        heading: 'رسالتنا - نحو مستقبل أفضل',
        text: 'غايتنا هي أن نكون جزءاً من رحلتك نحو حياة صحية ومريحة. نحن في شركة هيبتك لا نقدم منتجات فحسب؛ بل نضع بين يديك تجارب مُصممة لتلبية احتياجاتك ورغباتك، ونعمل باستمرار على تطوير منتجات تُلبي معايير السلامة والصحة'
      }
    },
    english: {
      title: 'Haibatuk General Trading Company',
      about: {
        heading: 'About the Company',
        text: 'Haibatuk General Trading Company was established in 2008 to be a leader in health products including cleaning products, paper products, perfumes and everything that promotes individual health. Haibatuk offers its own high-quality brands that meet the needs of the community with full commitment to international quality standards.'
      },
      products: {
        heading: 'Our Products',
        text: 'Haibatuk offers its own paper products (baby diapers of all kinds, adult diapers, sanitary pads, and tissue paper) alongside a variety of high-quality cleaning products and perfumes. All our products are manufactured from safe materials and have undergone rigorous testing to ensure their quality.'
      },
      quality: {
        heading: 'Our Commitment to Quality and Development',
        text: 'At Haibatuk, we take pride that our products are manufactured under our complete supervision to ensure the highest quality standards at every stage. Through our continuous investment in supporting and developing company staff, we are keen to provide opportunities for personal and professional development, believing in the importance of youth and competencies.'
      },
      brands: {
        heading: 'Our Brands',
        text: 'Our brands enjoy high consumer confidence, as we focus on providing products available to everyone, each reflecting the quality of our brand and our goal of promoting community health. Our products are characterized by their spread and customer confidence, making them a reference in quality and reliability.'
      },
      mission: {
        heading: 'Our Mission - Towards a Better Future',
        text: 'Our goal is to be part of your journey towards a healthy and comfortable life. At Haibatuk, we don\'t just offer products; we put in your hands experiences designed to meet your needs and desires, and we continuously work on developing products that meet safety and health standards.'
      }
    }
  };
  
  const t = content[lang];
  
  return (
    <div dir={lang === 'arabic' ? 'rtl' : 'ltr'} className={`${lang === 'arabic' ? 'text-right' : 'text-left'}`}>

      
      {/* Main content section */}
      <div className="">
        <div className="max-w-5xl mx-auto">
          {/* About */}
          <div className={`mb-8 p-6 ${theme === "light" ? "bg-gray-100" : "bg-gray-600" }  rounded-lg shadow-md border-t-4 border-teal-600`}>
            <h2 className={`text-2xl font-bold ${theme === "light" ? "text-teal-800" : "text-teal-400"} mb-3`}>{t.about.heading}</h2>
            <p className={` ${ theme === "light" ? "text-gray-700" : "text-gray-200" }`}>{t.about.text}</p>
          </div>
          
          {/* Products */}
          <div className={`mb-8 p-6 ${theme === "light" ? "bg-gray-100" : "bg-gray-600" }  rounded-lg shadow-md border-t-4 border-teal-600`}>
            <h2 className={`text-2xl font-bold ${theme === "light" ? "text-teal-800" : "text-teal-400"}  mb-3`}>{t.products.heading}</h2>
            <p className={` ${ theme === "light" ? "text-gray-700" : "text-gray-200" }`}>{t.products.text}</p>
          </div>
          
          {/* Quality */}
          <div className={`mb-8 p-6 ${theme === "light" ? "bg-gray-100" : "bg-gray-600" }  rounded-lg shadow-md border-t-4 border-teal-600`}>
            <h2 className={`text-2xl font-bold ${theme === "light" ? "text-teal-800" : "text-teal-400"}  mb-3`}>{t.quality.heading}</h2>
            <p className={` ${ theme === "light" ? "text-gray-700" : "text-gray-200" }`}>{t.quality.text}</p>
          </div>
          
          {/* Brands */}
          <div className={`mb-8 p-6 ${theme === "light" ? "bg-gray-100" : "bg-gray-600" }  rounded-lg shadow-md border-t-4 border-teal-600`}>
            <h2 className={`text-2xl font-bold ${theme === "light" ? "text-teal-800" : "text-teal-400"}  mb-3`}>{t.brands.heading}</h2>
            <p className={` ${ theme === "light" ? "text-gray-700" : "text-gray-200" }`}>{t.brands.text}</p>
          </div>
          
          {/* Mission */}
          <div className={`mb-8 p-6 ${theme === "light" ? "bg-gray-100" : "bg-gray-600" }  rounded-lg shadow-md border-t-4 border-teal-600`}>
            <h2 className={`text-2xl font-bold ${theme === "light" ? "text-teal-800" : "text-teal-400"}  mb-3`}>{t.mission.heading}</h2>
            <p className={` ${ theme === "light" ? "text-gray-700" : "text-gray-200" }`}>{t.mission.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HaibatukSimplePage;