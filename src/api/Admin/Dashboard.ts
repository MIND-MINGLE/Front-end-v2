import { SeekerCreateProps } from "../../interface/IAccount"
import { axiosCreate, axiosRead } from "../AxiosCRUD"
import { baseUrl, headers } from "../Url"

const dashboardUrl = baseUrl + "/Dashboard"

export const AdminSomthing = async (data: SeekerCreateProps) => {
    const props = {
        data: data,
        url: dashboardUrl + "/create",
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

export const getDashboardStats = async (timeRange: string) => {
    const props = {
        data: null,
        url: dashboardUrl + "/stats?timeRange=" + timeRange,
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