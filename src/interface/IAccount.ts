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
interface AppointmentRequest {
  patientId: string;
  therapistId: string;
  coWorkingSpaceId: string | null;
  sessionId: string;
  emergencyEndId: string | null;
  appointmentType: 'OFFLINE' | 'ONLINE';
  totalFee: number;
  platformFee: number;
}
interface Appointment {
  appointmentId: string;
  patientId: string;
  therapistId: string;
  coWorkingSpaceId: string | null;
  sessionId: string;
  emergencyEndId: string | null;
  appointmentType: "ONLINE" | "OFFLINE"; // Assuming possible values based on context
  status: "PENDING" | "APPROVED" | "DECLINED" | "CANCELED";
  totalFee: number;
  platformFee: number;
  createdAt: string; // ISO 8601 date string
}

interface requestGroupChat{
  adminId: string
}


interface userInGroup{
   clientId: string
   chatGroupId: string
}

 
export type {AppointmentRequest,userInGroup,requestGroupChat,Appointment,AccountProps,AccountRequestProps,LoginProps,VerifyProps,SeekerCreateProps,Therapist,Patient}