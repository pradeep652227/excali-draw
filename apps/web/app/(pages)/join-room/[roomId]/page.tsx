import JoinRoomClient from './JoinRoomClient';

export default async function JoinRoomPage({ params }: { params: { roomId: string } }) {
    const roomId = (await params).roomId
    return <JoinRoomClient roomId={roomId} />;
}
