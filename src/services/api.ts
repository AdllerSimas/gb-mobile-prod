import axios from 'axios'

const api = axios.create({
    baseURL: "https://backendgobarber.relldaxydev.com"
})

export default api;