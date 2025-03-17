
import { Appointment } from "../../interface/IAccount"
import { axiosCreate } from "../AxiosCRUD"
import { baseUrl,headers } from "../Url"


const appointmenttUrl = baseUrl + "/Appointment"


export const RegisterAppointment = async(data:Appointment)=> {
    const props = {
        data: data,
        url: appointmenttUrl,
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