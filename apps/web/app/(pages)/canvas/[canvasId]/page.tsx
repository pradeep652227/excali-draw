import CanvasComponent from './CanvasComponent1';

type tCanvasParams = Promise<{ canvasId: string }>;

export default async function CanvasPage({ params }: { params: tCanvasParams }) {
    const { canvasId: roomId } = await params;
    return (
        <CanvasComponent roomId={roomId} />
    )
}