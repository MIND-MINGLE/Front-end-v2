import { baseUrl, headers } from "../Url";
import { axiosCreate, axiosRead } from "../AxiosCRUD";
import { RatingRequest } from "../../interface/IAccount";

const url = baseUrl + "/Rating";

export const createRating = async (data: RatingRequest) => {
    const props = {
        data: data,
        url: url,
        headers: headers
    };

    const result = await axiosCreate(props);

    if (result.success) {

        return result.data;
    } else {
        console.error("Rating error messages:", result.error);
        return result.error;
    }
};
export const getAllRating = async () => {
    const props = {
        data: null,
        url: url,
        headers: headers
    };

    const result = await axiosRead(props);

    if (result.success) {

        return result.data;
    } else {
        console.error("Rating error messages:", result.error);
        return result.error;
    }
};
export const getRatingByPatientId = async (patientId: string) => {
    const props = {
        data: null,
        url: url + "/patient/" + patientId,
        headers: headers
    };

    const result = await axiosRead(props);

    if (result.success) {

        return result.data;
    } else {
        console.error("Rating error messages:", result.error);
        return result.error;
    }
};
export const getRatingByAppointmentId = async (appId: string) => {
    const props = {
        data: null,
        url: url + "/appointment/" + appId,
        headers: headers
    };

    const result = await axiosRead(props);

    if (result.success) {

        return result.data;
    } else {
        console.error("Rating error messages:", result.error);
        return result.error;
    }
};

