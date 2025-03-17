import { SeekerCreateProps } from "../../interface/IAccount"
import { axiosCreate, axiosRead } from "../AxiosCRUD"
import { baseUrl,headers } from "../Url"


const patientUrl = baseUrl + "/Patient"


export const RegisterPatientAccount = async(data:SeekerCreateProps)=> {
    const props = {
        data: data,
        url: patientUrl+"/create",
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

export const getPatientByAccountId = async(accountId:string)=> {
    const props = {
        data: null,
        url: patientUrl+"/patient/"+accountId,
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