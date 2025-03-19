
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

interface Sessison {
  sessionId: string;
  therapistId: string;
  startTime: string;
  endTime: string;
  dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY" ;
  isActive: boolean;
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
  createdAt: string; // ISO 8601 date string;
  session: Sessison
}

interface requestGroupChat{
  adminId: string
}


interface userInGroup{
   clientId: string
   chatGroupId: string
}
interface ChatProfile {
  chatGroupId: string;
  adminId: string;
  adminName: string;
  userInGroupId: string;
}
interface ChatProps {
  chatGroupId: string;
  userInGroupId: string;
  name:string,
  therapistId:string
  patientId:string
}
interface ChatMessage {
  accountId: string;
  content: string;
  messageId?: string; // Thêm nếu server hỗ trợ
}
interface EmergencyEndRequest {
  appointmentId: string,
  accountId: string,
  reason: string
}
interface UserInGroup {
  chatGroupId: string;
  clientId: string;
  accountName: string;
  userInGroupId: string;
}

 
export type {Sessison,UserInGroup,EmergencyEndRequest,ChatMessage,ChatProfile,ChatProps,AppointmentRequest,userInGroup,requestGroupChat,Appointment,AccountProps,AccountRequestProps,LoginProps,VerifyProps,SeekerCreateProps,Therapist,Patient}