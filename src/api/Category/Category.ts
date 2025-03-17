import { baseUrl, headers } from "../Url";
import { axiosRead } from "../AxiosCRUD";

const categoryUrl = baseUrl + "/Category/category";

export const GetAllQuestionCategory = async () => {
    const props = {
        data: null,
        url: categoryUrl,
        headers: headers
    }
    const result = await axiosRead(props);
    if (result.success) {
        console.log(result.data)
        return result.data
    }
    else {
        console.log(result.error)
        return null
    }
}