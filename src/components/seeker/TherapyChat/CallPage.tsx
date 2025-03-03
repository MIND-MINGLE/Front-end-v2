
import WithVideo from './CallFormat/WithVideo';
import NoVideo from './CallFormat/NoVideo';
interface CallPageProps{
    format: string;  // A string representing the call format (e.g., "audio", "video")
  
}

export default function CallPage({format}:CallPageProps) {
  return (
    <>  
    {
        format === "video" ? <WithVideo /> : <NoVideo />  // Render the appropriate media element based on the call format
    }
    </>
  )
}
