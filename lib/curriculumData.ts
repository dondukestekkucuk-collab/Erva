export interface Milestone {
  id: string;
  date: string;
  title: string;
  category: 'hazirlik' | 'meclis' | 'cepheler' | 'zafer';
  shortDesc: string;
  suggestedPrompt: string;
}

export const MILESTONES: Milestone[] = [
  {
    id: 'samsun',
    date: '19 Mayıs 1919',
    title: "Samsun'a Çıkış",
    category: 'hazirlik',
    shortDesc: 'Bandırma Vapuru ile Samsun’a varış ve Milli Mücadele meşalesinin yakılması.',
    suggestedPrompt: "Paşam, 19 Mayıs 1919'da Samsun'a çıktığınızda gördüğünüz ilk manzarayı ve o anki duygularınızı anlatır mısınız?",
  },
  {
    id: 'amasya',
    date: '22 Haziran 1919',
    title: 'Amasya Genelgesi',
    category: 'hazirlik',
    shortDesc: '"Milletin istiklalini yine milletin azim ve kararı kurtaracaktır" ilkesinin ilanı.',
    suggestedPrompt: "Amasya Genelgesi'nde aldığınız tarihi kararlar nelerdi ve bu genelge neden bir ihtilal bildirisi niteliğindedir?",
  },
  {
    id: 'erzurum',
    date: '23 Temmuz 1919',
    title: 'Erzurum Kongresi',
    category: 'hazirlik',
    shortDesc: '"Milli sınırlar içinde vatan bir bütündür, bölünemez" ilkesi ve manda reddi.',
    suggestedPrompt: "Erzurum Kongresi'nde manda ve himayeyi neden kesin bir dille reddettiniz?",
  },
  {
    id: 'sivas',
    date: '4 Eylül 1919',
    title: 'Sivas Kongresi',
    category: 'hazirlik',
    shortDesc: 'Tüm cemiyetlerin Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti altında birleşmesi.',
    suggestedPrompt: "Sivas Kongresi'nde tüm cemiyetleri tek çatı altında toplarken ne gibi engellerle karşılaştınız?",
  },
  {
    id: 'tbmm',
    date: '23 Nisan 1920',
    title: "TBMM'nin Açılışı",
    category: 'meclis',
    shortDesc: 'Ankara’da Büyük Millet Meclisi’nin açılışı ve milli egemenliğin tecellisi.',
    suggestedPrompt: "23 Nisan 1920'de Ankara'da TBMM'yi açtığınız günkü atmosfer ve meclisin ilk kararları nasıldı?",
  },
  {
    id: 'sevr',
    date: '10 Ağustos 1920',
    title: "Sevr Antlaşması'nın Reddi",
    category: 'meclis',
    shortDesc: 'Milleti esarete mahkûm eden ölüm fermanının TBMM tarafından tanınmaması.',
    suggestedPrompt: "Sevr Antlaşması'nı Türk milleti ve TBMM adına neden derhal yırtıp attınız?",
  },
  {
    id: 'inonu',
    date: 'Ocak - Nisan 1921',
    title: 'İnönü Muharebeleri',
    category: 'cepheler',
    shortDesc: 'Düzenli ordunun ilk zaferleri ve milletin makûs talihinin yenilmesi.',
    suggestedPrompt: "İnönü Savaşları sırasında İsmet Paşa'ya çektiğiniz 'Siz orada sadece düşmanı değil, milletin makûs talihini de yendiniz' telgrafının hikâyesini anlatır mısınız?",
  },
  {
    id: 'tekalif',
    date: '7-8 Ağustos 1921',
    title: 'Tekalif-i Milliye Emirleri',
    category: 'cepheler',
    shortDesc: 'Ordunun ihtiyaçlarını karşılamak üzere topyekûn seferberlik çağrısı.',
    suggestedPrompt: "Tekalif-i Milliye Emirleri'ni yayınlarken halkımızın gösterdiği fedakarlıklar nelerdi?",
  },
  {
    id: 'sakarya',
    date: '23 Ağustos - 13 Eylül 1921',
    title: 'Sakarya Meydan Muharebesi',
    category: 'cepheler',
    shortDesc: '"Hattı müdafaa yoktur, sathı müdafaa vardır. O satıh bütün vatandır!"',
    suggestedPrompt: "Sakarya Meydan Muharebesi'nde 'Hattı müdafaa yoktur, sathı müdafaa vardır' sözünüzün taktiksel anlamı neydi?",
  },
  {
    id: 'buyuk-taarruz',
    date: '26-30 Ağustos 1922',
    title: 'Büyük Taarruz ve Başkomutanlık',
    category: 'zafer',
    shortDesc: '"Ordular! İlk hedefiniz Akdeniz\'dir, ileri!" emri ve Dumlupınar zaferi.',
    suggestedPrompt: "26 Ağustos sabahı Kocatepe'deki o büyük taarruz anını ve 'Ordular! İlk hedefiniz Akdeniz\'dir, ileri!' emrinizi nasıl verdiniz?",
  },
  {
    id: 'mudanya',
    date: '11 Ekim 1922',
    title: 'Mudanya Ateşkes Antlaşması',
    category: 'zafer',
    shortDesc: 'Askeri zaferin diplomatik masada tescillenmesi ve İstanbul ile Boğazların kurtarılması.',
    suggestedPrompt: "Mudanya Ateşkesi ile Doğu Trakya ve İstanbul'u tek kurşun atmadan nasıl geri aldık?",
  },
  {
    id: 'lozan',
    date: '24 Temmuz 1923',
    title: 'Lozan Barış Antlaşması',
    category: 'zafer',
    shortDesc: 'Bağımsız Türk Devleti’nin tüm dünya tarafından resmen tanınması ve tapu senedi.',
    suggestedPrompt: "İsmet Paşa Lozan'a giderken ona verdiğiniz en kesin talimat neydi ve bağımsızlığımızı nasıl kabul ettirdik?",
  },
  {
    id: 'cumhuriyet',
    date: '29 Ekim 1923',
    title: "Cumhuriyet'in İlanı",
    category: 'zafer',
    shortDesc: '"Egemenlik kayıtsız şartsız milletindir." sözünün taçlandırılması.',
    suggestedPrompt: "28 Ekim akşamı Çankaya'da 'Efendiler! Yarın Cumhuriyet'i ilan edeceğiz' dediğiniz o tarihi geceyi anlatır mısınız?",
  },
];

export const TOPIC_CATEGORIES = [
  { id: 'all', label: 'Tüm Konular' },
  { id: 'hazirlik', label: '1. Hazırlık ve Kongreler (1919)' },
  { id: 'meclis', label: '2. TBMM ve Teşkilatlanma (1920)' },
  { id: 'cepheler', label: '3. Cepheler ve Savaşlar (1921-1922)' },
  { id: 'zafer', label: '4. Büyük Zafer ve Lozan (1922-1923)' },
];

export const INITIAL_SUGGESTIONS = [
  "Paşam, Samsun'a çıkarken vatanın genel durumu nasıldı?",
  "Amasya Genelgesi'nde milletin kararına neden vurgu yaptınız?",
  "Tekalif-i Milliye Emirleri ile milletimiz orduya nasıl destek oldu?",
  "Sakarya Meydan Muharebesi'ndeki savunma stratejiniz neydi?",
  "Büyük Taarruz'da Kocatepe'deki o tarihi anı anlatır mısınız?",
  "Gençlere Kurtuluş Savaşı'ndan çıkarılacak en büyük ders nedir?",
];

export const ATATURK_INITIAL_MESSAGE = `Sevgili evladım, kıymetli genç arkadaşım,

Ben Mustafa Kemal. 1919 yılının o karanlık günlerinde, milletimizin bağımsızlığı tehlikeye düştüğünde, "Ya istiklal ya ölüm!" diyerek milletimizle omuz omuza bir milli mücadele başlattık.

Tarih dersiniz kapsamında, o çetin günleri, Erzurum ve Sivas Kongrelerimizi, Ankara'da açtığımız Meclisimizi, Sakarya ve Dumlupınar'daki şanlı mücadelemizi konuşmak üzere seninle bir araya gelmekten büyük bir bahtiyarlık duyuyorum.

Söyle bakalım aziz gencim, Kurtuluş Savaşımızın hangi dönemi veya hangi tarihi hadisesi hakkında konuşmak, bana ne sormak istersin?`;
