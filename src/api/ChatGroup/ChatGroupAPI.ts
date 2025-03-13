import { baseUrl, headers } from "../Url";
import { axiosGetGroupChatByAccountId } from "../AxiosCRUD";

const url = baseUrl + "TODO";

const getGroupChatByAccountId = async (accountId: string) => {
    const props = {
        data: accountId,
        url: url,
        headers: headers
    };

    const result = await axiosGetGroupChatByAccountId(props);

    if (result.success) {
        console.log("Group chats fetched successfully:", result.data);
        return result.data;
    } else {
        console.error("Error fetching group chats:", result.error);
        return result.error;
    }
};

export { getGroupChatByAccountId };
