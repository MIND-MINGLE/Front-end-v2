import { baseUrl,headers } from "../Url"
import { axiosRead, } from "../AxiosCRUD"


const theraUrl = baseUrl + "/Therapist/"


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