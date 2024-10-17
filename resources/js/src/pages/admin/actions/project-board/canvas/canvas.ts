import { yDocStore } from "../../../../../store/yDoc"


export function useDrawOnCanvas(){

  

    function trackMousePosition(canvas:HTMLCanvasElement,event:any){
        const rect=canvas.getBoundingClientRect()
        return {
            x:event.clientX-rect.left,
            y:event.clientY-rect.top
        }
    }

    function drawOnCanvas(){

        const canvas=document.querySelector('canvas') as HTMLCanvasElement
        const ctx=canvas.getContext('2d') as CanvasRenderingContext2D
        let drawing=false

        canvas.addEventListener('mousedown',function(event:any){
            drawing=true
            const mousePos=trackMousePosition(canvas,event)
            ctx.strokeStyle='blue'
            ctx.beginPath()
            ctx.moveTo(mousePos.x,mousePos.y)
            yDocStore.drawingArray.push({x:mousePos.x,y:mousePos.y,type:"start",strokeStyle:ctx.strokeStyle})
            yDocStore.yArrayDrawing.insert(0,[{x:mousePos.x,y:mousePos.y,type:"start",strokeStyle:ctx.strokeStyle}])

        })

        canvas.addEventListener('mousemove',function(event:any){
            if(drawing){

            const mousePos=trackMousePosition(canvas,event)
             ctx.strokeStyle='blue'
            ctx.lineTo(mousePos.x,mousePos.y)
            ctx.stroke()
            yDocStore.drawingArray.push({x:mousePos.x,y:mousePos.y,type:"drawing",strokeStyle:ctx.strokeStyle})
            yDocStore.yArrayDrawing.insert(0,[{x:mousePos.x,y:mousePos.y,type:"drawing",strokeStyle:ctx.strokeStyle}])


            }
            
        })

        canvas.addEventListener('mouseup',function(event:any){
           drawing=false
        })

        canvas.addEventListener('mouseleave',function(event:any){
            drawing=false
         })


    }


    return {drawOnCanvas}
}