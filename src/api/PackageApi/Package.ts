import { CreatePurchaseRequest } from "../../interface/IAccount";
import { baseUrl, headers } from "../Url";
import { axiosCreate, axiosRead } from "../AxiosCRUD";

const url = baseUrl + "/PurchasedPackage";

export const createSubscription = async (data: CreatePurchaseRequest) => {
    const props = {
        data: data,
        url: url,
        headers: headers
    };

    const result = await axiosCreate(props);

    if (result.success) {
        //console.log("Payment create successfully:", result.data);
        return result.data;
    } else {
        console.error("Package error messages:", result.error);
        return result.error;
    }
};

export const getAllPurchasedPackage = async () => {
    const props = {
        data: null,
        url: url,
        headers: headers
    };

    const result = await axiosRead(props);

    if (result.success) {
        //console.log("Payment create successfully:", result.data);
        return result.data;
    } else {
        console.error("Package error messages:", result.error);
        return result.error;
    }
};