import axios from 'axios';
import { ExistingShapes, Shapes } from "../constants";
import { apiBaseUrl } from '@/(utils)/config';
import { types } from '@repo/utils';

/*Event Listener Variables*/
let mouseDownHandler: ((e: MouseEvent) => void) | null = null;
let mouseUpHandler: ((e: MouseEvent) => void) | null = null;
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

/*Defaults*/
const strokeStyle = 'white';
const fillStyle = '#000';

export default async function initDraw(canvas: HTMLCanvasElement, roomId: string,
    socket: WebSocket | null, sendMessage: (message: any) => void, selectedTool: string) {

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

    if (earlyReturn) {
        console.log('((((( Early Returning )))))))')
        return;
    }

    fillRect(ctx, 0, 0, canvas.width, canvas.height); //initially fill the rectage with default color

    let isClicked = false;
    let startX = 0;
    let startY = 0;

    removeEventListeners(canvas);//remove the event listeners if any

    /*Add Fresh Event Listeners*/
    mouseDownHandler = (e: MouseEvent) => {
        isClicked = true;
        startX = e.clientX;
        startY = e.clientY;
    };

    mouseUpHandler = (e: MouseEvent) => {
        isClicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        let shapeObj = null;
        if (selectedTool == 'rect')
            shapeObj = {
                type: "rect",
                x: startX,
                y: startY,
                width,
                height
            }
        else if (selectedTool == 'line')
            shapeObj = {
                type: "line",
                startX,
                startY,
                endX: e.clientX,
                endY: e.clientY
            }
        else if (selectedTool == 'circle') {
            const radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
            const centerX = startX + width / 2;
            const centerY = startY + height / 2;
            shapeObj = {
                type: "circle",
                x: centerX,
                y: centerY,
                radius
            }
        }
        else {
            return;
        }
        ExistingShapes.push(shapeObj as types.Shape);

        const { type, ...shapeObjToSend } = shapeObj;
        //now send a web socket message to the server
        sendMessage({
            type: "shape",
            data: {
                type: shapeObj.type,
                roomId: parseInt(roomId),
                dimensions: JSON.stringify(shapeObjToSend)
            }
        });
    };

    mouseMoveHandler = (e: MouseEvent) => {
        if (!isClicked) return;
        clearCanvas(ctx, canvas);//clear the canvas and fill
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        if (selectedTool == 'rect') {
            ctx.strokeRect(startX, startY, width, height);
        } else if (selectedTool == 'line') {
            drawLine(ctx, startX, startY, e.clientX, e.clientY);
        } else if (selectedTool == 'circle') {
            const radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
            const centerX = startX + width / 2;
            const centerY = startY + height / 2;
            drawCircle(ctx, centerX, centerY, radius);
        }
    };

    canvas.addEventListener("mousedown", mouseDownHandler);
    canvas.addEventListener("mouseup", mouseUpHandler);
    canvas.addEventListener("mousemove", mouseMoveHandler);

}

/*Utility functions*/

function removeEventListeners(canvas: HTMLCanvasElement) {
    if (mouseDownHandler) canvas.removeEventListener("mousedown", mouseDownHandler);
    if (mouseUpHandler) canvas.removeEventListener("mouseup", mouseUpHandler);
    if (mouseMoveHandler) canvas.removeEventListener("mousemove", mouseMoveHandler);
}

function fillRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string = fillStyle) {
    ctx.fillStyle = color;
    ctx.strokeStyle = strokeStyle;  // or your intended default
    ctx.fillRect(x, y, width, height);
}

function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    console.log('Clearing canvas...');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fillRect(ctx, 0, 0, canvas.width, canvas.height);

    //now print the existing shapes
    ExistingShapes.forEach(shape => {
        const { type } = shape;
        if (type == 'rect') {
            const { x, y, width, height } = shape;
            ctx.strokeRect(x, y, width, height);
        } else if (type == 'line') {
            const { startX, startY, endX, endY } = shape;
            drawLine(ctx, startX, startY, endX, endY);
        } else if (type == 'circle') {
            const { x, y, radius } = shape;
            drawCircle(ctx, x, y, radius);
        }

    })
}

async function setOldShapes(roomId: string) {
    console.log('Setting old shapes...');
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

function drawLine(ctx: CanvasRenderingContext2D,
    startX: number, startY: number, endX: number, endY: number) {
        console.log('Drawing line...');
    // Start a new Path
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);

    // Draw the Path
    ctx.stroke();
}

function drawCircle(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) {
    ctx.strokeStyle = strokeStyle;  // or your intended default
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
}