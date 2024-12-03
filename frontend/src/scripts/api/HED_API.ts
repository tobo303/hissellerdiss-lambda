import axios from "axios";
import {HED_API_BASE_URL} from "../config/api";
import { HEDAxiosResponse } from "../../types/response/AxiosResponse";

export async function hed_getEntries<T>() {
    const response = await axios.get<HEDAxiosResponse>(`${HED_API_BASE_URL}/hed_api/getItems`);

    console.log(response);
    console.log("RDATA:", response.data);

    switch (response.status) {
        case 200:
            switch (response.data.message.statusCode) {
                case 200:
                    const payload = await JSON.parse(response.data.message.body) as T;
                    console.log("PAYLOAD:", payload);
                    return payload;
                default:
                    console.error('StatusCode', response.data);
                    throw new Error('Error fetching entries');
            }
        default:
            console.error('StatusCode', response.data);
            throw new Error('Error fetching entries');
    }
}