// const axios = require('axios').default;

// const api = new Axios()
const URL_BASE = 'https://8081-dot-10893737-dot-devshell.appspot.com/'
class Api {
  async getData(URL) {
    const response = await axios.get(URL_BASE.concat(URL), {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin':'https://corona.lmao.ninja/'
      }
    });
    const data = await response.data;
    return data;
  }
  async getCasesByCountry() {
    const data = await this.getData(
      "/countries"
    );
    return data;
  }
  async getTotalCases() {
    const data = await this.getData(
      "/all"
    );
    return data;
  }
}
export default Api;
