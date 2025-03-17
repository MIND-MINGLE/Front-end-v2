
import { baseUrl,headers } from "../Url"
import { axiosRead } from "../AxiosCRUD"


const therapistUrl = baseUrl + "/Therapist"


export const getAllTherapist = async()=> {
    const props = {
        data: null,
        url: therapistUrl+"/getall",
        headers: headers
    }
    const result = await axiosRead(props)
    if(result.success) {
        console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
    
    
}
export const getTherapistById = async(accountId:string)=> {
    const props = {
        data: null,
        url: therapistUrl+"/"+accountId,
        headers: headers
    }
    const result = await axiosRead(props)
    if(result.success) {
        console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
}