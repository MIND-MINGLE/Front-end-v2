
import { AppointmentRequest } from "../../interface/IAccount"
import { axiosCreate, axiosPatch, axiosRead } from "../AxiosCRUD"
import { baseUrl,headers } from "../Url"


const appointmenttUrl = baseUrl + "/Appointment"

export const getAllAppointment = async()=> {
    const props = {
        data: null,
        url: appointmenttUrl+"/getAll",
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
export const patchAppointmentStatus = async(status:"Canceled"|"Approved"|"Ended"|"Declined",appointmentId:string)=> {
    var statusURL = ""
    switch(status){
        case "Canceled": statusURL="canceled";break;
        case "Approved":statusURL="approved";break;
        case "Declined": statusURL="declined";break;
        case "Ended": statusURL="ended";break;
        default: return null;
    }
    const props = {
        data: null,
        url: appointmenttUrl+`/status-${statusURL}`+"/"+appointmentId,
        headers: headers
    }
    const result = await axiosPatch(props)
    if(result.success) {
        console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }

}
