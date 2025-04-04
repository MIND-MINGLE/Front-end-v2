import { axiosCreate, axiosDelete, axiosRead } from "../AxiosCRUD"
import { baseUrl, headers } from "../Url"

const specializationByTherapistUrl = baseUrl + "/TherapistSpecialization"
const specializationUrl = baseUrl + "/Specialization"


export const getAllSpecialization = async () => {
  const props = {
    data: null,
    url: specializationUrl,
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

export const getSpecializationByTherapistId = async (therapistId: string) => {
  const props = {
    data: null,
    url: specializationByTherapistUrl + "/" + therapistId,
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
export const AddSpecializationToTherapistId = async (therapistId: string,specializationId:string) => {
  const body = {
    therapistId: therapistId,
    specializationId: specializationId
  }
  const props = {
    data: body,
    url: specializationByTherapistUrl + "/" + therapistId,
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
export const DeleteSpecializationToTherapistId = async (therapistId: string,specializationId:string) => {
  const props = {
    data: null,
    url: specializationByTherapistUrl + `?therapistId=${therapistId}&specId=${specializationId}`,
    headers: headers
  }
  const result = await axiosDelete(props)
  if (result.success) {
    console.log(result.data)
    return result.data
  }
  else {
    console.log(result.error)
    return null
  }
}

