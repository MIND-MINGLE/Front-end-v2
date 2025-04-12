import { baseUrl, headers } from "../Url";
import { axiosCreate, axiosPatch, axiosRead } from "../AxiosCRUD";
import { PaymentRequest } from "../../interface/IAccount";

const url = baseUrl + "/Payment";

export const createSubPayment = async (data: PaymentRequest) => {
    const props = {
        data: data,
        url: url + "/create",
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
export const createAppPayment = async (data: PaymentRequest) => {
    const props = {
        data: data,
        url: url + "/create-has-appointment",
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

export const handlePaymentStatus = async (paymentId: string, action: string) => {
    const endpoint = action === 'PAID'
        ? `${url}/${paymentId}/status/paid`
        : `${url}/${paymentId}/status/canceled`;
    const props = {
        data: null,
        url: endpoint,
        headers: headers
    };
    const result = await axiosPatch(props);

    if (result.success) {
        //console.log("Payment create successfully:", result.data);
        return result.data;
    } else {
        console.error("Payment error messages:", result.error);
        return result.error;
    }
};

export const getAllPaymentPending = async (pageIndex: number, pageSize: number) => {

    const props = {
        data: null,
        url: url + `/get-all-by-pending-status?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        headers: headers
    };
    const result = await axiosRead(props);

    if (result.success) {
        //console.log("Payment create successfully:", result.data);
        return result.data;
    } else {
        console.error("Payment error messages:", result.error);
        return result.error;
    }
};
export const getAllPayment = async (pageIndex: number, pageSize: number) => {
    const props = {
        data: null,
        url: url + `/get-all?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        headers: headers
    };
    const result = await axiosRead(props);
    if (result.success) {
        return result.data;
    } else {
        console.error("Payment error messages:", result.error);
        return result.error;
    }
}
export const getPaymentByPatientId = async (patientId:string) => {
    const props = {
        data: null,
        url: url + `/patient/${patientId}`,
        headers: headers
    };
    const result = await axiosRead(props);
    if (result.success) {
        return result.data;
    } else {
        console.error("Payment error messages:", result.error);
        return result.error;
    }
}
