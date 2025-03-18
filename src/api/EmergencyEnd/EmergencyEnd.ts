
import { EmergencyEndRequest } from "../../interface/IAccount"
import { axiosCreate } from "../AxiosCRUD"
import { baseUrl,headers } from "../Url"


const emergencytUrl = baseUrl + "/EmergencyEnd/"


export const createEmergencyEnd = async(data:EmergencyEndRequest)=> {
    const props = {
        data: data,
        url: emergencytUrl,
        headers: headers
    }
    const result = await axiosCreate(props)
    if(result.success) {
        console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
}
    
