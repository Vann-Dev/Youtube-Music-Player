import { Client } from "youtubei";

export default async function search(req, res) {
    if (!req.query.q) return [];
    const youtubeiClient = new Client();
    const searchResponse = await youtubeiClient.search(req.query.q, { type: "video"});
    return res.send(searchResponse.map(x => ({ ...x })))
}