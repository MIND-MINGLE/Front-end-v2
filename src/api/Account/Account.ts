// import React from 'react'

import { baseUrl,headers } from "../Url"
import { axiosLoginAccount, axiosRegisterAccount } from "../AxiosCRUD"
import { AccountRequestProps, LoginProps, VerifyProps } from "../../interface/IAccount"

const resUrl = baseUrl + "/Auth/register"
const loginUrl = baseUrl + "/Auth/login"
const verifyUrl = baseUrl + "/Auth/verification"

export const RegisterPatient = async()=> {
    return await null
}

export const RegisterPatientAccount = async(data:AccountRequestProps)=> {
    const props = {
        data: data,
        url: resUrl+"?roleId=seeker",
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
        url: resUrl+"?roleId=doc",
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
        url: resUrl+"?roleId=agent",
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

export const LoginAccount = async(data:LoginProps)=> {
    const props = {
        data: data,
        url: loginUrl,
        headers: headers
    }
    const result = await axiosLoginAccount(props)
    if(result.success) {
        console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
}

export const verifyAccount = async(data:VerifyProps)=> {
    const props = {
        data: data,
        url: verifyUrl,
        headers: headers
    }
    const result = await axiosLoginAccount(props)
    if(result.success) {
        console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
}