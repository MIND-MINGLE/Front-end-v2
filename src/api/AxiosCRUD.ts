import axios from "axios";

interface AxiosProp{
    data:any,
    url:string
    headers:any
}
interface AxiosResult {
    success: boolean;
    data?: any;
    error?: string;
  }

const axiosLoginAccount = async(props:AxiosProp): Promise<AxiosResult> => {
    try {
      const response = await axios.post(props.url,props.data,props.headers);
      return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error:", error.response?.data || error.message);
            return { success: false, error: error.response?.data || error.message };
          }
          else{
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
          }
        }
    }

    const axiosGetGroupChatByAccountId = async(props:AxiosProp): Promise<AxiosResult> => {
      try {
        const response = await axios.get(props.url+props.data,props.headers);
        return { success: true, data: response.data };
      } catch (error) {
          if (axios.isAxiosError(error)) {
              console.error("Axios error:", error.response?.data || error.message);
              return { success: false, error: error.response?.data || error.message };
            }
            else{
              console.error("Unexpected error:", error);
              return { success: false, error: "An unexpected error occurred" };
            }
          }
      }

      const axiosGetGroupChatMessage = async(props:AxiosProp): Promise<AxiosResult> => {
        try {
          const response = await axios.get(props.url+props.data,props.headers);
          return { success: true, data: response.data };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data || error.message);
                return { success: false, error: error.response?.data || error.message };
              }
              else{
                console.error("Unexpected error:", error);
                return { success: false, error: "An unexpected error occurred" };
              }
            }
        }

        const axiosGetQuestionnaire = async(props:AxiosProp): Promise<AxiosResult> => {
          try {
            const response = await axios.get(props.url,props.headers);
            return { success: true, data: response.data };
          } catch (error) {
              if (axios.isAxiosError(error)) {
                  console.error("Axios error:", error.response?.data || error.message);
                  return { success: false, error: error.response?.data || error.message };
                }
                else{
                  console.error("Unexpected error:", error);
                  return { success: false, error: "An unexpected error occurred" };
                }
              }
          }
          const axiosSummitUserResponse = async(props:AxiosProp): Promise<AxiosResult> => {
            try {
              const response = await axios.post(props.url,props.data,props.headers);
              return { success: true, data: response.data };
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Axios error:", error.response?.data || error.message);
                    return { success: false, error: error.response?.data || error.message };
                  }
                  else{
                    console.error("Unexpected error:", error);
                    return { success: false, error: "An unexpected error occurred" };
                  }
                }
            }
      export  const axiosRegisterAccount = async(props:AxiosProp): Promise<AxiosResult> => {
        try {
          const response = await axios.post(props.url,props.data,props.headers);
          return { success: true, data: response.data };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data || error.message);
                return { success: false, error: error.response?.data || error.message };
              }
              else{
                console.error("Unexpected error:", error);
                return { success: false, error: "An unexpected error occurred" };
              }
            }
        }

      
    
    export {axiosLoginAccount,axiosGetGroupChatByAccountId,axiosGetGroupChatMessage,axiosGetQuestionnaire,axiosSummitUserResponse}