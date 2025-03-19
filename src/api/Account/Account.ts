// import React from 'react'

import { baseUrl, headers } from "../Url"
import { AccountRequestProps, LoginProps, VerifyProps } from "../../interface/IAccount"
import { storage } from "../../services/firebase" // Đảm bảo đã cấu hình Firebase trong services/firebase.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { axiosCreate, axiosRead, axiosUpdate } from "../AxiosCRUD";

const resUrl = baseUrl + "/Auth/register"
const loginUrl = baseUrl + "/Auth/login"
const verifyUrl = baseUrl + "/Auth/verification"

export const RegisterPatient = async () => {
    return await null
}

export const RegisterPatientAccount = async (data: AccountRequestProps) => {
    const props = {
        data: data,
        url: resUrl + "?roleId=seeker",
        headers: headers
    }
    const result = await axiosCreate(props)
    if (result.success) {
        console.log(result.data)
        return result.data
    }
    else {
        console.log(result.error)
        return null
    }

}
export const RegisterDocAccount = async (data: AccountRequestProps) => {
    const props = {
        data: data,
        url: resUrl + "?roleId=doc",
        headers: headers
    }
    const result = await axiosCreate(props)
    if (result.success) {
        console.log(result.data)
        return result.data
    }
    else {
        console.log(result.error)
        return null
    }

}
export const RegisterAgentAccount = async (data: AccountRequestProps) => {
    const props = {
        data: data,
        url: resUrl + "?roleId=agent",
        headers: headers
    }
    const result = await axiosCreate(props)
    if (result.success) {
        console.log(result.data)
        return result.data
    }
    else {
        console.log(result.error)
        return null
    }

}

export const LoginAccount = async (data: LoginProps) => {
    const props = {
        data: data,
        url: loginUrl,
        headers: headers
    }
    const result = await axiosCreate(props)
    if (result.success) {
        console.log(result.data)
        return result.data
    }
    else {
        console.log(result.error)
        return null
    }
}

export const verifyAccount = async (data: VerifyProps) => {
    const props = {
        data: data,
        url: verifyUrl,
        headers: headers
    }
    const result = await axiosCreate(props)
    if (result.success) {
        console.log(result.data)
        return result.data
    }
    else {
        console.log(result.error)
        return null
    }
}
export const updateUserAvatar = async (file: File, accountId: string) => {
    try {
        if (!file) {
            throw new Error("No file selected");
        }

        if (file.size > 5 * 1024 * 1024) {
            throw new Error("File size should not exceed 5MB");
        }

        if (!file.type.startsWith("image/")) {
            throw new Error("Please upload an image file");
        }

        // Upload to Firebase
        const storageRef = ref(storage, `avatars/${accountId}/${file.name}_${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Call API
        const props = {
            data: {
                accountId: accountId,
                avatar: downloadURL
            },
            url: baseUrl + "/Account/updateavatar",
            headers: headers
        }

        const result = await axiosUpdate(props)
        if (result.success) {
            console.log(result.data)
            return result.data
        } else {
            console.log(result.error)
            return null
        }
    } catch (error) {
        console.error("Error updating avatar:", error)
        return null
    }
}
export const getAccountById = async (accountId: string) => {
    const props = {
        url: baseUrl + "/Account/" + accountId,
        headers: headers
    }
    const result = await axiosRead(props)
    if (result.success) {
        console.log(result.data)
        return result.data
    }
    else {
        console.log(result.error)
        return null
    }
}
