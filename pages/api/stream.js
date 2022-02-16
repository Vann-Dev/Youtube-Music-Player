import axios from "axios";

export default async function search(req, res) {
    if (!req.query.id) return [];
    const { data } = await axios.get("https://invidious.snopyta.org/api/v1/videos/" + req.query.id, { headers: { "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 6.2) AppleWebKit/532.12.2 (KHTML, like Gecko) Version/4.0 Safari/532.12.2" }});
    return res.send(data.adaptiveFormats.filter(x => x.type.startsWith("audio"))[1].url ? data.adaptiveFormats.filter(x => x.type.startsWith("audio"))[1].url : "https://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&client=tw-ob&tl=id&q=could+not+find+stream&textlen=5")
}
