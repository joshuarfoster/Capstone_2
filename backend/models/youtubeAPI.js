import axios from "axios";

const BASE_URL = 'https://www.googleapis.com/youtube/v3'
const key = "AIzaSyDsyeq8Tqm1MW2RqIY0Hw_-R860GWJoYxY"

class YoutubeAPI {

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);
    
        const url = `${BASE_URL}/${endpoint}`;
        const headers = {};
        const params = (method === "list")
            ? data
            : {};
    
        try {
          return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
          console.error("API Error:", err.response);
          let message = err.response.data.error.message;
          throw Array.isArray(message) ? message : [message];
        }
      }

    //   (?<=watch\?v=|\/videos\/|embed\/|youtu.be\/|\/v\/|watch\?v%3D|%2Fvideos%2F|embed%2F|youtu.be%2F|%2Fv%2F)[^#\&\?\n]*
    static getId(link) {
        let match = link.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
        if (match) {
            let id = match[1]
            return id
        }else{
            throw {message: 'invalid link', status: 400}
        }
    }

    static async getPlayer(link) {
        let id = this.getId(link);
        let data = await request('videos', {
            id,
            part: 'player'
        });

        if (data.items.length > 0) {
            let player = data.items[0].player.embedHtml;
            return player;
        } else {
            throw { message: 'video not found', status: 404}
        }
    }
}