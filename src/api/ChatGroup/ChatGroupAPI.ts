import { baseUrl, headers } from "../Url";
import { axiosRead } from "../AxiosCRUD";

const url = baseUrl + "/UsersInGroup/getGroupChatByAccountId";

const getGroupChatByAccountId = async (accountId: string) => {
    const props = {
        data: null,
        url: url+"/"+accountId,
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

export { getGroupChatByAccountId };
