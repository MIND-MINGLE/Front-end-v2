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
export type {AccountProps,AccountRequestProps,LoginProps}