
import { baseUrl,headers } from "../Url"
import { axiosPatch, axiosRead, axiosUpdate } from "../AxiosCRUD"
import { TherapistUpdate } from "../../interface/IAccount"


const therapistUrl = baseUrl + "/Therapist"


export const getAllTherapist = async()=> {
    const props = {
        data: null,
        url: therapistUrl+"/getall",
        headers: headers
    }
    const result = await axiosRead(props)
    if(result.success) {
        //console.log(result.data)
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
        //console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
    
}
export const getTherapistByTherapistId = async(accountId:string)=> {
    const props = {
        data: null,
        url: therapistUrl+"/therapist/"+accountId,
        headers: headers
    }
    const result = await axiosRead(props)
    if(result.success) {
        //console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
    
}
export const updateTherapistProfile = async(therapistUpdate:TherapistUpdate)=> {
    const props = {
        data: therapistUpdate,
        url: therapistUrl+"/update",
        headers: headers
    }
    const result = await axiosUpdate(props)
    if(result.success) {
        //console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
    
}
export const updateTherapistAccount = async(accountId:string)=> {
    const props = {
        data: null,
        url: therapistUrl+"/approve/"+accountId,
        headers: headers
    }
    const result = await axiosPatch(props)
    if(result.success) {
        //console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
    
}