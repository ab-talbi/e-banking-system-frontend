import axios from "axios";

const OFFRES_REST_API_URL = 'http://localhost:8089/api/offres'

class OffreService{
    getOffres(){
        axios.get(OFFRES_REST_API_URL);
    }
}

export default new OffreService()