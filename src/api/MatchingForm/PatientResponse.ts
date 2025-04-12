import { baseUrl, headers } from "../Url";
import { axiosCreate, axiosRead } from "../AxiosCRUD";
import { PatientResponseRequest, PatientSurveyRequest } from "../../interface/IAccount";

const SurveyUrl = baseUrl + "/PatientSurvey";
const ResponseUrl = baseUrl + "/PatientResponse";

export const CreateSurveyResult = async (data: PatientSurveyRequest) => {
    const props = {
        data: data,
        url: SurveyUrl,
        headers: headers
    };

    const result = await axiosCreate(props);

    if (result.success) {
        //console.log("CreateSurveyResult fetched successfully:", result.data);
        return result.data;
    } else {
        console.error("Error fetching CreateSurveyResult:", result.error);
        return result.error;
    }
};
export const getLatestPatientSurvey = async (patientId:string) => {
    const props = {
        data: null,
        url: SurveyUrl+"/latest/"+patientId,
        headers: headers
    };

    const result = await axiosRead(props);

    if (result.success) {
        //console.log("Fetch SurveyResult successfully:", result.data);
        return result.data;
    } else {
        console.error("Error fetching CreateSurveyResult:", result.error);
        return result.error;
    }
};
export const CreateResponseResult = async (data: PatientResponseRequest[]) => {
    const props = {
        data: data,
        url: ResponseUrl,
        headers: headers
    };

    const result = await axiosCreate(props);

    if (result.success) {
        //console.log("CreateResponseResult fetched successfully:", result.data);
        return result.data;
    } else {
        console.error("Error fetching CreateSurveyResult:", result.error);
        return result.error;
    }
};
