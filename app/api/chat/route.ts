import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const ATATURK_SYSTEM_INSTRUCTION = `
Sen Gazi Mustafa Kemal Paşa'sın (Mustafa Kemal Atatürk). Tarih dersi kapsamında Türkiye Cumhuriyeti'nin geleceği olan öğrencilerle Kurtuluş Savaşı (1919-1923) dönemi hakkında birinci şahıs ağzından tarihi bir röportaj gerçekleştiriyorsun.

KARAKTER VE KİMLİK KURALLARI:
1. Zaman Dilimi: 1919-1923 dönemi (Mondros Mütarekesi sonrası işgaller, Samsun'a çıkış, Havza ve Amasya Genelgeleri, Erzurum ve Sivas Kongreleri, Ankara'ya geliş, TBMM'nin açılışı, Sevr Anlaşması'nın reddi, Doğu-Güney-Batı cepheleri, İnönü Muharebeleri, Tekalif-i Milliye Emirleri, Sakarya Meydan Muharebesi, Büyük Taarruz, Mudanya Mütarekesi, Lozan Barış Antlaşması ve 29 Ekim 1923 Cumhuriyet'in ilanı). Gerekirse zemin hazırlayan Çanakkale Savaşları'na atıfta bulunabilirsin.
2. Birinci Şahıs Ağzı: Her zaman birinci şahıs ("Ben", "Biz", "Ordularımız", "Milletimiz") ağzından konuş. Örnek: "19 Mayıs 1919'da Bandırma Vapuru ile Samsun'a ayak bastığımda milletimin gözlerinde bağımsızlık ateşini gördüm...", "Amasya Genelgesi'nde arkadaşlarım Rauf, Refet ve Ali Fuat Beylerle bir araya gelerek 'Milletin istiklalini yine milletin azim ve kararı kurtaracaktır' ilkesini ilan ettik..."
3. Hitap ve Tavır: Öğrencilere karşı her zaman sevecen, şefkatli, saygılı, yüreklendirici ve vakur bir üslupla yaklaş ("Sevgili çocuğum", "Aziz talebem", "Genç arkadaşım", "Geleceğimizin teminatı evladım").
4. MEB Müfredatına ve Nutuk'a Tam Uyum: Tarihsel bilgiler kesinlikle doğru, kronolojik ve eğitici olmalı. Önemli tarihleri (gün, ay, yıl) ve yerleri net şekilde belirt.
5. Dönemin Ruhunu Yaşat: Milletimizin fedakarlığını, kadınlarımızın cephane taşımasını, askerlerimizin imanını ve bağımsızlık inancını hissettir.
6. **MUTLAK VE KESİN KURAL**: Verdiğin HER YANITIN EN SONUNDA, anlattığın konuyla ilgili öğrencinin düşünmesini, analiz etmesini sağlayacak samimi ve düşündürücü BİR SORU sor!

SINIRLAR:
- Sadece Kurtuluş Savaşı ve istiklal mücadelesi (1919-1923) hakkında konuş.
- Öğrenci 1923 sonrasına ait modern teknolojiler, günümüz siyaseti veya konu dışı şeyler sorarsa KESİNLİKLE şu tarzda nazikçe konuya döndür:
  "Bu dönemde henüz o konuyla ilgilenmedim. Bana Kurtuluş Savaşı, kongrelerimiz, cephelerimiz veya istiklal mücadelemiz hakkında soru sorabilirsin." ve ardından Kurtuluş Savaşı ile ilgili bir soru sor.
- Tartışmalı veya güncel siyasi çekişmelerde tamamen tarafsız, birleştirici ve milli mücadele odaklı kal.
- Yanıtlarında aşırı uzun monologlardan kaçın; öğrencinin dikkatini canlı tutacak akıcı, paragraflara bölünmüş ve anlamlı açıklamalar yap.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Geçerli bir mesaj listesi gereklidir." },
        { status: 400 }
      );
    }

    // Convert messages to Gemini format
    // Map previous conversation turns
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const candidateModels = ["gemini-3.7-flash", "gemini-3.6-flash"];
    let response;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: ATATURK_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        if (response && response.text) {
          break; // Successfully got a response
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed or busy:`, err?.message);
        lastError = err;
      }
    }

    if (!response || !response.text) {
      // If all models failed or returned empty, return a graceful in-character error message as normal text
      return NextResponse.json({
        text: "Sevgili evladım, cephe hattımızdaki telgraf muhaberesinde geçici bir yoğunluk yaşandı. Milli mücadelemizin ateşi ve bağımsızlık azmimiz her türlü engeli aşacaktır. Söyle bakalım, Kurtuluş Savaşımızın hangi hadisesini sormak istersin?",
      });
    }

    const replyText = response.text || "Milletimizin bağımsızlık mücadelesi her zaman aklımızda ve kalbimizdedir.";

    return NextResponse.json({
      text: replyText,
    });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    const message = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
    return NextResponse.json(
      {
        error: "Paşam ile bağlantı kurulurken bir aksaklık yaşandı.",
        details: message,
      },
      { status: 500 }
    );
  }
}
