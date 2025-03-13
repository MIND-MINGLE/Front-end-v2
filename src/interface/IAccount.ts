interface AccountProps{
    Role: string
    UserId: string
}
interface AccountRequestProps{
   email: string,
  accountName: string,
  password: string,
  confirmPassword: string
}
interface LoginProps{
  emailOrAccountName: string,
  password: string
}
interface VerifyProps{
  accountId: string,
  verificationCode: string,
}

interface SeekerCreateProps
{
  accountId: string,
  firstName: string,
  lastName: string,
  dob: string,
  gender: string,
  phoneNumber: string
}

 
export type {AccountProps,AccountRequestProps,LoginProps,VerifyProps,SeekerCreateProps}