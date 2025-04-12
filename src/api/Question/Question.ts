import { baseUrl, headers } from "../Url";
import { axiosRead } from "../AxiosCRUD";

const questionUrl = baseUrl + "/Question/question";

export const GetAllQuestions = async() =>{
    const props = {
        data:null,
        url: questionUrl,
        headers: headers
    }
    const result = await axiosRead(props);
    if(result.success) {
        //console.log(result.data)
        return result.data
    }
    else{
        console.log(result.error)
        return null
    }
}