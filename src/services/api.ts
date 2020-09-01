import axios from 'axios'

const api = axios.create({
    baseURL: 'https://backendgobarber.relldaxydev.com:3333'
})

export default api;