import { baseUrl,headers } from "../Url"
import { axiosCreate, axiosRead, } from "../AxiosCRUD"
import { TherapistCreateProps } from "../../interface/IAccount"


const theraUrl = baseUrl + "/Therapist"


export const getTherapist = async(accountId:string)=> {
    const props = {
        data: null,
        url: theraUrl+"/"+accountId,
        headers: headers
    }
    const result = await axiosRead(props)
    if(result.success) {
        console.log(result.data)
        return result.data.result
    }
    else{
        console.log(result.error)
        return null
    }
}


export const AddTherapist = async(data:TherapistCreateProps)=> {
    const props = {
        data: data,
        url: theraUrl+"/addtherapist",
        headers: headers
    }
    const result = await axiosCreate(props)
    if(result.success) {
        console.log(result.data)
        return result.data.result
    }
    else{
        console.log(result.error)
        return null
    }
}

