import { baseUrl, headers } from "../Url";
import { axiosGetQuestionCategory } from "../AxiosCRUD";

const categoryUrl = baseUrl + "/Category/category";

export const GetAllQuestionCategory = async () => {
    const props = {
        data: "",
        url: categoryUrl,
        headers: headers
    }
    const result = await axiosGetQuestionCategory(props);
    if (result.success) {
        console.log(result.data)
        return result.data
    }
    else {
        console.log(result.error)
        return null
    }
}