import axions from "axios"

const API_URL = import.meta.env.VITE_API_URL


const API = axions.create({
    baseURL:`${API_URL}/api/v1`
})

console.log(API_URL)

export default API