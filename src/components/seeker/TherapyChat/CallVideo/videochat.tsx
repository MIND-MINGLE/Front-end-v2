import React, { useEffect, useState, useRef } from "react";
import Video, { Room, Participant } from "twilio-video";

interface VideoChatProps {
    userName: string;
    roomName: string;
    audioOnly: boolean;
    onDisconnect: () => void;
}


const VideoChat: React.FC<VideoChatProps> = ({ userName, roomName, audioOnly, onDisconnect }) => {
    const [room, setRoom] = useState<Room | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const localMediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);

    useEffect(() => {
        const joinRoom = async () => {
            try {
                // Fetch Twilio token from backend
                const response = await fetch(
                    `https://your-backend-url/api/video/token?identity=${userName}&room=${roomName}`
                );
                const data = await response.json();

                // Connect to Twilio Video (Audio Only Mode supported)
                const newRoom = await Video.connect(data.token, {
                    name: roomName,
                    tracks: await Video.createLocalTracks({
                        audio: true,
                        video: !audioOnly
                    }),
                });

                setRoom(newRoom);
                setParticipants([...newRoom.participants.values()]);

                // Event Listeners for participants
                newRoom.on("participantConnected", (participant: Participant) => {
                    setParticipants(prev => [...prev, participant]);
                });

                newRoom.on("participantDisconnected", (participant: Participant) => {
                    setParticipants(prev => prev.filter(p => p !== participant));
                });

                // Attach local track to video/audio element
                if (localMediaRef.current) {
                    const localTrack = newRoom.localParticipant.videoTracks.values().next().value?.track ||
                                      newRoom.localParticipant.audioTracks.values().next().value?.track;
                    if (localTrack) {
                        (localMediaRef.current as HTMLMediaElement).srcObject = new MediaStream([localTrack.mediaStreamTrack]);
                    }
                }
            } catch (error) {
                console.error("Error joining room:", error);
            }
        };

        joinRoom();

        return () => {
            if (room) {
                room.disconnect();
                setRoom(null);
            }
        };
    }, [roomName, userName, audioOnly]);

    return (
        <div className="video-chat">
            <h2>Room: {roomName}</h2>

            <div className="media-container">
                {/* Local Media */}
                <div className="media-box">
                    <h3>You ({audioOnly ? "Audio" : "Video"})</h3>
                    {audioOnly ? (
                        <audio ref={localMediaRef as React.RefObject<HTMLAudioElement>} autoPlay muted />
                    ) : (
                        <video ref={localMediaRef as React.RefObject<HTMLVideoElement>} autoPlay muted />
                    )}
                </div>

                {/* Remote Participants */}
                {participants.map(participant => (
                    <RemoteParticipant key={participant.sid} participant={participant} audioOnly={audioOnly} />
                ))}
            </div>

            <button onClick={onDisconnect}>Leave Room</button>
        </div>
    );
};

interface RemoteParticipantProps {
    participant: Participant;
    audioOnly: boolean;
}

const RemoteParticipant: React.FC<RemoteParticipantProps> = ({ participant, audioOnly }) => {
    const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);

    useEffect(() => {
    //     participant.tracks.forEach(publication => {
    //         if (publication.isSubscribed) {
    //             attachTrack(publication.track);
    //         }
    //     });

    //     participant.on("trackSubscribed", track => attachTrack(track));

    //     return () => {
    //         participant.removeAllListeners();
    //     };
    // }, [participant]);

    // const attachTrack = (track: Track) => {
    //     if (mediaRef.current && track.kind === (audioOnly ? "audio" : "video")) {
    //         (mediaRef.current as HTMLMediaElement).srcObject = new MediaStream([track.mediaStreamTrack]);
    //     }
    });

    return (
        <div className="media-box">
            <h3>{participant.identity} ({audioOnly ? "Audio" : "Video"})</h3>
            {audioOnly ? (
                <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} autoPlay />
            ) : (
                <video ref={mediaRef as React.RefObject<HTMLVideoElement>} autoPlay />
            )}
        </div>
    );
};

export default VideoChat;
