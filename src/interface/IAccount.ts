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

// Define the Therapist type based on your schema
interface Therapist {
  therapistId: string;
  accountId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string; // Formatted as "dd/MM/yyyy" from backend
  gender: string;
  pricePerHour: number;
}
interface Patient {
  patientId: string;
  accountId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string; // Formatted as "dd/MM/yyyy" from backend
  gender: string;
}


// Interface for the appointment schema
interface Appointment {
  patientId: string;
  therapistId: string;
  coWorkingSpaceId: string | null;
  sessionId: string;
  emergencyEndId: string | null;
  appointmentType: 'OFFLINE' | 'ONLINE';
  totalFee: number;
  platformFee: number;
}

interface requestGroupChat{
  adminId: string
}


interface userInGroup{
   clientId: string
   chatGroupId: string
}

 
export type {userInGroup,requestGroupChat,Appointment,AccountProps,AccountRequestProps,LoginProps,VerifyProps,SeekerCreateProps,Therapist,Patient}