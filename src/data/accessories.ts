export interface AccessoryItem {
  id: string;
  name: {
    ru: string;
    en: string;
    kk: string;
  };
  description: {
    ru: string;
    en: string;
    kk: string;
  };
  history: {
    ru: string;
    en: string;
    kk: string;
  };
  price_kzt: number;
  price_usd: number;
  category: 'structure' | 'rope' | 'decoration' | 'cover';
  photo: string;
}

export const TRADITIONAL_ACCESSORIES: AccessoryItem[] = [
  {
    id: 'shanyrak',
    name: {
      ru: 'Шаңырақ',
      en: 'Shanyrak',
      kk: 'Шаңырақ'
    },
    description: {
      ru: 'Верхнее круглое отверстие юрты — символ единства семьи и связи с небом',
      en: 'The circular crown of the yurt — symbol of family unity and connection to the sky',
      kk: 'Киіз үйдің жоғарғы дөңгелек тесігі — отбасы бірлігі мен аспанмен байланыстың белгісі'
    },
    history: {
      ru: 'Шаңырақ — священный символ казахского народа, изображённый на гербе Казахстана. Это купол юрты, через который проходит дым очага и проникает солнечный свет. В традиции шаңырақ передавался от отца к младшему сыну, символизируя преемственность рода. Мастера вырезают шаңырақ из цельного куска дерева, создавая крестообразную решётку с изогнутыми перекладинами.',
      en: 'Shanyrak is a sacred symbol of the Kazakh people, depicted on Kazakhstan\'s coat of arms. It is the crown of the yurt through which hearth smoke passes and sunlight enters. Traditionally, the shanyrak was passed from father to youngest son, symbolizing family continuity. Master craftsmen carve the shanyrak from a single piece of wood, creating a cross-shaped lattice with curved crossbeams.',
      kk: 'Шаңырақ — қазақ халқының қасиетті белгісі, Қазақстан елтаңбасында бейнеленген. Бұл киіз үйдің күмбезі, оның арқылы ошақ түтіні шығады және күн сәулесі кіреді. Дәстүр бойынша шаңырақ әкеден кіші ұлға берілді, бұл ұрпақ жалғастығын білдірді. Шеберлер шаңырақты бір ағаш бөлігінен ойып, қисық торлы крест тәрізді құрылым жасайды.'
    },
    price_kzt: 850000,
    price_usd: 1900,
    category: 'structure',
    photo: '/images/accessories/shanyrak.jpg'
  },
  {
    id: 'uyk',
    name: {
      ru: 'Уық',
      en: 'Uyk',
      kk: 'Уық'
    },
    description: {
      ru: 'Изогнутые жерди, соединяющие кереге с шаңырақом — рёбра купола',
      en: 'Curved poles connecting kerege to shanyrak — the ribs of the dome',
      kk: 'Кереге мен шаңырақты қосатын қисық сырықтар — күмбездің қабырғалары'
    },
    history: {
      ru: 'Уық — это длинные изогнутые жерди, формирующие купол юрты. Каждая уық вставляется одним концом в кереге (стену), а другим — в шаңырақ. В традиционной юрте используется от 60 до 120 уықов в зависимости от размера. Мастера вручную изгибают каждую жердь из молодой древесины, создавая идеальную дугу. Количество уықов определяет прочность и форму купола.',
      en: 'Uyk are long curved poles that form the yurt\'s dome. Each uyk is inserted with one end into the kerege (wall) and the other into the shanyrak. A traditional yurt uses 60 to 120 uyks depending on size. Craftsmen hand-bend each pole from young wood, creating a perfect arc. The number of uyks determines the dome\'s strength and shape.',
      kk: 'Уық — киіз үйдің күмбезін құрайтын ұзын қисық сырықтар. Әрбір уық бір ұшымен кереге (қабырға) ішіне, екінші ұшымен шаңырақ ішіне кіргізіледі. Дәстүрлі киіз үйде өлшеміне байланысты 60-тан 120-ға дейін уық қолданылады. Шеберлер әрбір сырықты жас ағаштан қолмен иіп, керемет доға жасайды.'
    },
    price_kzt: 450000,
    price_usd: 1000,
    category: 'structure',
    photo: '/images/accessories/uyk.jpg'
  },
  {
    id: 'kerege',
    name: {
      ru: 'Кереге',
      en: 'Kerege',
      kk: 'Кереге'
    },
    description: {
      ru: 'Раздвижные решётчатые стены юрты — основа конструкции',
      en: 'Expandable lattice walls of the yurt — the foundation of the structure',
      kk: 'Киіз үйдің жайылмалы тор қабырғалары — құрылымның негізі'
    },
    history: {
      ru: 'Кереге — это складные решётчатые секции, образующие стены юрты. Каждая секция называется «канат». Традиционная юрта состоит из 4-8 канатов. Кереге изготавливается из ивовых прутьев, скреплённых кожаными ремешками, что позволяет складывать и раскладывать конструкцию. Эта гениальная система позволяла кочевникам собирать юрту за час и перевозить её на двух верблюдах.',
      en: 'Kerege are collapsible lattice sections forming the yurt\'s walls. Each section is called a "kanat." A traditional yurt consists of 4-8 kanats. Kerege is made from willow rods bound with leather straps, allowing the structure to fold and unfold. This ingenious system enabled nomads to assemble a yurt in one hour and transport it on two camels.',
      kk: 'Кереге — киіз үйдің қабырғаларын құрайтын жиналмалы тор секциялары. Әрбір секция «қанат» деп аталады. Дәстүрлі киіз үй 4-8 қанаттан тұрады. Кереге тал шыбықтарынан жасалып, былғары белдіктермен байланған, бұл құрылымды жинауға және жаюға мүмкіндік береді. Бұл керемет жүйе көшпенділерге киіз үйді бір сағатта жинауға және екі түйеде тасымалдауға мүмкіндік берді.'
    },
    price_kzt: 1200000,
    price_usd: 2700,
    category: 'structure',
    photo: '/images/accessories/kerege.jpg'
  },
  {
    id: 'esik',
    name: {
      ru: 'Есік',
      en: 'Esik',
      kk: 'Есік'
    },
    description: {
      ru: 'Деревянная дверь юрты с традиционной резьбой',
      en: 'Wooden yurt door with traditional carvings',
      kk: 'Дәстүрлі ойма-ойымдары бар ағаш есік'
    },
    history: {
      ru: 'Есік — деревянная дверь юрты, всегда обращённая на юг или восток для максимального освещения. В отличие от войлочного полога кочевников, современные есіки украшаются традиционными казахскими орнаментами — символами защиты, плодородия и благополучия. Дверь изготавливается из прочного дерева и часто становится произведением искусства, передаваемым через поколения.',
      en: 'Esik is the wooden door of the yurt, always facing south or east for maximum light. Unlike the felt flap used by nomads, modern esiks are decorated with traditional Kazakh ornaments — symbols of protection, fertility, and prosperity. The door is crafted from sturdy wood and often becomes an heirloom passed through generations.',
      kk: 'Есік — киіз үйдің ағаш есігі, әрқашан максималды жарық үшін оңтүстікке немесе шығысқа қарап тұрады. Көшпенділердің киіз перделерінен айырмашылығы, заманауи есіктер дәстүрлі қазақ ою-өрнектерімен безендіріледі — қорғаныс, құнарлылық және береке белгілері. Есік берік ағаштан жасалады және көбінесе ұрпақтан ұрпаққа берілетін өнер туындысына айналады.'
    },
    price_kzt: 380000,
    price_usd: 850,
    category: 'structure',
    photo: '/images/accessories/esik.jpg'
  },
  {
    id: 'tundik',
    name: {
      ru: 'Түндік',
      en: 'Tundik',
      kk: 'Түндік'
    },
    description: {
      ru: 'Войлочное покрытие для шаңырақа — регулирует свет и вентиляцию',
      en: 'Felt cover for the shanyrak — regulates light and ventilation',
      kk: 'Шаңырақтың киіз жабыны — жарық пен желдетуді реттейді'
    },
    history: {
      ru: 'Түндік — это войлочное покрытие, закрывающее шаңырақ в холодную погоду или дождь. Название происходит от слова «түн» (ночь), так как его закрывали на ночь для сохранения тепла. Днём түндік открывали, позволяя солнечному свету проникать внутрь и дыму выходить наружу. Это простое, но гениальное решение для регулирования температуры и освещения в юрте.',
      en: 'Tundik is a felt cover that closes the shanyrak during cold weather or rain. The name comes from "tun" (night), as it was closed at night to retain heat. During the day, the tundik was opened, allowing sunlight to enter and smoke to escape. This simple yet ingenious solution regulated temperature and lighting in the yurt.',
      kk: 'Түндік — суық ауа райында немесе жаңбыр кезінде шаңырақты жабатын киіз жабын. Аты «түн» сөзінен шыққан, себебі оны жылуды сақтау үшін түнде жапқан. Күндіз түндікті ашып, күн сәулесінің кіруіне және түтіннің шығуына жол берген. Бұл киіз үйдегі температура мен жарықты реттеудің қарапайым, бірақ керемет шешімі.'
    },
    price_kzt: 95000,
    price_usd: 210,
    category: 'cover',
    photo: '/images/accessories/tundik.jpg'
  },
  {
    id: 'uzik',
    name: {
      ru: 'Үзік',
      en: 'Uzik',
      kk: 'Үзік'
    },
    description: {
      ru: 'Войлочные маты для покрытия стен юрты',
      en: 'Felt mats for covering the yurt walls',
      kk: 'Киіз үй қабырғаларын жабуға арналған киіз төсеніштер'
    },
    history: {
      ru: 'Үзік — это прямоугольные войлочные полотна, которыми покрывают кереге (стены юрты). Изготавливаются из овечьей шерсти методом валяния — древней техники, где шерсть увлажняют, раскладывают слоями и уплотняют катанием. Один үзік может весить до 30 кг и служить десятилетиями. Толщина войлока обеспечивает изоляцию: летом сохраняет прохладу, зимой — тепло.',
      en: 'Uzik are rectangular felt panels covering the kerege (yurt walls). Made from sheep\'s wool using felting — an ancient technique where wool is moistened, layered, and compressed by rolling. One uzik can weigh up to 30 kg and last for decades. The felt\'s thickness provides insulation: keeping cool in summer and warm in winter.',
      kk: 'Үзік — кереге (киіз үй қабырғалары) жабатын тіктөртбұрышты киіз парақтар. Қой жүнінен киіз басу арқылы жасалады — ежелгі техника, онда жүнді ылғалдандырып, қабаттап, домалатып тығыздайды. Бір үзік 30 кг-ға дейін салмақта болуы және ондаған жылдар қызмет етуі мүмкін. Киіздің қалыңдығы оқшаулауды қамтамасыз етеді: жазда салқындатады, қыста жылытады.'
    },
    price_kzt: 520000,
    price_usd: 1150,
    category: 'cover',
    photo: '/images/accessories/uzik.jpg'
  },
  {
    id: 'tuyrlyq',
    name: {
      ru: 'Туырлық',
      en: 'Tuyrlyq',
      kk: 'Туырлық'
    },
    description: {
      ru: 'Внешнее покрытие купола — защита от дождя и ветра',
      en: 'Outer dome covering — protection from rain and wind',
      kk: 'Күмбездің сыртқы жабыны — жаңбыр мен желден қорғаныс'
    },
    history: {
      ru: 'Туырлық — верхнее покрытие купола юрты, защищающее от осадков. Традиционно изготавливалось из толстого войлока, пропитанного жиром для водонепроницаемости. Современные туырлықи делают из брезента или специальной ткани. Туырлық укладывается поверх үзіков и крепится верёвками, образуя надёжную защиту от непогоды.',
      en: 'Tuyrlyq is the upper dome covering of the yurt, protecting from precipitation. Traditionally made from thick felt impregnated with fat for waterproofing. Modern tuyrlyqs are made from canvas or specialized fabric. The tuyrlyq is laid over the uziks and secured with ropes, forming reliable weather protection.',
      kk: 'Туырлық — киіз үй күмбезінің жоғарғы жабыны, жауын-шашыннан қорғайды. Дәстүрлі түрде су өткізбеу үшін майға малынған қалың киізден жасалған. Заманауи туырлықтар брезент немесе арнайы матадан жасалады. Туырлық үзіктердің үстіне төселіп, арқандармен бекітіледі, ауа райынан сенімді қорғаныс құрайды.'
    },
    price_kzt: 680000,
    price_usd: 1500,
    category: 'cover',
    photo: '/images/accessories/tuyrlyq.jpg'
  },
  {
    id: 'tuskiyz',
    name: {
      ru: 'Тускиыз',
      en: 'Tuskiyz',
      kk: 'Тускиіз'
    },
    description: {
      ru: 'Декоративные войлочные панели с традиционными узорами',
      en: 'Decorative felt panels with traditional patterns',
      kk: 'Дәстүрлі өрнектері бар сәндік киіз панельдер'
    },
    history: {
      ru: 'Тускиіз — это настенные войлочные ковры с вышитыми или аппликационными узорами, украшающие внутреннее пространство юрты. Традиционно изготавливались женщинами и передавались как приданое. Узоры несут символическое значение: рога барана (благополучие), солнце (жизнь), волны (вечность). Каждый тускиіз — уникальное произведение искусства, создаваемое месяцами.',
      en: 'Tuskiyz are wall felt carpets with embroidered or appliqué patterns decorating the yurt\'s interior. Traditionally crafted by women and passed as dowry. Patterns carry symbolic meaning: ram\'s horns (prosperity), sun (life), waves (eternity). Each tuskiyz is a unique artwork taking months to create.',
      kk: 'Тускиіз — киіз үйдің ішкі кеңістігін безендіретін кесте немесе аппликациялық өрнектері бар қабырға киіз кілемдері. Дәстүрлі түрде әйелдер жасаған және қалың мал ретінде берілген. Өрнектер символикалық мағынаға ие: қошқар мүйізі (береке), күн (өмір), толқын (мәңгілік). Әрбір тускиіз — айлар бойы жасалатын бірегей өнер туындысы.'
    },
    price_kzt: 750000,
    price_usd: 1650,
    category: 'decoration',
    photo: '/images/accessories/tuskiyz.jpg'
  },
  {
    id: 'ot-kilem',
    name: {
      ru: 'От кілем диаметр 9м',
      en: 'Ot Kilem diameter 9m',
      kk: 'От кілем диаметрі 9м'
    },
    description: {
      ru: 'Центральный круглый войлочный ковёр для пола',
      en: 'Central round felt carpet for the floor',
      kk: 'Еденге арналған орталық дөңгелек киіз кілем'
    },
    history: {
      ru: 'От кілем — это круглый войлочный ковёр, размещаемый в центре юрты вокруг очага (от). Диаметр 9 метров идеально подходит для больших юрт. Войлок защищает от холода земли и создаёт комфортное пространство для сидения. Традиционно от кілем изготавливался из лучшей шерсти и украшался по краям орнаментами. Это центр домашнего очага, где собиралась вся семья.',
      en: 'Ot Kilem is a round felt carpet placed in the yurt\'s center around the hearth (ot). A 9-meter diameter is perfect for large yurts. The felt protects from ground cold and creates a comfortable seating space. Traditionally, ot kilem was made from the finest wool and decorated with edge patterns. It is the center of the home where the whole family gathered.',
      kk: 'От кілем — киіз үйдің орталығына ошақтың (от) айналасына төселетін дөңгелек киіз кілем. 9 метр диаметрі үлкен киіз үйлерге өте қолайлы. Киіз жердің суығынан қорғайды және отыруға ыңғайлы кеңістік жасайды. Дәстүрлі түрде от кілем ең жақсы жүннен жасалып, шеттері өрнектермен безендірілген. Бұл бүкіл отбасы жиналатын үй ошағының орталығы.'
    },
    price_kzt: 890000,
    price_usd: 1950,
    category: 'decoration',
    photo: '/images/accessories/ot-kilem.jpg'
  },
  {
    id: 'ak-baskur',
    name: {
      ru: 'Ақ басқұр ширина 40см',
      en: 'Ak Baskur width 40cm',
      kk: 'Ақ басқұр ені 40см'
    },
    description: {
      ru: 'Белая декоративная лента для украшения стыков',
      en: 'White decorative ribbon for adorning joints',
      kk: 'Буындарды безендіруге арналған ақ сәндік лента'
    },
    history: {
      ru: 'Ақ басқұр — это белая тканевая лента шириной 40 см, которой обрамляют стыки войлочных покрытий и украшают внутреннее пространство юрты. Белый цвет символизирует чистоту, свет и благополучие в казахской культуре. Басқұр часто вышивается традиционными узорами и служит не только декоративным, но и функциональным элементом, укрепляя соединения.',
      en: 'Ak Baskur is a white fabric ribbon 40 cm wide used to frame felt covering joints and decorate the yurt\'s interior. White symbolizes purity, light, and prosperity in Kazakh culture. Baskur is often embroidered with traditional patterns and serves both decorative and functional purposes, reinforcing connections.',
      kk: 'Ақ басқұр — киіз жабындардың буындарын шеңберлеп, киіз үйдің ішкі кеңістігін безендіруге арналған 40 см ені бар ақ мата лента. Ақ түс қазақ мәдениетінде тазалықты, жарықты және берекені білдіреді. Басқұр көбінесе дәстүрлі өрнектермен кестеленеді және сәндік қана емес, функционалды да элемент болып, қосылыстарды нығайтады.'
    },
    price_kzt: 125000,
    price_usd: 280,
    category: 'decoration',
    photo: '/images/accessories/ak-baskur.jpg'
  },
  {
    id: 'ak-kyzyl-baular',
    name: {
      ru: 'Ақ, қызыл баулар',
      en: 'Ak, Kyzyl Baular',
      kk: 'Ақ, қызыл баулар'
    },
    description: {
      ru: 'Белые и красные верёвки для крепления конструкции',
      en: 'White and red ropes for securing the structure',
      kk: 'Құрылымды бекітуге арналған ақ және қызыл арқандар'
    },
    history: {
      ru: 'Баулар — это верёвки, которыми скрепляют все элементы юрты. Белые (ақ) и красные (қызыл) баулары имеют не только функциональное, но и символическое значение. Красный цвет символизирует жизненную силу и защиту, белый — чистоту и мир. Традиционно баулары изготавливались из конского волоса или верблюжьей шерсти, скрученных в прочные канаты. Правильная техника вязки баулар передавалась от мастера к ученику.',
      en: 'Baular are ropes that bind all yurt elements together. White (ak) and red (kyzyl) baular have both functional and symbolic meaning. Red symbolizes life force and protection, white represents purity and peace. Traditionally, baular were made from horsehair or camel wool twisted into strong ropes. The proper tying technique was passed from master to apprentice.',
      kk: 'Баулар — киіз үйдің барлық элементтерін байланыстыратын арқандар. Ақ және қызыл баулардың функционалды ғана емес, символикалық мағынасы да бар. Қызыл түс өмірлік күш пен қорғанысты, ақ түс тазалық пен бейбітшілікті білдіреді. Дәстүрлі түрде баулар жылқы жалынан немесе түйе жүнінен берік арқандарға оралған. Баулар байлаудың дұрыс техникасы шеберден шәкіртке берілген.'
    },
    price_kzt: 180000,
    price_usd: 400,
    category: 'rope',
    photo: '/images/accessories/ak-kyzyl-baular.jpg'
  },
  {
    id: 'ayir-bau',
    name: {
      ru: 'Айыр бау',
      en: 'Ayir Bau',
      kk: 'Айыр бау'
    },
    description: {
      ru: 'Верёвка-распорка для фиксации уықов',
      en: 'Spacer rope for securing uyks',
      kk: 'Уықтарды бекітуге арналған ара қашықтық арқаны'
    },
    history: {
      ru: 'Айыр бау — это специальная верёвка, которая фиксирует уықи (жерди купола) в правильном положении, предотвращая их смещение. Название происходит от слова «айыру» — разделять, так как эта верёвка разделяет и удерживает жерди на равном расстоянии друг от друга. Правильная натяжка айыр бау критична для устойчивости купола и равномерного распределения нагрузки.',
      en: 'Ayir Bau is a special rope that secures the uyks (dome poles) in correct position, preventing displacement. The name comes from "ayiru" — to separate, as this rope separates and maintains poles at equal distances. Proper tensioning of ayir bau is critical for dome stability and even load distribution.',
      kk: 'Айыр бау — уықтарды (күмбез сырықтары) дұрыс қалыпта бекітіп, жылжуын болдырмайтын арнайы арқан. Аты «айыру» сөзінен шыққан, себебі бұл арқан сырықтарды бір-бірінен тең қашықтықта бөліп ұстайды. Айыр бауды дұрыс тарту күмбездің тұрақтылығы және жүктеменің біркелкі таралуы үшін өте маңызды.'
    },
    price_kzt: 85000,
    price_usd: 190,
    category: 'rope',
    photo: '/images/accessories/ayir-bau.jpg'
  },
  {
    id: 'zhel-bau',
    name: {
      ru: 'Жел бау',
      en: 'Zhel Bau',
      kk: 'Жел бау'
    },
    description: {
      ru: 'Ветровые верёвки для устойчивости в непогоду',
      en: 'Wind ropes for stability in bad weather',
      kk: 'Нашар ауа райында тұрақтылыққа арналған жел арқандары'
    },
    history: {
      ru: 'Жел бау — это внешние верёвки, которыми юрту крепят к земле или к специальным кольям для защиты от сильного ветра. В степях Казахстана ветра могут быть очень мощными, поэтому жел бау — критически важный элемент. Традиционно использовалось 4-8 жел бау, расположенных по кругу. Кочевники знали особые узлы, позволяющие быстро натянуть или ослабить верёвки в зависимости от погоды.',
      en: 'Zhel Bau are external ropes anchoring the yurt to the ground or special stakes for protection from strong winds. In Kazakhstan\'s steppes, winds can be very powerful, making zhel bau a critical element. Traditionally, 4-8 zhel bau were used, arranged in a circle. Nomads knew special knots allowing quick tightening or loosening depending on weather.',
      kk: 'Жел бау — киіз үйді күшті желден қорғау үшін жерге немесе арнайы қазықтарға бекітетін сыртқы арқандар. Қазақстан даласында желдер өте күшті болуы мүмкін, сондықтан жел бау өте маңызды элемент. Дәстүрлі түрде дөңгелек бойынша орналасқан 4-8 жел бау қолданылған. Көшпенділер ауа райына байланысты арқандарды тез тарту немесе босату мүмкіндік беретін арнайы түйіндерді білген.'
    },
    price_kzt: 95000,
    price_usd: 210,
    category: 'rope',
    photo: '/images/accessories/zhel-bau.jpg'
  },
  {
    id: 'shashak',
    name: {
      ru: 'Шашақ',
      en: 'Shashak',
      kk: 'Шашақ'
    },
    description: {
      ru: 'Декоративные кисти и подвески для шаңырақа',
      en: 'Decorative tassels and pendants for the shanyrak',
      kk: 'Шаңыраққа арналған сәндік шашақтар мен ілгіштер'
    },
    history: {
      ru: 'Шашақ — это декоративные кисти из цветных нитей, подвешиваемые к шаңырақу и уықам. Они не только украшают юрту, но и имеют защитное значение — считалось, что шашақи отгоняют злых духов и приносят удачу. Традиционно изготавливались из шерстяных нитей красного, белого, синего и жёлтого цветов. Каждый цвет имел своё значение в тенгрианской космологии кочевников.',
      en: 'Shashak are decorative tassels made from colored threads, hung from the shanyrak and uyks. They not only adorn the yurt but also have protective meaning — believed to ward off evil spirits and bring luck. Traditionally made from wool threads in red, white, blue, and yellow. Each color held meaning in nomadic Tengrian cosmology.',
      kk: 'Шашақ — шаңырақ пен уықтарға ілінетін түрлі-түсті жіптерден жасалған сәндік шашақтар. Олар киіз үйді безендіріп қана қоймай, қорғаныс мағынасына да ие — шашақтар жаман рухтарды қуып, бақыт әкеледі деп саналған. Дәстүрлі түрде қызыл, ақ, көк және сары түсті жүн жіптерден жасалған. Әрбір түстің көшпенділердің тәңіршілдік космологиясында өз мағынасы болған.'
    },
    price_kzt: 65000,
    price_usd: 145,
    category: 'decoration',
    photo: '/images/accessories/shashak.jpg'
  },
  {
    id: 'shanyrak-ashekeyi',
    name: {
      ru: 'Шаңырақ әшекейі',
      en: 'Shanyrak Ashekeyi',
      kk: 'Шаңырақ әшекейі'
    },
    description: {
      ru: 'Декоративное украшение для центра шаңырақа',
      en: 'Decorative ornament for the shanyrak center',
      kk: 'Шаңырақ орталығына арналған сәндік әшекей'
    },
    history: {
      ru: 'Шаңырақ әшекейі — это декоративный элемент, венчающий центр шаңырақа. Может быть выполнен в виде традиционных символов: тұмар (амулет), айшық (полумесяц со звездой) или стилизованного солнца. Этот элемент подчёркивает сакральность шаңырақа как связующего звена между землёй и небом. В богатых юртах әшекейі изготавливались из серебра или украшались драгоценными камнями.',
      en: 'Shanyrak Ashekeyi is a decorative element crowning the shanyrak\'s center. Can be crafted as traditional symbols: tumar (amulet), aishyk (crescent with star), or stylized sun. This element emphasizes the shanyrak\'s sacredness as a link between earth and sky. In wealthy yurts, ashekeyi were made from silver or adorned with precious stones.',
      kk: 'Шаңырақ әшекейі — шаңырақ орталығын әшекейлейтін сәндік элемент. Дәстүрлі белгілер түрінде жасалуы мүмкін: тұмар (тілсім), айшық (жұлдызы бар ай) немесе стильденген күн. Бұл элемент шаңырақтың жер мен аспан арасындағы байланыс ретіндегі қасиеттілігін атап көрсетеді. Бай киіз үйлерде әшекейлер күмістен жасалған немесе асыл тастармен безендірілген.'
    },
    price_kzt: 220000,
    price_usd: 490,
    category: 'decoration',
    photo: '/images/accessories/shanyrak-ashekeyi.jpg'
  },
  {
    id: 'chekhol',
    name: {
      ru: 'Чехол',
      en: 'Chekhol',
      kk: 'Чехол'
    },
    description: {
      ru: 'Защитный чехол для транспортировки и хранения',
      en: 'Protective cover for transportation and storage',
      kk: 'Тасымалдау және сақтауға арналған қорғаныш қаптама'
    },
    history: {
      ru: 'Чехол — современное дополнение к традиционной юрте, обеспечивающее защиту при транспортировке и длительном хранении. Изготавливается из прочного водонепроницаемого материала. Хотя кочевники не использовали чехлы (юрта всегда была в использовании), современная логистика требует защиты деликатных элементов — резного шаңырақа, расписных есіков и войлочных изделий — при международных перевозках.',
      en: 'Chekhol is a modern addition to the traditional yurt, providing protection during transportation and long-term storage. Made from durable waterproof material. While nomads didn\'t use covers (the yurt was always in use), modern logistics require protecting delicate elements — carved shanyrak, painted esiks, and felt items — during international shipping.',
      kk: 'Чехол — дәстүрлі киіз үйге заманауи қосымша, тасымалдау және ұзақ мерзімді сақтау кезінде қорғанысты қамтамасыз етеді. Берік су өткізбейтін материалдан жасалған. Көшпенділер чехолдарды қолданбаса да (киіз үй әрқашан пайдаланылды), заманауи логистика нәзік элементтерді — ойылған шаңырақты, боялған есіктерді және киіз бұйымдарды — халықаралық тасымалдау кезінде қорғауды талап етеді.'
    },
    price_kzt: 320000,
    price_usd: 710,
    category: 'cover',
    photo: '/images/accessories/chekhol.jpg'
  },
  {
    id: 'bas-bel-arkandar',
    name: {
      ru: 'Бас бел арқандар',
      en: 'Bas Bel Arkandar',
      kk: 'Бас бел арқандар'
    },
    description: {
      ru: 'Основные несущие верёвки для каркаса',
      en: 'Main load-bearing ropes for the frame',
      kk: 'Қаңқаға арналған негізгі жүк көтеретін арқандар'
    },
    history: {
      ru: 'Бас бел арқандар — это главные несущие верёвки, опоясывающие юрту по периметру и удерживающие кереге в натянутом состоянии. «Бас» означает «главный», «бел» — «пояс». Эти верёвки принимают на себя основную нагрузку от купола и ветра. Традиционно изготавливались из самых прочных материалов — скрученного конского волоса или кожаных ремней. От качества бас бел арқандар зависела долговечность всей юрты.',
      en: 'Bas Bel Arkandar are the main load-bearing ropes encircling the yurt\'s perimeter and keeping the kerege taut. "Bas" means "main," "bel" means "belt." These ropes bear the primary load from the dome and wind. Traditionally made from the strongest materials — twisted horsehair or leather straps. The quality of bas bel arkandar determined the yurt\'s longevity.',
      kk: 'Бас бел арқандар — киіз үйді периметр бойынша қоршап, кереге керілген күйде ұстайтын негізгі жүк көтеретін арқандар. «Бас» — «негізгі», «бел» — «белдік» дегенді білдіреді. Бұл арқандар күмбез бен желден негізгі жүктемені көтереді. Дәстүрлі түрде ең берік материалдардан — оралған жылқы жалынан немесе былғары белдіктерден жасалған. Бас бел арқандардың сапасы бүкіл киіз үйдің ұзақ мерзімділігін анықтады.'
    },
    price_kzt: 145000,
    price_usd: 320,
    category: 'rope',
    photo: '/images/accessories/bas-bel-arkandar.jpg'
  },
  {
    id: 'bakan',
    name: {
      ru: 'Бакан',
      en: 'Bakan',
      kk: 'Бақан'
    },
    description: {
      ru: 'Деревянные колья для крепления юрты к земле',
      en: 'Wooden stakes for anchoring the yurt to the ground',
      kk: 'Киіз үйді жерге бекітуге арналған ағаш қазықтар'
    },
    history: {
      ru: 'Бакан — это деревянные или металлические колья, которыми юрту крепят к земле. В степи, где дуют сильные ветры, бакан жизненно необходим для устойчивости жилища. Традиционно использовалось 12-20 баканов, вбиваемых по кругу вокруг юрты. К ним привязывали жел бау и бас бел арқандар. Искусство правильной установки бакана передавалось из поколения в поколение — от угла наклона зависела прочность всей конструкции.',
      en: 'Bakan are wooden or metal stakes anchoring the yurt to the ground. In the steppe where strong winds blow, bakan is vital for dwelling stability. Traditionally, 12-20 bakans were used, driven in a circle around the yurt. Zhel bau and bas bel arkandar were tied to them. The art of proper bakan installation was passed through generations — the angle of inclination determined the entire structure\'s strength.',
      kk: 'Бақан — киіз үйді жерге бекітетін ағаш немесе металл қазықтар. Күшті желдер соғатын далада бақан тұрғын үйдің тұрақтылығы үшін өте қажет. Дәстүрлі түрде киіз үйдің айналасына дөңгелек бойынша қағылатын 12-20 бақан қолданылған. Оларға жел бау мен бас бел арқандар байланған. Бақанды дұрыс орнату өнері ұрпақтан ұрпаққа берілді — еңкіш бұрышы бүкіл құрылымның берігін анықтады.'
    },
    price_kzt: 75000,
    price_usd: 165,
    category: 'structure',
    photo: '/images/accessories/bakan.jpg'
  },
  {
    id: 'shalma-bau',
    name: {
      ru: 'Шалма бау',
      en: 'Shalma Bau',
      kk: 'Шалма бау'
    },
    description: {
      ru: 'Верёвки для крепления войлочных покрытий',
      en: 'Ropes for securing felt coverings',
      kk: 'Киіз жабындарды бекітуге арналған арқандар'
    },
    history: {
      ru: 'Шалма бау — это верёвки, которыми привязывают войлочные покрытия (үзік и туырлық) к каркасу юрты. Название происходит от слова «шалу» — накрывать, обвязывать. Шалма бау оплетают юрту по спирали, создавая характерный узор и надёжно фиксируя войлок. В дождливую погоду эти верёвки можно подтянуть, в жаркую — ослабить для лучшей вентиляции. Техника плетения шалма бау — настоящее искусство.',
      en: 'Shalma Bau are ropes tying felt coverings (uzik and tuyrlyq) to the yurt frame. The name comes from "shalu" — to cover, to bind. Shalma bau spiral around the yurt, creating a characteristic pattern and securely fixing the felt. In rainy weather, these ropes can be tightened; in hot weather, loosened for better ventilation. The weaving technique of shalma bau is a true art.',
      kk: 'Шалма бау — киіз жабындарды (үзік және туырлық) киіз үй қаңқасына байлайтын арқандар. Аты «шалу» сөзінен шыққан — жабу, байлау. Шалма бау киіз үйді спираль бойынша ораып, ерекше өрнек жасайды және киізді сенімді бекітеді. Жаңбырлы ауа райында бұл арқандарды тартуға, ыстық кезде желдету үшін босатуға болады. Шалма бау өру техникасы — нағыз өнер.'
    },
    price_kzt: 105000,
    price_usd: 230,
    category: 'rope',
    photo: '/images/accessories/shalma-bau.jpg'
  }
];
