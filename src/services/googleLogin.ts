import { useGoogleLogin } from '@react-oauth/google'

export const GoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
        const { access_token } = tokenResponse;
        console.log('Google login successful, access token:', access_token);
        
    },
    onError: (error) => {
        console.error('Google login failed:', error);
       
    }
})
