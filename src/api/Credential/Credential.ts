import {  axiosRead, axiosUpdate } from "../AxiosCRUD"
import { baseUrl, headers } from "../Url"

const credentialUrl = baseUrl + "/Credential"

export const getCredentialByCredentialId = async (credId: string) => {
  const props = {
    data: null,
    url: credentialUrl + "/" + credId,
    headers: headers
  }
  const result = await axiosRead(props)
  if (result.success) {
    //console.log(result)
    return result.data
  }
  else {
    console.log(result.error)
    return null
  }
}
export const addCredential = async (therapistId: string,imageUrl:string) => {
  const body = {
    therapistId: therapistId,
    imageUrl: imageUrl
  }
  const props = {
    data: body,
    url: credentialUrl,
    headers: headers
  }
  const result = await axiosUpdate(props)
  if (result.success) {
    //console.log(result)
    return result.data
  }
  else {
    console.log(result.error)
    return null
  }
}

export const updateCredential = async (credId: string,imageUrl:string) => {
  const body = {
    imageUrl: imageUrl
  }
  const props = {
    data: body,
    url: credentialUrl + "/" + credId,
    headers: headers
  }
  const result = await axiosUpdate(props)
  if (result.success) {
    //console.log(result)
    return result.data
  }
  else {
    console.log(result.error)
    return null
  }
}

export const getCredentialByTherapistId = async (therapistId: string) => {
  const props = {
    data: null,
    url: credentialUrl + "/" + therapistId,
    headers: headers
  }
  const result = await axiosRead(props)
  if (result.success) {
    //console.log(result)
    return result.data
  }
  else {
    console.log(result.error)
    return null
  }
}