'use client';

/*External Imports*/
import React, { useEffect, useRef } from "react";

export default function CanvasPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        fillRect(ctx, 0, 0, canvas.width, canvas.height);

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
        });

        canvas.addEventListener("mousemove", (e) => {
            if (!isClicked) return;
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            fillRect(ctx, 0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "white";
            ctx.strokeRect(startX, startY, width, height);
        });
    }, [canvasRef])
    return (<div id="canvas-container" className="w-screen h-screen">
        <canvas
            ref={canvasRef}
            id="canvas"
            className="w-full h-full"
        ></canvas>
    </div>);

    function fillRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string = "rgba(0, 0, 0, 0.5)") {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

}