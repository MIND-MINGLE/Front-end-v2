import { baseUrl, headers } from "../Url";
import { axiosCreateSession, axiosDeleteSession, axiosGetSession, axiosUpdateSession } from "../AxiosCRUD";

const sessionUrl = baseUrl + "/Session";

export const GetAllSessionByTherapistId = async(therapistId:string) =>{
    const props = {
        data:therapistId,
        url: sessionUrl+"/getSessionsByTherapist/",
        headers: headers
    }
    const result = await axiosGetSession(props);
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
        data:therapistId,
        url: sessionUrl+"/getSessionsByTherapist/",
        headers: headers
    }
    const result = await axiosGetSession(props);
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
        data:sessionId,
        url: sessionUrl+"/delete/",
        headers: headers
    }
    const result = await axiosDeleteSession(props);
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
    const result = await axiosUpdateSession(props);
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
    const result = await axiosCreateSession(props);
    if(result.success) {
        console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
}