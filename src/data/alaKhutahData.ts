// على خطاه Event Data Manifest
// This file contains all zones and booths data for the event
// To add new zones or booths, simply update this file

export interface Booth {
  id: string;
  name: string;
  image: string;
}

export interface Zone {
  id: string;
  name: {
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
        ar: 'الجحفه',
        en: 'Al Juhfah',
      },
      slug: 'al-juhfah',
      booths: [
        { id: 'J-C03-03', name: 'J-C03-03', image: '/على خطاه/الجحفه/J-C03-03.png' },
        { id: 'J-C04-03', name: 'J-C04-03', image: '/على خطاه/الجحفه/J-C04-03.png' },
        { id: 'J-K06', name: 'J-K06', image: '/على خطاه/الجحفه/J-K06.png' },
        { id: 'J-K10', name: 'J-K10', image: '/على خطاه/الجحفه/J-K10.png' },
        { id: 'J-K12', name: 'J-K12', image: '/على خطاه/الجحفه/J-K12.png' },
        { id: 'J-K19', name: 'J-K19', image: '/على خطاه/الجحفه/J-K19.png' },
        { id: 'J-K30', name: 'J-K30', image: '/على خطاه/الجحفه/J-K30.png' },
      ],
    },
    {
      id: 'al-reem',
      name: {
        ar: 'الريم',
        en: 'Al Reem',
      },
      slug: 'al-reem',
      booths: [
        { id: 'R-C08', name: 'R-C08', image: '/على خطاه/الريم/R-C08.png' },
        { id: 'R-K02', name: 'R-K02', image: '/على خطاه/الريم/R-K02.png' },
        { id: 'R-K05', name: 'R-K05', image: '/على خطاه/الريم/R-K05.png' },
        { id: 'R-K11', name: 'R-K11', image: '/على خطاه/الريم/R-K11.png' },
      ],
    },
    {
      id: 'al-araj',
      name: {
        ar: 'العرج',
        en: 'Al Araj',
      },
      slug: 'al-araj',
      booths: [
        { id: 'A-C02-02', name: 'A-C02-02', image: '/على خطاه/العرج/A-C02-02.png' },
        { id: 'A-C05', name: 'A-C05', image: '/على خطاه/العرج/A-C05.png' },
        { id: 'A-K04', name: 'A-K04', image: '/على خطاه/العرج/A-K04.png' },
        { id: 'A-K07', name: 'A-K07', image: '/على خطاه/العرج/A-K07.png' },
      ],
    },
    {
      id: 'al-qahah',
      name: {
        ar: 'القاحه',
        en: 'Al Qahah',
      },
      slug: 'al-qahah',
      booths: [
        { id: 'Q-C03-02', name: 'Q-C03-02', image: '/على خطاه/القاحه/Q-C03-02.png' },
        { id: 'Q-C03-03', name: 'Q-C03-03', image: '/على خطاه/القاحه/Q-C03-03.png' },
        { id: 'Q-C03-04', name: 'Q-C03-04', image: '/على خطاه/القاحه/Q-C03-04.png' },
        { id: 'Q-C04-03', name: 'Q-C04-03', image: '/على خطاه/القاحه/Q-C04-03.png' },
        { id: 'Q-C04-04', name: 'Q-C04-04', image: '/على خطاه/القاحه/Q-C04-04.png' },
        { id: 'Q-C13-01', name: 'Q-C13-01', image: '/على خطاه/القاحه/Q-C13-01.png' },
        { id: 'Q-K08', name: 'Q-K08', image: '/على خطاه/القاحه/Q-K08.png' },
        { id: 'Q-K12', name: 'Q-K12', image: '/على خطاه/القاحه/Q-K12.png' },
        { id: 'Q-K22', name: 'Q-K22', image: '/على خطاه/القاحه/Q-K22.png' },
        { id: 'Q-K24', name: 'Q-K24', image: '/على خطاه/القاحه/Q-K24.png' },
        { id: 'Q-K25', name: 'Q-K25', image: '/على خطاه/القاحه/Q-K25.png' },
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
