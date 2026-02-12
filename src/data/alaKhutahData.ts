// على خطاه Event Data Manifest
// This file contains all zones and booths data for the event
// To add new zones or booths, simply update this file

export interface Booth {
  id: string;
  name: string;
  image: string;
  type: 'F&B' | 'Retail';
  area: number;
  status?: 'available' | 'rented';
}

export interface Zone {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  description?: {
    ar: string;
    en: string;
  };
  slug: string;
  booths: Booth[];
}

export interface EventData {
  id: string;
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  zones: Zone[];
}

// Helper function to extract booth name from image filename
const extractBoothName = (filename: string): string => {
  // Remove file extension and return the name
  return filename.replace(/\.[^/.]+$/, '');
};

export const alaKhutahData: EventData = {
  id: 'ala-khutah',
  title: {
    ar: 'على خطاه',
    en: 'Ala Khutah',
  },
  description: {
    ar: 'اكتشف المساحات المتاحة في رحلة على خطاه من مكة إلى المدينة المنورة',
    en: 'Discover available spaces on the Ala Khutah journey from Makkah to Madinah',
  },
  zones: [
    {
      id: 'al-juhfah',
      name: {
        ar: 'الجُحفة',
        en: 'Al Juhfah',
      },
      description: {
        ar: 'محطة بارزة على طريق الهجرة، كانت ملتقى للقوافل، ومرّ بها النبي ﷺ وأصيب فيها بالوعك، فكانت موضع دعائه بأن يُحبّب الله إليه المدينة كما أحب مكة.',
        en: 'A prominent station on the Hijrah route, it was a meeting point for caravans. The Prophet ﷺ passed through it and fell ill there, making it the place where he prayed that Allah would make him love Madinah as he loved Makkah.',
      },
      slug: 'al-juhfah',
      booths: [
        { id: 'J-C03-03', name: 'J-C03-03', image: '/على خطاه/الجحفه/J-C03-03.png', type: 'Retail', area: 35.69 },
        { id: 'J-C04-03', name: 'J-C04-03', image: '/على خطاه/الجحفه/J-C04-03.png', type: 'Retail', area: 35.69 },
        { id: 'J-K06', name: 'J-K06', image: '/على خطاه/الجحفه/J-K06.png', type: 'Retail', area: 16 },
        { id: 'J-K10', name: 'J-K10', image: '/على خطاه/الجحفه/J-K10.png', type: 'F&B', area: 9, status: 'rented' },
        { id: 'J-K12', name: 'J-K12', image: '/على خطاه/الجحفه/J-K12.png', type: 'F&B', area: 9 },
        { id: 'J-K19', name: 'J-K19', image: '/على خطاه/الجحفه/J-K19.png', type: 'Retail', area: 16, status: 'rented' },
        { id: 'J-K30', name: 'J-K30', image: '/على خطاه/الجحفه/J-K30.png', type: 'F&B', area: 9 },
      ],
    },
    {
      id: 'al-reem',
      name: {
        ar: 'وادي الريم',
        en: 'Wadi Al Reem',
      },
      description: {
        ar: 'أحد أودية الحجاز الواقعة على مسار الطرق القديمة، يعكس امتداد الرحلة عبر الطبيعة الصحراوية ومراحل العبور المتتابعة.',
        en: 'One of the valleys of Hijaz located along the ancient trade routes, reflecting the journey\'s extension through the desert landscape and successive crossing stages.',
      },
      slug: 'al-reem',
      booths: [
        { id: 'R-C08', name: 'R-C08', image: '/على خطاه/الريم/R-C08.png', type: 'Retail', area: 52.36 },
        { id: 'R-K02', name: 'R-K02', image: '/على خطاه/الريم/R-K02.png', type: 'F&B', area: 22.5 },
        { id: 'R-K05', name: 'R-K05', image: '/على خطاه/الريم/R-K05.png', type: 'F&B', area: 22.5 },
        { id: 'R-K11', name: 'R-K11', image: '/على خطاه/الريم/R-K11.png', type: 'F&B', area: 16 },
      ],
    },
    {
      id: 'al-araj',
      name: {
        ar: 'العرج',
        en: 'Al Araj',
      },
      description: {
        ar: 'وادٍ مرّ به النبي ﷺ وصلى فيه، وكان محطة طبيعية للتوقف المؤقت في طريق الهجرة، ويجسد جانب العبادة والسكينة أثناء الرحلة.',
        en: 'A valley where the Prophet ﷺ passed through and prayed, serving as a natural resting station on the Hijrah route, embodying the aspect of worship and tranquility during the journey.',
      },
      slug: 'al-araj',
      booths: [
        { id: 'A-C02-02', name: 'A-C02-02', image: '/على خطاه/العرج/A-C02-02.png', type: 'Retail', area: 97.1 },
        { id: 'A-C05', name: 'A-C05', image: '/على خطاه/العرج/A-C05.png', type: 'F&B', area: 174.35 },
        { id: 'A-K04', name: 'A-K04', image: '/على خطاه/العرج/A-K04.png', type: 'F&B', area: 25 },
        { id: 'A-K07', name: 'A-K07', image: '/على خطاه/العرج/A-K07.png', type: 'F&B', area: 25 },
      ],
    },
    {
      id: 'al-qahah',
      name: {
        ar: 'القاحة',
        en: 'Al Qahah',
      },
      description: {
        ar: 'منطقة صحراوية مفتوحة ضمن مسارات السفر القديمة، تمثل مرحلة المرور الهادئ في طريق الهجرة عبر الطرق غير المأهولة.',
        en: 'An open desert area along the ancient travel routes, representing a quiet passage stage on the Hijrah route through uninhabited paths.',
      },
      slug: 'al-qahah',
      booths: [
        { id: 'Q-C03-02', name: 'Q-C03-02', image: '/على خطاه/القاحه/Q-C03-02.png', type: 'F&B', area: 134.8 },
        { id: 'Q-C03-03', name: 'Q-C03-03', image: '/على خطاه/القاحه/Q-C03-03.png', type: 'Retail', area: 35.69 },
        { id: 'Q-C03-04', name: 'Q-C03-04', image: '/على خطاه/القاحه/Q-C03-04.png', type: 'Retail', area: 36.57 },
        { id: 'Q-C04-03', name: 'Q-C04-03', image: '/على خطاه/القاحه/Q-C04-03.png', type: 'Retail', area: 35.69 },
        { id: 'Q-C04-04', name: 'Q-C04-04', image: '/على خطاه/القاحه/Q-C04-04.png', type: 'Retail', area: 36.57 },
        { id: 'Q-C13-01', name: 'Q-C13-01', image: '/على خطاه/القاحه/Q-C13-01.png', type: 'F&B', area: 64.5 },
        { id: 'Q-K08', name: 'Q-K08', image: '/على خطاه/القاحه/Q-K08.png', type: 'F&B', area: 9 },
        { id: 'Q-K12', name: 'Q-K12', image: '/على خطاه/القاحه/Q-K12.png', type: 'F&B', area: 9 },
        { id: 'Q-K22', name: 'Q-K22', image: '/على خطاه/القاحه/Q-K22.png', type: 'F&B', area: 9 },
        { id: 'Q-K24', name: 'Q-K24', image: '/على خطاه/القاحه/Q-K24.png', type: 'F&B', area: 40 },
        { id: 'Q-K25', name: 'Q-K25', image: '/على خطاه/القاحه/Q-K25.png', type: 'F&B', area: 9 },
      ],
    },
    {
      id: 'ghar-thawr',
      name: {
        ar: 'غار ثور',
        en: 'Ghar Thawr',
      },
      description: {
        ar: 'غار في جبل ثور جنوب مكة، اختبأ فيه النبي ﷺ وأبو بكر الصديق رضي الله عنه ثلاث ليالٍ قبل استكمال رحلة الهجرة إلى المدينة المنورة.',
        en: 'A cave in Mount Thawr south of Makkah, where the Prophet ﷺ and Abu Bakr Al-Siddiq hid for three nights before continuing the Hijrah journey to Madinah.',
      },
      slug: 'ghar-thawr',
      booths: [
        { id: 'G-K13', name: 'G-K13', image: '/على خطاه/غار ثور/G-K13.png', type: 'F&B', area: 27.45, status: 'rented' },
      ],
    },
    {
      id: 'al-juthathah',
      name: {
        ar: 'الجثاثة',
        en: 'Al Juthathah',
      },
      description: {
        ar: 'موقع على مسار طريق الهجرة النبوية، يمثل إحدى المحطات التي مرّ بها النبي ﷺ في رحلته من مكة إلى المدينة المنورة.',
        en: 'A location along the Hijrah route, representing one of the stations the Prophet ﷺ passed through on his journey from Makkah to Madinah.',
      },
      slug: 'al-juthathah',
      booths: [
        { id: 'T-C07-01', name: 'T-C07-01', image: '/على خطاه/الجثاثة/T-C07-01.png', type: 'F&B', area: 75.56 },
      ],
    },
    {
      id: 'asfal-usfan',
      name: {
        ar: 'أسفل عسفان',
        en: 'Asfal Usfan',
      },
      description: {
        ar: 'منطقة تقع أسفل عسفان على مسار الهجرة، مرّ بها النبي ﷺ وهي من المحطات التاريخية المهمة في طريق الرحلة النبوية.',
        en: 'An area located below Usfan along the Hijrah route, through which the Prophet ﷺ passed, serving as an important historical station on the prophetic journey.',
      },
      slug: 'asfal-usfan',
      booths: [
        { id: 'U-K03', name: 'U-K03', image: '/على خطاه/اسفل عسفان/U-K03.png', type: 'F&B', area: 9 },
        { id: 'U-K18', name: 'U-K18', image: '/على خطاه/اسفل عسفان/U-K18.png', type: 'Retail', area: 16 },
        { id: 'U-K23', name: 'U-K23', image: '/على خطاه/اسفل عسفان/U-K23.png', type: 'F&B', area: 9 },
      ],
    },
    {
      id: 'um-maabad',
      name: {
        ar: 'أم معبد',
        en: 'Um Maabad',
      },
      description: {
        ar: 'خيمة أم معبد الخزاعية، التي استضافت النبي ﷺ أثناء هجرته وشهدت معجزة حلب الشاة، وهي من أشهر محطات طريق الهجرة.',
        en: 'The tent of Um Maabad Al-Khuzaiyyah, who hosted the Prophet ﷺ during his Hijrah and witnessed the miracle of milking the sheep, one of the most famous stations on the Hijrah route.',
      },
      slug: 'um-maabad',
      booths: [
        { id: 'M-K02', name: 'M-K02', image: '/على خطاه/ام معبد/M-K02.png', type: 'Retail', area: 26.6 },
        { id: 'M-K04', name: 'M-K04', image: '/على خطاه/ام معبد/M-K04.png', type: 'Retail', area: 16.1 },
      ],
    },
  ],
};

// Helper function to get zone by slug
export const getZoneBySlug = (slug: string): Zone | undefined => {
  return alaKhutahData.zones.find((zone) => zone.slug === slug || zone.id === slug);
};

// Helper function to get total booth count
export const getTotalBoothCount = (): number => {
  return alaKhutahData.zones.reduce((total, zone) => total + zone.booths.length, 0);
};
