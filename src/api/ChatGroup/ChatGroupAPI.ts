import { baseUrl, headers } from "../Url";
import { axiosCreate, axiosRead } from "../AxiosCRUD";
import { requestGroupChat, userInGroup } from "../../interface/IAccount";

const url = baseUrl + "";

const getGroupChatByAccountId = async (accountId: string) => {
    const props = {
        data: null,
        url: url+"/UsersInGroup/getGroupChatByAccountId/"+accountId,
        headers: headers
    };

    const result = await axiosRead(props);

    if (result.success) {
        console.log("Group chats fetched successfully:", result.data);
        return result.data;
    } else {
        console.error("Error fetching group chats:", result.error);
        return result.error;
    }
};
export const createGroupChat = async (data: requestGroupChat) => {
    const props = {
        data: data,
        url: url+"/ChatGroup/create",
        headers: headers
    };

    const result = await axiosCreate(props);

    if (result.success) {
        console.log("Group chats fetched successfully:", result.data);
        return result.data;
    } else {
        console.error("Error fetching group chats:", result.error);
        return result.error;
    }
};
export const addUserInGroup = async (data: userInGroup) => {
    const props = {
        data: data,
        url: url+"/UsersInGroup/addclient",
        headers: headers
    };

    const result = await axiosCreate(props);

    if (result.success) {
        console.log("Group chats fetched successfully:", result.data);
        return result.data;
    } else {
        console.error("Error fetching group chats:", result.error);
        return result.error;
    }
};


export { getGroupChatByAccountId };
