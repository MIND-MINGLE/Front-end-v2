// import React from 'react'

import { baseUrl,headers } from "../Url"
import { axiosRegisterAccount } from "../AxiosCRUD"
import { AccountRequestProps } from "../../interface/IAccount"

const loginUrl = baseUrl + "/Auth/register"


export const RegisterPatient = async()=> {
    return await null
}

export const RegisterPatientAccount = async(data:AccountRequestProps)=> {
    const props = {
        data: data,
        url: loginUrl+"?roleId=seeker",
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
export const RegisterDocAccount = async(data:AccountRequestProps)=> {
    const props = {
        data: data,
        url: loginUrl+"?roleId=doc",
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
export const RegisterAgentAccount = async(data:AccountRequestProps)=> {
    const props = {
        data: data,
        url: loginUrl+"?roleId=agent",
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