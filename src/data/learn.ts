export type Lang = 'en' | 'hi'

export interface SourceDef {
  id: string
  label: string
  url: string
}

export interface LearnSection {
  id: string
  title: Record<Lang, string>
  blocks: Record<Lang, string[][]> // each block is a paragraph or bullet list
  sources: string[]
}

export const LEARN_SOURCES: SourceDef[] = [
  {
    id: 'who',
    label: 'World Health Organization, Breast cancer fact sheet (3 July 2026)',
    url: 'https://www.who.int/news-room/fact-sheets/detail/breast-cancer',
  },
  {
    id: 'cdc',
    label: 'CDC, Symptoms of Breast Cancer (reviewed 22 Sept 2026)',
    url: 'https://www.cdc.gov/breast-cancer/symptoms/index.html',
  },
  {
    id: 'bcrf',
    label: 'Breast Cancer Research Foundation, 10 Ways to Help Prevent Breast Cancer',
    url: 'https://www.bcrf.org/about-breast-cancer/breast-cancer-prevention-risk-reduction/',
  },
  {
    id: 'icmr',
    label: 'ICMR, Breast cancer guidelines',
    url: 'https://www.icmr.gov.in/icmrobject/custom_data/pdf/resource-guidelines/Breast_Cancer.pdf',
  },
  {
    id: 'mohfw',
    label: 'Ministry of Health and Family Welfare (NPCDCS), clinical breast examination guidance',
    url: 'https://www.mohfw-dohfw.gov.in/static/uploads/2025/11/f9634bbf41f5865f4ec153409ddeca6e.pdf',
  },
]

// Hindi: needs native and medical review
export const LEARN_SECTIONS: LearnSection[] = [
  {
    id: 'about-breast-cancer',
    title: {
      en: 'About breast cancer',
      hi: 'स्तन कैंसर के बारे में',
    },
    blocks: {
      en: [
        [
          'It starts when cells in the breast grow in an abnormal way and form a lump called a tumour.',
          'It usually begins in the milk tubes (ducts) or the parts that make milk (lobules).',
          'If it is not treated, it can spread to nearby lymph nodes and other parts of the body.',
          'It can happen to a woman at any age after puberty, and the risk rises with age. Men can get it too, but this is rare.',
        ],
      ],
      hi: [
        [
          'यह तब शुरू होता है जब स्तन की कोशिकाएं असामान्य तरीके से बढ़कर एक गांठ बनाती हैं जिसे ट्यूमर कहते हैं।',
          'यह आमतौर पर दूध की नलिकाओं (डक्ट्स) या उन हिस्सों से शुरू होता है जो दूध बनाते हैं (लोब्यूल्स)।',
          'अगर इसका इलाज न किया जाए तो यह आस-पास के लिम्फ नोड्स और शरीर के दूसरे हिस्सों में फैल सकता है।',
          'यह प्यूबरटी के बाद किसी भी उम्र में हो सकता है, और उम्र बढ़ने के साथ खतरा बढ़ता है। मर्दों को भी हो सकता है, पर यह दुर्लभ है।',
        ],
      ],
    },
    sources: ['who'],
  },
  {
    id: 'why-early-detection-matters',
    title: {
      en: 'Why early detection matters',
      hi: 'जल्दी पता लगाना क्यों जरूरी है',
    },
    blocks: {
      en: [
        [
          'Breast cancer is more likely to be treated well when it is found early and is still small.',
          'Early detection has two parts: knowing the warning signs and seeing a doctor quickly, and screening tests for women who have no symptoms.',
          'Treatment works best when it is started early and finished fully.',
        ],
      ],
      hi: [
        [
          'अगर स्तन कैंसर का पता जल्दी चल जाए और वह छोटा हो, तो इसका इलाज अच्छे से हो सकता है।',
          'जल्दी पता लगाने के दो हिस्से हैं: चेतावनी संकेतों को जानना और जल्दी डॉक्टर से मिलना, और उन औरतों के लिए स्क्रीनिंग जांच जिनमें कोई लक्षण नहीं हैं।',
          'इलाज तब सबसे अच्छा काम करता है जब इसे जल्दी शुरू किया जाए और पूरा किया जाए।',
        ],
      ],
    },
    sources: ['who'],
  },
  {
    id: 'normal-breasts',
    title: {
      en: 'Normal breasts',
      hi: 'सामान्य स्तन',
    },
    blocks: {
      en: [
        [
          'No two breasts are the same. What is normal for you can be different for another woman.',
          'Many women have breasts that feel lumpy or uneven.',
          'Periods, pregnancy, weight changes, some medicines, and getting older can change how breasts look and feel.',
          'Knowing your own normal helps you notice when something changes.',
        ],
      ],
      hi: [
        [
          'कोई भी दो स्तन एक जैसे नहीं होते हैं। आपके लिए जो सामान्य है वह दूसरी औरत के लिए अलग हो सकता है।',
          'कई औरतों के स्तन ऐसे महसूस होते हैं जिनमें गांठें हों या असमान हों।',
          'पीरियड्स, गर्भावस्था, वजन में बदलाव, कुछ दवाइयां और उम्र बढ़ने से स्तन दिखने और महसूस होने में बदलाव आ सकते हैं।',
          'अपने सामान्य को जानने से आपको पता चलता है कि कब कुछ बदल गया है।',
        ],
      ],
    },
    sources: ['cdc'],
  },
  {
    id: 'warning-signs',
    title: {
      en: 'Warning signs',
      hi: 'चेतावनी संकेत',
    },
    blocks: {
      en: [
        [
          'A new lump in the breast or the armpit',
          'Thickening or swelling in part of the breast',
          'Dimpling, irritation, redness, or flaky skin on the breast or nipple area',
          'Nipple pulling inward, or pain in the nipple area',
          'Fluid from the nipple that is not breast milk, especially if it has blood',
          'Any change in the size or shape of the breast',
          'Pain in any part of the breast',
          'A lump can be painless, so do not wait for pain.',
          'These signs can also come from problems that are not cancer, but a doctor should check them.',
        ],
      ],
      hi: [
        [
          'स्तन या बगल में नई गांठ',
          'स्तन के किसी हिस्से में मोटापन या सूजन',
          'स्तन या निप्पल के आसपास की त्वचा पर गड्ढे, जलन, लालिमा या परतदार होना',
          'निप्पल का अंदर की ओर खिंचना या निप्पल वाले हिस्से में दर्द',
          'निप्पल से दूध के अलावा कोई द्रव निकलना, खासकर अगर उसमें खून हो',
          'स्तन के आकार या बनावट में कोई बदलाव',
          'स्तन के किसी भी हिस्से में दर्द',
          'गांठ दर्दहीन हो सकती है, इसलिए दर्द का इंतजार न करें।',
          'ये संकेत उन समस्याओं से भी हो सकते हैं जो कैंसर नहीं हैं, पर डॉक्टर को जांच करनी चाहिए।',
        ],
      ],
    },
    sources: ['who', 'cdc'],
  },
  {
    id: 'lumps-not-cancer',
    title: {
      en: 'Lumps that are not cancer',
      hi: 'गांठें जो कैंसर नहीं हैं',
    },
    blocks: {
      en: [
        [
          'Two common non-cancer causes are fibrocystic changes (breasts that feel lumpy, tender, or sore) and cysts (small sacs filled with fluid).',
          'Even so, every new lump needs to be checked, because only a doctor\'s tests can tell what it is.',
        ],
      ],
      hi: [
        [
          'दो आम गैर-कैंसर कारण हैं: फाइब्रोसिस्टिक बदलाव (स्तन जो गांठदार, कोमल या दर्दनाक महसूस होते हैं) और सिस्ट (छोटे थैले जो द्रव से भरे होते हैं)।',
          'फिर भी, हर नई गांठ की जांच होनी चाहिए, क्योंकि केवल डॉक्टर की जांच बता सकती है कि यह क्या है।',
        ],
      ],
    },
    sources: ['cdc', 'who'],
  },
  {
    id: 'screening-and-tests',
    title: {
      en: 'Screening and tests',
      hi: 'स्क्रीनिंग और जांचें',
    },
    blocks: {
      en: [
        [
          'Breast self-awareness: know how your breasts normally look and feel, and report changes. It does not replace a check by a doctor. ICMR notes that self-exam has not been shown to lower deaths from breast cancer.',
          'Clinical breast exam: a trained doctor, nurse, or health worker checks your breasts. India\'s national programme offers it to women aged 30 and above, about once every 5 years for ages 30 to 65.',
          'Ultrasound, mammogram, biopsy: these are done at a hospital or centre when a doctor advises, to look into a symptom, a high risk, or an abnormal finding.',
          'ICMR does not recommend mammograms for every woman in India. They are used for women at higher risk or with concerns. WHO says mammogram screening programmes usually target women aged 50 to 69.',
          'If you have symptoms or a high-risk history, do not wait for a routine screening time. See a doctor.',
        ],
      ],
      hi: [
        [
          'स्तन आत्म-जागरूकता: जानें कि आपके स्तन सामान्य रूप से कैसे दिखते और महसूस होते हैं, और बदलाव की सूचना दें। यह डॉक्टर की जांच को नहीं बदलता। ICMR का कहना है कि स्वयं-जांच से स्तन कैंसर से होने वाली मौतें कम होने का प्रमाण नहीं है।',
          'क्लिनिकल स्तन जांच: एक प्रशिक्षित डॉक्टर, नर्स या स्वास्थ्य कार्यकर्ता आपके स्तनों की जांच करता है। भारत का राष्ट्रीय कार्यक्रम 30 वर्ष और उससे अधिक उम्र की औरतों को यह जांच देता है, लगभग हर 5 साल में 30 से 65 वर्ष की उम्र के लिए।',
          'अल्ट्रासाउंड, मैमोग्राम, बायोप्सी: ये अस्पताल या केंद्र में किए जाते हैं जब डॉक्टर सलाह देता है, लक्षण, उच्च जोखिम या असामान्य नतीजे की जांच के लिए।',
          'ICMR भारत में हर औरत के लिए मैमोग्राम की सलाह नहीं देता। ये उच्च जोखिम वाली या चिंता वाली औरतों के लिए हैं। WHO कहता है कि मैमोग्राम स्क्रीनिंग कार्यक्रम आमतौर पर 50 से 69 वर्ष की औरतों को लक्ष्य करते हैं।',
          'अगर आपके लक्षण हैं या उच्च जोखिम का इतिहास है, तो रूटीन स्क्रीनिंग का इंतजार न करें। डॉक्टर से मिलें।',
        ],
      ],
    },
    sources: ['mohfw', 'icmr', 'who'],
  },
  {
    id: 'risk-factors',
    title: {
      en: 'Risk factors',
      hi: 'जोखिम कारक',
    },
    blocks: {
      en: [
        [
          'Getting older',
          'A family history of breast cancer (relatives on your father\'s side matter too)',
          'Certain inherited genes, such as BRCA1, BRCA2, and PALB2',
          'Past radiation to the chest',
          'Starting periods early, late menopause, or having a first pregnancy late in life',
          'Extra weight after menopause, alcohol, smoking, and hormone therapy after menopause',
          'Most women with breast cancer have no known family history, and about 80 in 100 have no risk factor other than being a woman and getting older. So every woman should stay aware.',
          'Having a risk factor does not mean you will get breast cancer.',
        ],
      ],
      hi: [
        [
          'उम्र बढ़ना',
          'स्तन कैंसर का पारिवारिक इतिहास (पिताजी की तरफ के रिश्तेदार भी मायने रखते हैं)',
          'कुछ विरासत में मिले जीन, जैसे BRCA1, BRCA2, और PALB2',
          'अतीत में छाती पर रेडिएशन',
          'पीरियड्स जल्दी शुरू होना, देर से रजोनिवृत्ति, या पहला गर्भावस्था जीवन में देर से होना',
          'रजोनिवृत्ति के बाद अतिरिक्त वजन, शराब, धूम्रपान, और रजोनिवृत्ति के बाद हार्मोन थेरेपी',
          'स्तन कैंसर वाली अधिकांश औरतों का कोई ज्ञात पारिवारिक इतिहास नहीं होता है, और लगभग 100 में से 80 के पास कोई जोखिम कारक नहीं होता है सिवाय एक औरत होने और बूढ़ा होने के। इसलिए हर औरत को जागरूक रहना चाहिए।',
          'जोखिम कारक होने का मतलब यह नहीं है कि आपको स्तन कैंसर हो जाएगा।',
        ],
      ],
    },
    sources: ['who', 'bcrf'],
  },
  {
    id: 'ways-to-lower-risk',
    title: {
      en: 'Ways to lower risk',
      hi: 'जोखिम कम करने के तरीके',
    },
    blocks: {
      en: [
        [
          'Keep a healthy weight and stay active. BCRF suggests aiming for about 30 minutes of movement a day.',
          'Limit alcohol, or avoid it. Do not smoke.',
          'Eat more vegetables, fruits, and whole grains, and less red and processed meat.',
          'Breastfeeding may give a small protection.',
          'Talk to your doctor about hormone pills or hormone therapy.',
          'No habit can promise protection. Some women who do everything right still get breast cancer, so keep up with checks.',
        ],
      ],
      hi: [
        [
          'स्वस्थ वजन रखें और सक्रिय रहें। BCRF दिन में लगभग 30 मिनट हलचल करने का सुझाव देता है।',
          'शराब सीमित करें या इससे बचें। धूम्रपान न करें।',
          'अधिक सब्जियां, फल और साबुत अनाज खाएं, और लाल और प्रसंस्कृत मांस कम खाएं।',
          'स्तनपान से थोड़ा बचाव मिल सकता है।',
          'हार्मोन गोलियां या हार्मोन थेरेपी के बारे में अपने डॉक्टर से बात करें।',
          'कोई आदत सुरक्षा का वादा नहीं कर सकती। कुछ औरतें जो सब कुछ सही करती हैं, फिर भी स्तन कैंसर हो जाता है, इसलिए जांच जारी रखें।',
        ],
      ],
    },
    sources: ['bcrf'],
  },
  {
    id: 'when-to-see-a-doctor',
    title: {
      en: 'When to see a doctor',
      hi: 'डॉक्टर कब दिखाएं',
    },
    blocks: {
      en: [
        [
          'New lump, skin change, nipple change, or bloody discharge: see a doctor within a few days.',
          'Red, hot, swollen breast with fever: get care today.',
          'Pain that stays in one spot: get it checked.',
          'Do not wait for pain, and do not wait because you think you are too young. Breast cancer can happen at younger ages too.',
          'A lump that is found early is easier to treat.',
        ],
      ],
      hi: [
        [
          'नई गांठ, त्वचा में बदलाव, निप्पल में बदलाव, या खूनी स्राव: कुछ दिनों के भीतर डॉक्टर दिखाएं।',
          'लाल, गर्म, सूजी हुई छाती के साथ बुखार: आज ही देखभाल लें।',
          'एक ही जगह पर दर्द बने रहना: इसे जांच कराएं।',
          'दर्द का इंतजार न करें, और यह सोचकर इंतजार न करें कि आप बहुत छोटे हैं। स्तन कैंसर छोटी उम्र में भी हो सकता है।',
          'जल्दी मिली गांठ का इलाज आसान होता है।',
        ],
      ],
    },
    sources: ['who', 'cdc'],
  },
]
