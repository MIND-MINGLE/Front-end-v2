interface AccountProps {
  Role: string
  UserId: string
}
interface AccountRequestProps {
  email: string,
  accountName: string,
  password: string,
  confirmPassword: string
}
interface LoginProps {
  emailOrAccountName: string,
  password: string
}
interface VerifyProps {
  accountId: string,
  verificationCode: string,
}

interface SeekerCreateProps {
  accountId: string,
  firstName: string,
  lastName: string,
  dob: string,
  gender: string,
  phoneNumber: string
}
// Define the Therapist type based on your schema
interface TherapistCreateProps {
  accountId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string; // Formatted as "dd/MM/yyyy" from backend
  gender: string;
  pricePerHour: number;
  description:string
}

// Define the Therapist type based on your schema
interface Therapist {
  therapistId: string;
  accountId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar: string;
  dob: string; // Formatted as "dd/MM/yyyy" from backend
  gender: string;
  pricePerHour: number;
  account: Account
}
interface Account {
  accountId: string,
  accountName: string,
  email: string,
  avatar: string,
  isDisabled: boolean
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
  dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  isActive: boolean;
}

// Interface for the appointment schema
interface AppointmentRequestOnline {
  patientId: string;
  therapistId: string;
  sessionId: string;
  groupChatId:string;
  appointmentType: 'OFFLINE' | 'ONLINE';
  totalFee: number;
  platformFee: number;
}
interface AppointmentRequestOffline {
  patientId: string;
  therapistId: string;
  coWorkingSpaceId: string;
  sessionId: string;
  groupChatId:string;
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
  status: "PENDING" | "APPROVED" |"ENDED"| "DECLINED" | "CANCELED";
  totalFee: number;
  platformFee: number;
  createdAt: string; // ISO 8601 date string;
  session: Sessison
  patient: Patient | null,
  therapist: Therapist | null
  chatgroupId:string;
}

interface requestGroupChat {
  adminId: string
}
interface PaymentRequest {
  patientId: string;
  amount: number;
  therapistReceive: number;
  paymentUrl: string;
}

interface userInGroup {
  clientId: string
  chatGroupId: string
}
interface ChatProfile {
  chatGroupId: string;
  adminId: string;
  adminName: string;
  userInGroupId: string;
  isDisabled: boolean
}
interface ChatProps {
  chatGroupId: string;
  userInGroupId: string;
  name: string,
  therapistId: string
  patientId: string
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

interface Subscription {
  subscriptionId: string;
  packageName: string;
  price: number;
  isDisabled: boolean;
  features?: string[];
  description?: string;
  isPremium: boolean;
}

interface PurchasedPackagedRequest {
  patientId: string,
  subscriptionId: string,
}
interface PurchasedPackaged {
  purchasedPackageId: string;
  patientId: string,
  subscriptionId: string,
  subscription: Subscription,
  startDate: string,
  endDate: string,
  isDisabled:boolean
}

interface Credential {
  credentialId: string;
  imageUrl: string;
  isDisabled: number;
}
interface CreatePurchaseRequest {
  patientId: string;
  subscriptionId: string;
}
interface Answer {
  answerId: string;
  answerContent: string;
  score:number
}
interface Category {
  categoryId: string;
  categoryName: string;
  description: string;
  questions: Question[];
}
interface Question {
  questionId: string;
  questionContent: string;
  categoryId: string;
  createdAt: string;
  answers: Answer[];
}
interface TherapistUpdate {
  id: string
  firstName:string
  lastName: string
  dob: string
  gender:string
  phoneNumber: string
  description: string
}
interface PatientSurveyRequest {
patientId: string,
summary: string,
createdAt: Date
}
interface PatientSurveyResponse {
  patientSurveyId : string
  patientId: string,
  summary: string,
  createdAt: Date,
  patientResponses :PatientResResponse[]
  }
interface PatientResponseRequest{
patientSurveyId:string
questionId: string
answerId: string
customAnswer: string | null
}
interface PatientResResponse{
  responseId:string
  surveyId :string
  questionId :string
  answerId :string
  customAnswer :string
  score : number
  }


export type {AppointmentRequestOffline,PatientResResponse,PatientSurveyResponse,PatientResponseRequest,PatientSurveyRequest,TherapistUpdate,Question,Answer,Category,CreatePurchaseRequest,PaymentRequest,TherapistCreateProps, PurchasedPackaged, PurchasedPackagedRequest, Subscription, Sessison, UserInGroup, EmergencyEndRequest, ChatMessage, ChatProfile, ChatProps, AppointmentRequestOnline, userInGroup, requestGroupChat, Appointment, AccountProps, AccountRequestProps, LoginProps, VerifyProps, SeekerCreateProps, Therapist, Patient, Credential }
