import { SeekerCreateProps } from "../../interface/IAccount"
import { axiosRegisterAccount } from "../AxiosCRUD"
import { baseUrl,headers } from "../Url"


const patientUrl = baseUrl + "/Patient/create"


export const RegisterPatientAccount = async(data:SeekerCreateProps)=> {
    const props = {
        data: data,
        url: patientUrl,
        headers: headers
    }
    const result = await axiosRegisterAccount(props)
    if(result.success) {
        console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
    
}