import {  axiosRead } from "../AxiosCRUD"
import { baseUrl, headers } from "../Url"

const credentialUrl = baseUrl + "/Credential"


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