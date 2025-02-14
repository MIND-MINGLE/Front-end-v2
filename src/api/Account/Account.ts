// import React from 'react'

import { baseUrl,headers } from "../Url"
import { axiosLoginAccount } from "../AxiosCRUD"

const loginUrl = baseUrl + "/Auth/login"

interface loginProps{
    email: string,
    accountName: string,
    password: string
}


const GetAllAccount = async()=> {
    return await null
}

const LoginAccount = async(data:loginProps)=> {
    const props = {
        data: data,
        url: loginUrl,
        headers: headers
    }
    const result = await axiosLoginAccount(props)
    if(result.success) {
       localStorage.setItem('token', result.data.result)
        return result.data
    }
    else{
        console.log(result.error)
        return result.error
    }
    
}


const LoginGoogle = async()=> {
    return await null
}


export {GetAllAccount, LoginAccount, LoginGoogle}