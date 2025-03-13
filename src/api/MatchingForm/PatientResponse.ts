import { baseUrl, headers } from "../Url";
import { axiosGetGroupChatMessage } from "../AxiosCRUD";

const url = baseUrl + "/ChatMessage/getgrouplog/";

const getGroupChatMessage = async (chatGroupId: string) => {
    const props = {
        data: chatGroupId,
        url: url,
        headers: headers
    };

    const result = await axiosGetGroupChatMessage(props);

    if (result.success) {
        console.log("Chat Messages fetched successfully:", result.data);
        return result.data;
    } else {
        console.error("Error fetching messages:", result.error);
        return result.error;
    }
};

export { getGroupChatMessage };
