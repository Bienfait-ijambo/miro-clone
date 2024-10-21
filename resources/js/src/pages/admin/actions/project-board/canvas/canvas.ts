import { IReplayDrawing, yDocStore } from "../../../../../store/yDoc";

export function useDrawOnCanvas() {
    function adjustCanvasSize( canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D ) {
        const ratio = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        // Scale the drawing context to handle higher resolution
        ctx.scale(ratio, ratio);
    }

    function drawGrid( canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D ) {
        console.log("drawing grid...");
        const gridSize = 40; // Size of each square in the grid
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Set the grid line style
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1;

        // Draw vertical lines
        for (let x = 0; x <= canvasWidth; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = 0; y <= canvasHeight; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
            ctx.stroke();
        }

        // Cache the grid as an image in localStorage
        const gridImageData = canvas.toDataURL();
        localStorage.setItem("cachedGrid", gridImageData);
    }

    function loadCachedGrid(
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D
    ) {
        const cachedGrid = localStorage.getItem("cachedGrid");

        if (cachedGrid) {
            console.log("load image..");
            const img = new Image();
            img.src = cachedGrid;
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        } else {
            console.log("draw grid");
            drawGrid(canvas, ctx);
        }
    }

    function trackMousePosition(canvas: HTMLCanvasElement, event: any) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    function replayDrawing() {
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        loadCachedGrid(canvas, ctx);
        yDocStore.arrayDrawing.forEach((path) => {
            ctx.strokeStyle = path[0]?.strokeStyle; // Set the stroke style from the first point
            ctx.beginPath();
            path.forEach((point) => {
                if (point.type === "start") {
                    ctx.moveTo(point.x, point.y); // Move to the start point
                } else if (point.type === "drawing") {
                    ctx.lineTo(point.x, point.y); // Draw lines to subsequent points
                }
            });
            ctx.lineWidth = 3;
            ctx.stroke(); // Stroke the path
            ctx.closePath(); // Close the path
        });
    }

    function drawOnCanvas() {
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        let drawing = false;
        let drawingPath = [] as Array<IReplayDrawing>;

        canvas.addEventListener("mousedown", function (event: any) {
            drawing = true;
            const mousePos = trackMousePosition(canvas, event);
            ctx.strokeStyle = "blue";
           
            ctx.beginPath();
            ctx.moveTo(mousePos.x, mousePos.y);
            drawingPath.push({
                x: mousePos.x,
                y: mousePos.y,
                type: "start",
                strokeStyle: ctx.strokeStyle,
            });
        });

        canvas.addEventListener("mousemove", function (event: any) {
            if (drawing) {
                const mousePos = trackMousePosition(canvas, event);
                ctx.strokeStyle = "blue";
                ctx.lineWidth = 3;
                ctx.lineTo(mousePos.x, mousePos.y);
                ctx.stroke();

                drawingPath.push({
                    x: mousePos.x,
                    y: mousePos.y,
                    type: "drawing",
                    strokeStyle: ctx.strokeStyle,
                });
            }
        });

        canvas.addEventListener("mouseup", function (event: any) {
            drawing = false;
            yDocStore.arrayDrawing.push(drawingPath);
            yDocStore.yArrayDrawing.insert(0, [drawingPath]);
            drawingPath = [];
            ctx.closePath();
        });

        canvas.addEventListener("mouseleave", function (event: any) {
            drawing = false;
        });

        adjustCanvasSize(canvas, ctx);
        loadCachedGrid(canvas, ctx);
    }
     
    function undo() {
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        let index = 0;
        if (index >= 0) {
            const drawingPath = yDocStore.yArrayDrawing.get(index);
            yDocStore.redoDrawingArray.push(drawingPath);

            yDocStore.yArrayDrawing.delete(index, 1);
            replayDrawing();
            loadCachedGrid(canvas, ctx);
        }
    }

    function redo() {
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        if (yDocStore.redoDrawingArray.length > 0) {
            const redo = yDocStore.redoDrawingArray.pop();

            yDocStore.yArrayDrawing.insert(0, [redo]);
            replayDrawing();
            loadCachedGrid(canvas, ctx);
        }
    }

    return { drawOnCanvas, replayDrawing, undo,redo };
}
