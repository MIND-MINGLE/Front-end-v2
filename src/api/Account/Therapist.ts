import { baseUrl,headers } from "../Url"
import { axiosGetTherapistByAccountId, } from "../AxiosCRUD"


const theraUrl = baseUrl + "/Therapist/"


export const getTherapist = async(accountId:string)=> {
    const props = {
        data: accountId,
        url: theraUrl,
        headers: headers
    }
    const result = await axiosGetTherapistByAccountId(props)
    if(result.success) {
        console.log(result.data)
        return result.data.result
    }
    else{
        console.log(result.error)
        return null
    }
}