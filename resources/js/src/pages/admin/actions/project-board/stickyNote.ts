import { ref } from "vue";
import { IStickyNote } from "./stickyNoteTypes";
import { stickyNoteStore } from "../../../../store/stickyNote";


export function useDragStickyNote() {


    const stickyNote=ref<IStickyNote[]>([] as IStickyNote[])
    let count=0
    

    function createStickyNote(){
   count++
   const color=getRandomColorClass()
   
        stickyNote.value.push({
            id:count,
            body:'',
            color:color,
            resizePosition:{
                x:0,
                y:0,
            },
            dragPosition:{
                x:0,
                y:0,
            }
        })

        stickyNoteStore.stickyNote.id=count
        setTimeout(()=>dragStickyNote(count),200)
      
    }

    function getRandomColorClass() {
        const colorClasses = ['bg-blue-300', 'bg-indigo-300', 'bg-yellow-300', 'bg-yellow-300']
        const randomIndex = Math.floor(Math.random() * colorClasses.length)
        return colorClasses[randomIndex]
      }


    function deleteStickyNote(stickyNote:IStickyNote){
        console.log('deleteStickyNote',stickyNote)
    }

   
 

    function dragStickyNote(id:number) {


        const stickyNote = document.querySelector( ".sticky-note-"+id ) as HTMLElement;
        const stickyNoteHandler = document.querySelector( ".sticky-note-handler-"+id ) as HTMLElement;
        const stickyNoteResizer = document.querySelector(
            ".sticky-note-resizer-"+id
        ) as HTMLElement;

        let newX = 0,
            newY = 0,
            startX = 0,
            startY = 0;

        let newRX = 0,
            newRY = 0,
            startRX = 0,
            startRY = 0;

        let stickyNoteStartwidth = 0,
            stickyNoteStartHeight = 0;

        // dragging
        // resizing

        //resizing
        stickyNoteResizer.addEventListener("mousedown", function (e: any) {
            stickyNoteStore.stickyNote.id=id

          
            
            startRX = e.clientX;
            startRY = e.clientY;

            stickyNoteStartwidth = stickyNote.offsetWidth;
            stickyNoteStartHeight = stickyNote.offsetHeight;

            stickyNote.style.position = "absolute";

            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);

            function mouseMove(e: any) {
                const newWidth = stickyNoteStartwidth + e.clientX - startRX;
                const newHeight = stickyNoteStartHeight + e.clientY - startRY;

                stickyNote.style.width = Math.max(newWidth, 150) + "px";
                stickyNote.style.height = Math.max(newHeight, 100) + "px";
            }

            function mouseUp(e: any) {
                document.removeEventListener("mousemove", mouseMove);
            }
        });

        //dragging
        stickyNoteHandler.addEventListener("mousedown", function (e: any) {

            stickyNoteStore.stickyNote.id=id
            
            startX = e.clientX;
            startY = e.clientY;

            stickyNote.style.position = "absolute";

            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);

            function mouseMove(e: any) {
                newX = startX - e.clientX;
                newY = startY - e.clientY;

                startX = e.clientX;
                startY = e.clientY;

                stickyNote.style.top = stickyNote.offsetTop - newY + "px";
                stickyNote.style.left = stickyNote.offsetLeft - newX + "px";
            }

            function mouseUp(e: any) {
                document.removeEventListener("mousemove", mouseMove);
            }
        });
    }

    return { dragStickyNote,createStickyNote ,stickyNote,deleteStickyNote};
}
