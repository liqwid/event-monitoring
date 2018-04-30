import axios from "axios";

const baseURL = <string>process.env.EVENTS_SERVICE_URL;
const headers = { "Content-type": "application/json" };

export default axios.create({ baseURL, headers });
