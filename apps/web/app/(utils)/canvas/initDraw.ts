import axios from 'axios';
import { ExistingShapes } from "../constants";
import { apiBaseUrl } from '@/(utils)/config';
import { types } from '@repo/utils';
export default async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket | null, sendMessage: (message: any) => void) {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    //get the old shapes
    await setOldShapes(roomId);

    clearCanvas(ctx, canvas);
    //on message from socket
    if (!socket) {
        console.error("Socket is not connected. Cannot listen for messages., socket = ", socket);
        return;
    }
    let earlyReturn = false;
    socket.onmessage = (message: MessageEvent<any>) => {
        try {
            const data = JSON.parse(message.data);
            console.log('📩 Received message:', data);
            const type = data.type;

            console.log(`🚀 ~ initDraw.ts:29 ~ initDraw ~ type:`, type)

            if (type == 'error') {
                earlyReturn = true;
                return;
            }

            if (data?.status && data?.type === 'shape' && data?.data) {
                const shapeData = data.data;
                const dimensions = JSON.parse(shapeData.dimensions);
                ExistingShapes.push({ type: shapeData.type, ...dimensions });
                clearCanvas(ctx, canvas);//clear the canvas and fill
            }
        } catch (err) {
            console.error('Failed to parse message:', err);
        }
    }

    if (earlyReturn){
        console.log('((((( Early Returning )))))))')
        return;
    }

    fillRect(ctx, 0, 0, canvas.width, canvas.height); //initially fill the rectage with default color

    let isClicked = false;
    let startX = 0;
    let startY = 0;
    canvas.addEventListener("mousedown", (e) => {
        isClicked = true;
        startX = e.clientX;
        startY = e.clientY;
    });
    canvas.addEventListener("mouseup", (e) => {
        isClicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        ExistingShapes.push({
            type: "rect",
            x: startX,
            y: startY,
            width,
            height
        });

        //now send a web socket message to the server
        sendMessage({
            type: "shape",
            data: {
                type: "rect",
                roomId: parseInt(roomId),
                dimensions: JSON.stringify({ x: startX, y: startY, width, height })
            }
        });


    });

    canvas.addEventListener("mousemove", (e) => {
        if (!isClicked) return;
        clearCanvas(ctx, canvas);//clear the canvas and fill
        /*Draw the existing Shape*/
        ctx.strokeStyle = "white";
        ctx.strokeRect(startX, startY, e.clientX - startX, e.clientY - startY);
    });
}


function fillRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string = "rgba(0, 0, 0, 0.5)") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fillRect(ctx, 0, 0, canvas.width, canvas.height);

    //now print the existing shapes
    ExistingShapes.forEach(shape => {
        ctx.strokeStyle = "white";
        if (shape.type == 'rect') {
            const { x, y, width, height } = shape;
            ctx.strokeRect(x, y, width, height);
        }

    })
}

async function setOldShapes(roomId: string) {

    try {

        const axiosResponse = await axios.get(`${apiBaseUrl}/api/v1/canvas/all-${parseInt(roomId.trim())}}`);
        const shapesData: types.ApiResponse = axiosResponse.data;
        if (shapesData.status) {
            const shapes = shapesData.data.shapes;
            if (shapes && shapes.length > 0) {
                shapes.forEach((shape: any) => {
                    const type = shape.type;
                    const dimensions = JSON.parse(shape.dimensions);
                    ExistingShapes.push({ type, ...dimensions });
                });
            }
        }

    } catch (error) {
        console.error('Error in setOldShapes:', error);
    }
}