
import { baseUrl, headers } from "../Url";
import { axiosCreate, axiosDelete, axiosRead, axiosUpdate } from "../AxiosCRUD";

const sessionUrl = baseUrl + "/Session";

export const GetAllSessionByTherapistId = async(therapistId:string) =>{
    const props = {
        data:null,
        url: sessionUrl+"/getSessionsByTherapist/"+therapistId,
        headers: headers
    }
    const result = await axiosRead(props);
    if(result.success) {
        console.log(result.data)
        return result.data.result
    }
    else{
        console.log(result.error)
        return null
    }
}
export const GetAllSessionById = async(therapistId:string) =>{
    const props = {
        data:null,
        url: sessionUrl+"/getSessionsByTherapist/"+therapistId,
        headers: headers
    }
    const result = await axiosRead(props);
    if(result.success) {
        console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
}

export const deleteSessionById = async(sessionId:string) =>{
    const props = {
        data:null,
        url: sessionUrl+"/delete/"+sessionId,
        headers: headers
    }
    const result = await axiosDelete(props);
    if(result.success) {
        console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
}

export const updateSessionById = async(data:any) =>{
    const props = {
        data:data,
        url: sessionUrl+"/update",
        headers: headers
    }
    const result = await axiosUpdate(props);
    if(result.success) {
        console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
}

export const createSession = async(data:any) =>{
    const props = {
        data:data,
        url: sessionUrl+"/create",
        headers: headers
    }
    const result = await axiosCreate(props);
    if(result.success) {
        console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
}