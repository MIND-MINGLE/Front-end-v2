
import { AppointmentRequest } from "../../interface/IAccount"
import { axiosCreate, axiosRead } from "../AxiosCRUD"
import { baseUrl,headers } from "../Url"


const appointmenttUrl = baseUrl + "/Appointment"


export const RegisterAppointment = async(data:AppointmentRequest)=> {
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
    export const getAppointmentByPatientId = async(data:string)=> {
        const props = {
            data: null,
            url: appointmenttUrl+"/patient/"+data,
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
export const getAppointmentByTherapistId = async(data:string)=> {
    const props = {
        data: null,
        url: appointmenttUrl+"/therapist/"+data,
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
export const getCurrentAppointment = async(therapistId:string,patientId:string)=> {
    const props = {
        data: null,
        url: appointmenttUrl+"/"+therapistId+"/"+patientId,
        headers: headers
    }
    console.log(appointmenttUrl+"/"+therapistId+"/"+patientId)
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