import { PurchasedPackagedRequest } from "../../interface/IAccount"
import { axiosCreate, axiosRead } from "../AxiosCRUD"
import { baseUrl, headers } from "../Url"

const subtUrl = baseUrl

export const getAllSubscription = async () => {
    const props = {
        data: null,
        url: subtUrl+"/Subscription",
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

export const addPurchasedPackage = async (data:PurchasedPackagedRequest) => {
    const props = {
        data: data,
        url: subtUrl+"/PurchasedPackage",
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

export const getPurchasedPackageByPatientId = async (patientId:string) => {
    const props = {
        data: null,
        url: subtUrl+"/PurchasedPackage/patient/"+patientId,
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