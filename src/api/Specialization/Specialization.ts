import { axiosCreate, axiosRead, axiosUpdate } from "../AxiosCRUD"
import { baseUrl, headers } from "../Url"

const specializationUrl = baseUrl + "/TherapistSpecialization"

export const getSpecializationByTherapistId = async (therapistId: string) => {
  const props = {
    data: null,
    url: specializationUrl + "/" + therapistId,
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