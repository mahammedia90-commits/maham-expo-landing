// Translations for Arabic and English

export const translations = {
  ar: {
    // Navigation
    nav: {
      home: "الرئيسية",
      about: "عن التطبيق",
      contacts: "اتصل بنا",
      terms: "الشروط والأحكام",
      privacy: "سياسة الخصوصية",
      downloadApp: "حمّل التطبيق",
      langToggle: "EN",
    },

    // Home Page
    home: {
      heroTitle: "اكتشف المساحة المثالية",
      heroTitleHighlight: " لنشاطك التجاري",
      heroDescription: "منصة متكاملة تربط بين المستثمرين والتجار في سوق الفعاليات والمعارض. ابحث، اعرض، واحجز مساحتك بكل سهولة وأمان.",
      downloadNow: "حمّل التطبيق الآن",
      learnMore: "تعرف على المزيد",
      activeEvents: "فعالية نشطة",
      availableSpaces: "مساحة متاحة",
      users: "مستخدم",

      // Problem & Solution
      problemSolutionTitle: "المشكلة والحل",
      problemSolutionDesc: "نحل التحديات التي تواجه سوق إيجار مساحات الفعاليات",
      problem: "المشكلة",
      solution: "الحل",
      problemItems: [
        "صعوبة إيجاد المساحات المناسبة في الفعاليات والمعارض",
        "غياب منصة موحدة تجمع بين المستثمرين والتجار",
        "عدم وجود شفافية في الأسعار وشروط الإيجار",
        "إجراءات معقدة وطويلة لإتمام عقود الإيجار"
      ],
      solutionItems: [
        "منصة موحدة تجمع كل الفعاليات والمساحات في مكان واحد",
        "خريطة تفاعلية وفلاتر بحث متقدمة لإيجاد المساحة المثالية",
        "أسعار واضحة وشروط محددة مع إمكانية المقارنة",
        "نظام طلبات وعقود إلكترونية سريعة وآمنة"
      ],

      // Download Section
      downloadTitle: "ابدأ رحلتك مع مهام إكسبو اليوم",
      downloadDesc: "حمّل التطبيق الآن واكتشف الفرص اللامحدودة في سوق الفعاليات والمعارض",
      downloadFrom: "حمّل من",
      getItOn: "احصل عليه من",
      areYouInvestor: "هل أنت مستثمر؟",
      investorCTA: "سجّل الآن واعرض مساحاتك لآلاف التجار الباحثين عن الموقع المثالي",
      registerAsInvestor: "سجّل كمستثمر",

      // Investor Registration Modal
      investorRegistration: {
        title: "تسجيل مستثمر جديد",
        subtitle: "أدخل بياناتك للبدء في عرض مساحاتك",
        fullName: "الاسم الكامل",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        companyName: "اسم الشركة / المنشأة",
        commercialRegister: "رقم السجل التجاري",
        city: "المدينة",
        spacesCount: "عدد المساحات المتوقعة",
        message: "رسالة إضافية (اختياري)",
        submit: "إرسال الطلب",
        submitting: "جاري الإرسال...",
        success: "تم إرسال طلبك بنجاح! سنتواصل معك قريباً.",
        error: "حدث خطأ، يرجى المحاولة مرة أخرى",
        close: "إغلاق",
        required: "مطلوب",
        cities: ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "أخرى"],
      },
    },

    // About Page
    about: {
      title: "عن التطبيق",
      subtitle: "تعرف على مهام إكسبو",
      featuresTitle: "الميزات الرئيسية",
      featuresDesc: "نوفر لك كل الأدوات التي تحتاجها لإدارة مساحاتك في الفعاليات بكفاءة",
      features: [
        { title: "بحث متقدم", description: "ابحث عن المساحات المثالية باستخدام فلاتر متعددة: الموقع، الحجم، السعر، والخدمات المتوفرة" },
        { title: "خريطة تفاعلية", description: "استعرض الفعاليات والمساحات على خريطة تفاعلية مع إمكانية التنقل بين المستويات المختلفة" },
        { title: "نظام طلبات متكامل", description: "قدم طلبات الزيارة والإيجار بسهولة مع تتبع حالة كل طلب في الوقت الفعلي" },
        { title: "معاملات آمنة", description: "جميع المعاملات المالية تتم عبر بوابات دفع آمنة مع إشراف إداري كامل" },
        { title: "لوحة تحكم شاملة", description: "إحصائيات وتقارير مفصلة لمتابعة أداء مساحاتك وإيراداتك" },
        { title: "إشعارات فورية", description: "ابقَ على اطلاع بحالة طلباتك والتحديثات المهمة من خلال نظام إشعارات متكامل" }
      ],
      howItWorksTitle: "كيف يعمل التطبيق؟",
      howItWorksDesc: "خطوات بسيطة لبدء رحلتك معنا",
      forDealers: "للتجار",
      forInvestors: "للمستثمرين",
      dealerSteps: [
        { step: "1", title: "سجّل حسابك", description: "أنشئ حسابك كتاجر وأكمل بيانات نشاطك التجاري" },
        { step: "2", title: "ابحث عن مساحة", description: "استخدم فلاتر البحث والخريطة لإيجاد المساحة المناسبة" },
        { step: "3", title: "اطلب زيارة", description: "قدم طلب زيارة لمعاينة المساحة قبل الحجز" },
        { step: "4", title: "أتمم الإيجار", description: "بعد الموافقة، أكمل عملية الدفع واستلم عقدك" }
      ],
      investorSteps: [
        { step: "1", title: "سجّل وتحقق", description: "أنشئ حسابك وقدم المستندات للتحقق من هويتك" },
        { step: "2", title: "أضف مساحاتك", description: "أدخل تفاصيل مساحاتك مع الصور والأسعار" },
        { step: "3", title: "استقبل الطلبات", description: "راجع طلبات الزيارة والإيجار من التجار" },
        { step: "4", title: "احصد الأرباح", description: "تابع إيراداتك وأدر مساحاتك بسهولة" }
      ],
      userTypesTitle: "أنواع المستخدمين",
      userTypesDesc: "منصة تخدم الجميع في منظومة الفعاليات والمعارض",
      userTypes: [
        {
          title: "التاجر",
          subtitle: "Dealer",
          description: "الباحث عن مساحة للإيجار في الفعاليات والمعارض",
          benefits: [
            "تصفح آلاف المساحات المتاحة",
            "بحث متقدم بفلاتر متعددة",
            "طلب زيارة ومعاينة المساحات",
            "إدارة العقود والمدفوعات",
            "تواصل مباشر مع المستثمرين"
          ]
        },
        {
          title: "المستثمر",
          subtitle: "Investor",
          description: "مالك المساحات الذي يعرض ويؤجر مساحاته في الفعاليات",
          benefits: [
            "عرض مساحاتك لآلاف التجار",
            "إدارة الطلبات والحجوزات",
            "تتبع الإيرادات والمدفوعات",
            "ترويج المساحات عبر الإعلانات",
            "لوحة تحكم شاملة بالإحصائيات"
          ]
        },
        {
          title: "المشرف",
          subtitle: "Admin",
          description: "المستوى الأعلى - إدارة كاملة للنظام والإشراف على جميع العمليات",
          benefits: [
            "إدارة الفعاليات والأماكن",
            "مراجعة والموافقة على المساحات",
            "إدارة المستخدمين والصلاحيات",
            "الموافقة النهائية على الطلبات",
            "الإدارة المالية الشاملة"
          ]
        }
      ],
      faqTitle: "الأسئلة الشائعة",
      faqDesc: "إجابات على أكثر الأسئلة شيوعاً",
      faqs: [
        { question: "ما هو تطبيق مهام إكسبو؟", answer: "مهام إكسبو هو تطبيق متكامل لإدارة سوق الفعاليات والمعارض، يربط بين المستثمرين (مالكي المساحات) والتجار (الباحثين عن مساحات للإيجار) تحت إشراف إداري كامل. التطبيق يوفر تجربة سلسة لتصفح وحجز وإدارة المساحات داخل الفعاليات والمعارض." },
        { question: "كيف يمكنني التسجيل كتاجر؟", answer: "يمكنك التسجيل كتاجر من خلال تحميل التطبيق وإنشاء حساب جديد. ستحتاج لتقديم معلومات نشاطك التجاري مثل: اسم النشاط، رقم السجل التجاري، نوع النشاط، معلومات التواصل، والمستندات الثبوتية." },
        { question: "هل يمكنني معاينة المساحة قبل الإيجار؟", answer: "نعم، يوفر التطبيق نظام طلب زيارة يتيح لك معاينة المساحة قبل اتخاذ قرار الإيجار. يتطلب طلب الزيارة موافقة المستثمر ثم المشرف، وقد يتطلب دفع رسوم بسيطة." },
        { question: "كيف تتم عملية الدفع؟", answer: "جميع المدفوعات تتم عبر بوابات دفع آمنة مدمجة في التطبيق. يمكن للتاجر دفع دفعة أولى عند الموافقة على طلب الإيجار، ثم إكمال الدفعات لاحقاً حسب جدول الدفع المتفق عليه." },
        { question: "ما أنواع المساحات المتاحة للإيجار؟", answer: "يتوفر في التطبيق أنواع متعددة من المساحات تشمل: الأكشاك، المطاعم، مساحات العروض، وغيرها. كل مساحة تأتي مع تفاصيل كاملة تشمل: الموقع، الأبعاد، الخدمات المتوفرة (كهرباء، ماء، تكييف)، والسعر." },
        { question: "هل التطبيق متوفر باللغة الإنجليزية؟", answer: "نعم، التطبيق يدعم اللغتين العربية والإنجليزية مع إمكانية التبديل بينهما بسهولة من إعدادات التطبيق." }
      ],
    },

    // Contact Page
    contact: {
      title: "اتصل بنا",
      subtitle: "نحن هنا لمساعدتك",
      formTitle: "أرسل لنا رسالة",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      subject: "الموضوع",
      message: "الرسالة",
      send: "إرسال",
      sending: "جاري الإرسال...",
      successMessage: "تم إرسال رسالتك بنجاح!",
      errorMessage: "حدث خطأ، يرجى المحاولة مرة أخرى",
      contactInfo: "معلومات التواصل",
      emailLabel: "البريد الإلكتروني:",
      phoneLabel: "الهاتف:",
      addressLabel: "العنوان:",
      address: "المملكة العربية السعودية - الرياض - حي العقيق",
      followUs: "تابعنا على",
    },

    // Terms Page
    terms: {
      title: "الشروط والأحكام",
      subtitle: "الشروط والأحكام الخاصة باستخدام التطبيق",
      lastUpdated: "آخر تحديث: يناير 2026",
      sections: [
        {
          title: "1. قبول الشروط",
          content: "باستخدام تطبيق مهام إكسبو، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام التطبيق."
        },
        {
          title: "2. استخدام الخدمة",
          content: "يجب استخدام التطبيق للأغراض المشروعة فقط. يحظر استخدام التطبيق بأي طريقة قد تضر بالخدمة أو المستخدمين الآخرين."
        },
        {
          title: "3. حسابات المستخدمين",
          content: "أنت مسؤول عن الحفاظ على سرية بيانات حسابك وكلمة المرور. يجب إخطارنا فوراً في حالة أي استخدام غير مصرح به لحسابك."
        },
        {
          title: "4. الملكية الفكرية",
          content: "جميع المحتويات والعلامات التجارية والشعارات هي ملك لشركة مهام. لا يجوز نسخ أو توزيع أي محتوى دون إذن كتابي مسبق."
        },
        {
          title: "5. إخلاء المسؤولية",
          content: "نحن لا نضمن دقة أو اكتمال المعلومات المقدمة من المستخدمين الآخرين. يجب التحقق من جميع المعلومات قبل اتخاذ أي قرار."
        },
        {
          title: "6. التعديلات",
          content: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر التطبيق أو البريد الإلكتروني."
        }
      ]
    },

    // Privacy Page
    privacy: {
      title: "سياسة الخصوصية",
      subtitle: "نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية",
      lastUpdated: "آخر تحديث: يناير 2026",
      dataWeCollect: "البيانات التي نجمعها",
      dataWeCollectDesc: "نقوم بجمع المعلومات التالية لتقديم خدماتنا:",
      dataWeCollectItems: [
        "معلومات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف",
        "معلومات النشاط التجاري: اسم النشاط، السجل التجاري",
        "معلومات الموقع: لعرض الفعاليات القريبة منك",
        "معلومات المعاملات: سجل الحجوزات والمدفوعات",
        "معلومات الجهاز: نوع الجهاز، نظام التشغيل"
      ],
      howWeUseData: "كيف نستخدم بياناتك",
      howWeUseDataDesc: "نستخدم معلوماتك للأغراض التالية:",
      howWeUseDataItems: [
        "توفير وتحسين خدماتنا",
        "معالجة الحجوزات والمدفوعات",
        "التواصل معك بشأن حسابك وخدماتنا",
        "إرسال إشعارات مهمة حول طلباتك",
        "تحسين تجربة المستخدم وتخصيص المحتوى"
      ],
      dataSharing: "مشاركة البيانات",
      dataSharingDesc: "قد نشارك معلوماتك مع:",
      dataSharingItems: [
        "المستثمرين/التجار عند إتمام عملية الحجز (معلومات التواصل الأساسية فقط)",
        "مزودي خدمات الدفع لمعالجة المعاملات المالية",
        "السلطات القانونية عند الطلب وفقاً للقانون"
      ],
      noSellData: "لا نبيع بياناتك الشخصية لأي طرف ثالث.",
      yourRights: "حقوقك",
      yourRightsDesc: "يحق لك:",
      yourRightsItems: [
        "الوصول إلى بياناتك الشخصية",
        "تصحيح أو تحديث معلوماتك",
        "طلب حذف حسابك وبياناتك",
        "الاعتراض على معالجة بياناتك",
        "سحب موافقتك في أي وقت"
      ],
      dataSecurity: "أمان البيانات",
      dataSecurityDesc: "نتخذ إجراءات أمنية صارمة لحماية بياناتك، تشمل التشفير، والخوادم الآمنة، والتحقق الثنائي، والمراقبة المستمرة. جميع المعاملات المالية تتم عبر بوابات دفع معتمدة ومشفرة.",
      cookies: "ملفات تعريف الارتباط (Cookies)",
      cookiesDesc: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتذكر تفضيلاتك. يمكنك إدارة إعدادات ملفات تعريف الارتباط من خلال إعدادات متصفحك أو التطبيق.",
      contactUs: "تواصل معنا",
      contactUsDesc: "لأي استفسارات حول سياسة الخصوصية أو لممارسة حقوقك، يرجى التواصل معنا:",
    },

    // Footer
    footer: {
      description: "منصة متكاملة لإدارة سوق الفعاليات والمعارض، نربط بين المستثمرين والتجار لخلق فرص تجارية ناجحة.",
      quickLinks: "روابط سريعة",
      contactUs: "تواصل معنا",
      saudiArabia: "المملكة العربية السعودية - الرياض - حي العقيق",
      allRightsReserved: "© 2026 شركة مهام. جميع الحقوق محفوظة.",
    },

    // Common
    common: {
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      retry: "إعادة المحاولة",
      back: "رجوع",
      next: "التالي",
      submit: "إرسال",
      cancel: "إلغاء",
      save: "حفظ",
      delete: "حذف",
      edit: "تعديل",
      view: "عرض",
      search: "بحث",
      filter: "تصفية",
      sort: "ترتيب",
      noResults: "لا توجد نتائج",
    }
  },
  en: {
    // Navigation
    nav: {
      home: "Home",
      about: "About",
      contacts: "Contacts",
      terms: "Terms",
      privacy: "Privacy",
      downloadApp: "Download App",
      langToggle: "ع",
    },

    // Home Page
    home: {
      heroTitle: "Discover the Perfect Space",
      heroTitleHighlight: " for Your Business",
      heroDescription: "A comprehensive platform connecting investors and dealers in the events and exhibitions market. Search, display, and book your space easily and securely.",
      downloadNow: "Download App Now",
      learnMore: "Learn More",
      activeEvents: "Active Events",
      availableSpaces: "Available Spaces",
      users: "Users",

      // Problem & Solution
      problemSolutionTitle: "Problem & Solution",
      problemSolutionDesc: "We solve the challenges facing the event space rental market",
      problem: "Problem",
      solution: "Solution",
      problemItems: [
        "Difficulty finding suitable spaces in events and exhibitions",
        "Lack of a unified platform connecting investors and dealers",
        "No transparency in prices and rental terms",
        "Complex and lengthy procedures to complete rental contracts"
      ],
      solutionItems: [
        "A unified platform that gathers all events and spaces in one place",
        "Interactive map and advanced search filters to find the perfect space",
        "Clear prices and specific terms with comparison options",
        "Fast and secure electronic request and contract system"
      ],

      // Download Section
      downloadTitle: "Start Your Journey with Maham Expo Today",
      downloadDesc: "Download the app now and discover unlimited opportunities in the events and exhibitions market",
      downloadFrom: "Download on",
      getItOn: "Get it on",
      areYouInvestor: "Are You an Investor?",
      investorCTA: "Register now and display your spaces to thousands of dealers looking for the perfect location",
      registerAsInvestor: "Register as Investor",

      // Investor Registration Modal
      investorRegistration: {
        title: "New Investor Registration",
        subtitle: "Enter your details to start displaying your spaces",
        fullName: "Full Name",
        email: "Email",
        phone: "Phone Number",
        companyName: "Company Name",
        commercialRegister: "Commercial Registration Number",
        city: "City",
        spacesCount: "Expected Number of Spaces",
        message: "Additional Message (Optional)",
        submit: "Submit Request",
        submitting: "Submitting...",
        success: "Your request has been submitted successfully! We will contact you soon.",
        error: "An error occurred, please try again",
        close: "Close",
        required: "Required",
        cities: ["Riyadh", "Jeddah", "Makkah", "Madinah", "Dammam", "Khobar", "Other"],
      },
    },

    // About Page
    about: {
      title: "About",
      subtitle: "Learn about Maham Expo",
      featuresTitle: "Key Features",
      featuresDesc: "We provide you with all the tools you need to manage your spaces in events efficiently",
      features: [
        { title: "Advanced Search", description: "Search for ideal spaces using multiple filters: location, size, price, and available services" },
        { title: "Interactive Map", description: "Browse events and spaces on an interactive map with the ability to navigate between different levels" },
        { title: "Integrated Request System", description: "Submit visit and rental requests easily with real-time tracking of each request status" },
        { title: "Secure Transactions", description: "All financial transactions are conducted through secure payment gateways with full administrative oversight" },
        { title: "Comprehensive Dashboard", description: "Detailed statistics and reports to track your spaces' performance and revenues" },
        { title: "Instant Notifications", description: "Stay updated on your requests status and important updates through an integrated notification system" }
      ],
      howItWorksTitle: "How Does It Work?",
      howItWorksDesc: "Simple steps to start your journey with us",
      forDealers: "For Dealers",
      forInvestors: "For Investors",
      dealerSteps: [
        { step: "1", title: "Register", description: "Create your account as a dealer and complete your business information" },
        { step: "2", title: "Search for Space", description: "Use search filters and map to find the right space" },
        { step: "3", title: "Request a Visit", description: "Submit a visit request to preview the space before booking" },
        { step: "4", title: "Complete Rental", description: "After approval, complete payment and receive your contract" }
      ],
      investorSteps: [
        { step: "1", title: "Register & Verify", description: "Create your account and submit documents for identity verification" },
        { step: "2", title: "Add Your Spaces", description: "Enter your spaces details with photos and prices" },
        { step: "3", title: "Receive Requests", description: "Review visit and rental requests from dealers" },
        { step: "4", title: "Earn Profits", description: "Track your revenues and manage your spaces easily" }
      ],
      userTypesTitle: "User Types",
      userTypesDesc: "A platform serving everyone in the events and exhibitions ecosystem",
      userTypes: [
        {
          title: "Dealer",
          subtitle: "Dealer",
          description: "Looking for rental space in events and exhibitions",
          benefits: [
            "Browse thousands of available spaces",
            "Advanced search with multiple filters",
            "Request visits and preview spaces",
            "Manage contracts and payments",
            "Direct communication with investors"
          ]
        },
        {
          title: "Investor",
          subtitle: "Investor",
          description: "Space owner who displays and rents spaces at events",
          benefits: [
            "Display your spaces to thousands of dealers",
            "Manage requests and bookings",
            "Track revenues and payments",
            "Promote spaces through advertisements",
            "Comprehensive statistics dashboard"
          ]
        },
        {
          title: "Admin",
          subtitle: "Admin",
          description: "Highest level - complete system management and oversight of all operations",
          benefits: [
            "Manage events and venues",
            "Review and approve spaces",
            "Manage users and permissions",
            "Final approval of requests",
            "Comprehensive financial management"
          ]
        }
      ],
      faqTitle: "FAQ",
      faqDesc: "Answers to the most common questions",
      faqs: [
        { question: "What is Maham Expo app?", answer: "Maham Expo is a comprehensive app for managing the events and exhibitions market, connecting investors (space owners) and dealers (those looking for rental spaces) under full administrative supervision. The app provides a seamless experience for browsing, booking, and managing spaces within events and exhibitions." },
        { question: "How can I register as a dealer?", answer: "You can register as a dealer by downloading the app and creating a new account. You will need to provide your business information such as: business name, commercial registration number, business type, contact information, and supporting documents." },
        { question: "Can I preview the space before renting?", answer: "Yes, the app provides a visit request system that allows you to preview the space before making a rental decision. The visit request requires investor approval then admin approval, and may require a small fee." },
        { question: "How does the payment process work?", answer: "All payments are made through secure payment gateways integrated into the app. The dealer can pay an initial payment upon approval of the rental request, then complete payments later according to the agreed payment schedule." },
        { question: "What types of spaces are available for rent?", answer: "The app offers multiple types of spaces including: kiosks, restaurants, display spaces, and more. Each space comes with complete details including: location, dimensions, available services (electricity, water, AC), and price." },
        { question: "Is the app available in English?", answer: "Yes, the app supports both Arabic and English with easy switching between them from the app settings." }
      ],
    },

    // Contact Page
    contact: {
      title: "Contact Us",
      subtitle: "We're here to help you",
      formTitle: "Send us a message",
      name: "Full Name",
      email: "Email",
      phone: "Phone Number",
      subject: "Subject",
      message: "Message",
      send: "Send",
      sending: "Sending...",
      successMessage: "Your message has been sent successfully!",
      errorMessage: "An error occurred, please try again",
      contactInfo: "Contact Information",
      emailLabel: "Email:",
      phoneLabel: "Phone:",
      addressLabel: "Address:",
      address: "Saudi Arabia - Riyadh - Al Aqiq District",
      followUs: "Follow us on",
    },

    // Terms Page
    terms: {
      title: "Terms & Conditions",
      subtitle: "Terms and conditions for using the application",
      lastUpdated: "Last updated: January 2026",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: "By using the Maham Expo app, you agree to comply with these terms and conditions. If you do not agree to any of these terms, please do not use the app."
        },
        {
          title: "2. Use of Service",
          content: "The app must be used for legitimate purposes only. Using the app in any way that could harm the service or other users is prohibited."
        },
        {
          title: "3. User Accounts",
          content: "You are responsible for maintaining the confidentiality of your account credentials and password. You must notify us immediately of any unauthorized use of your account."
        },
        {
          title: "4. Intellectual Property",
          content: "All content, trademarks, and logos are the property of Maham Company. No content may be copied or distributed without prior written permission."
        },
        {
          title: "5. Disclaimer",
          content: "We do not guarantee the accuracy or completeness of information provided by other users. All information should be verified before making any decisions."
        },
        {
          title: "6. Modifications",
          content: "We reserve the right to modify these terms at any time. You will be notified of any material changes via the app or email."
        }
      ]
    },

    // Privacy Page
    privacy: {
      title: "Privacy Policy",
      subtitle: "We are committed to protecting your privacy and personal data",
      lastUpdated: "Last updated: January 2026",
      dataWeCollect: "Data We Collect",
      dataWeCollectDesc: "We collect the following information to provide our services:",
      dataWeCollectItems: [
        "Account information: name, email, phone number",
        "Business information: business name, commercial registration",
        "Location information: to display events near you",
        "Transaction information: booking and payment history",
        "Device information: device type, operating system"
      ],
      howWeUseData: "How We Use Your Data",
      howWeUseDataDesc: "We use your information for the following purposes:",
      howWeUseDataItems: [
        "Provide and improve our services",
        "Process bookings and payments",
        "Communicate with you about your account and services",
        "Send important notifications about your requests",
        "Improve user experience and personalize content"
      ],
      dataSharing: "Data Sharing",
      dataSharingDesc: "We may share your information with:",
      dataSharingItems: [
        "Investors/dealers upon completing a booking (basic contact information only)",
        "Payment service providers to process financial transactions",
        "Legal authorities upon request in accordance with the law"
      ],
      noSellData: "We do not sell your personal data to any third party.",
      yourRights: "Your Rights",
      yourRightsDesc: "You have the right to:",
      yourRightsItems: [
        "Access your personal data",
        "Correct or update your information",
        "Request deletion of your account and data",
        "Object to processing of your data",
        "Withdraw your consent at any time"
      ],
      dataSecurity: "Data Security",
      dataSecurityDesc: "We take strict security measures to protect your data, including encryption, secure servers, two-factor authentication, and continuous monitoring. All financial transactions are conducted through certified and encrypted payment gateways.",
      cookies: "Cookies",
      cookiesDesc: "We use cookies to improve your experience and remember your preferences. You can manage cookie settings through your browser or app settings.",
      contactUs: "Contact Us",
      contactUsDesc: "For any inquiries about the privacy policy or to exercise your rights, please contact us:",
    },

    // Footer
    footer: {
      description: "A comprehensive platform for managing the events and exhibitions market, connecting investors and dealers to create successful business opportunities.",
      quickLinks: "Quick Links",
      contactUs: "Contact Us",
      saudiArabia: "Saudi Arabia - Riyadh - Al Aqiq District",
      allRightsReserved: "© 2026 Maham Company. All rights reserved.",
    },

    // Common
    common: {
      loading: "Loading...",
      error: "An error occurred",
      retry: "Retry",
      back: "Back",
      next: "Next",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      noResults: "No results found",
    }
  }
};

export type Translations = typeof translations;
export type TranslationKey = keyof typeof translations.ar;
