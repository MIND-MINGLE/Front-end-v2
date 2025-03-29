import { baseUrl, headers } from "../Url";
import { axiosCreate, axiosRead } from "../AxiosCRUD";
import { PaymentRequest } from "../../interface/IAccount";

const url = baseUrl + "/Payment";

export const createSubPayment = async (data: PaymentRequest) => {
    const props = {
        data: data,
        url: url+"/create",
        headers: headers
    };

    const result = await axiosCreate(props);

    if (result.success) {
        //console.log("Payment create successfully:", result.data);
        return result.data;
    } else {
        console.error("Payment error messages:", result.error);
        return result.error;
    }
};