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

export type {AccountProps,AccountRequestProps}