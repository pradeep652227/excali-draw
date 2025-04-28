import CanvasComponent from './CanvasComponent1';

export default async function CanvasPage({ params }: { params: { canvasId: string } }) {
    const roomId = (await params).canvasId;

    return (
        <CanvasComponent roomId={roomId} />
    )
}