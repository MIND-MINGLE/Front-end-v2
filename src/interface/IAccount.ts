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

 
export type {AccountProps,AccountRequestProps,LoginProps,VerifyProps}