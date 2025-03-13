import { baseUrl, headers } from "../Url";
import { axiosGetQuestionnaire } from "../AxiosCRUD";

const questionUrl = baseUrl + "/Question/question";

export const GetAllQuestions = async() =>{
    const props = {
        data:"",
        url: questionUrl,
        headers: headers
    }
    const result = await axiosGetQuestionnaire(props);
    if(result.success) {
        console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
}