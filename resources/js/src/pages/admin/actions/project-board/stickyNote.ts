import { ref } from "vue";
import { IStickyNote } from "./stickyNoteTypes";
import { stickyNoteStore } from "../../../../store/stickyNote";
import { yDocStore } from "../../../../store/yDoc";
import { __debounce } from "../../../../helper/util";

export function useDragStickyNote() {
    let newX = 0,
        newY = 0,
        startX = 0,
        startY = 0;

    //default width
    let newResizeX = 200,
        //default height
        newResizeY = 100,
        startRX = 0,
        startRY = 0;

    let stickyNoteStartwidth = 0,
        stickyNoteStartHeight = 0;
    const stickyNote = ref<IStickyNote[]>([] as IStickyNote[]);
    let count = 0;

    const yArrayStickyNote = ref();

    const stickyNoteHasEventSet = new Set<number>();


    
    const _modifyStickyNote=__debounce(function(fn:(...args: any[]) => void){
        fn()
        
    }, 1000);

    function changeStickyNoteBodyContent(id: number) {
        const stickyNoteContent = document.querySelector(
            ".sticky-note-body-" + id
        ) as HTMLElement;
        const index = stickyNote.value.findIndex((obj) => obj.id === id);

        stickyNoteContent.addEventListener("keydown", function () {

            _modifyStickyNote(_changeStickyNoteContent)
            
           function _changeStickyNoteContent(){
            yDocStore.doc.transact(function () {
                const trackStickyNote = yArrayStickyNote.value.get(index);

                if (trackStickyNote) {
                    trackStickyNote.body = stickyNoteContent.textContent;
                }
                yArrayStickyNote.value.delete(index);
                yArrayStickyNote.value.insert(index, [trackStickyNote]);
            });
           }
        });
    }

    function changeStickyNoteResizeXYPosition(id: number) {
        const index = stickyNote.value.findIndex((obj) => obj.id === id);

        const x = (stickyNote.value[index].resizePosition.x = newResizeX);
        const y = (stickyNote.value[index].resizePosition.y = newResizeY);

        yDocStore.doc.transact(function () {
            const trackStickyNote = yArrayStickyNote.value.get(index);

            if (trackStickyNote) {
                trackStickyNote.resizePosition.y = y;
                trackStickyNote.resizePosition.x = x;
            }
            yArrayStickyNote.value.delete(index);
            yArrayStickyNote.value.insert(index, [trackStickyNote]);
        });
    }

    function changeStickyNoteXYPosition(id: number) {
        const index = stickyNote.value.findIndex((obj) => obj.id === id);

        const x = (stickyNote.value[index].dragPosition.x = startX);
        const y = (stickyNote.value[index].dragPosition.y = startY);

        yDocStore.doc.transact(function () {
            const trackStickyNote = yArrayStickyNote.value.get(index);

            if (trackStickyNote) {
                trackStickyNote.dragPosition.y = y;
                trackStickyNote.dragPosition.x = x;
            }
            yArrayStickyNote.value.delete(index);
            yArrayStickyNote.value.insert(index, [trackStickyNote]);
        });
    }

    function createStickyNote() {
        count++;
        const color = getRandomColorClass();

        stickyNote.value.push({
            id: count,
            body: "",
            color: color,
            resizePosition: {
                x: newResizeX,
                y: newResizeY,
            },
            dragPosition: {
                x: 0,
                y: 0,
            },
        });

        yArrayStickyNote.value.insert(0, [
            {
                id: count,
                body: "",
                color: color,
                resizePosition: {
                    x: newResizeX,
                    y: newResizeY,
                },
                dragPosition: {
                    x: 0,
                    y: 0,
                },
            },
        ]);

        stickyNoteStore.stickyNote.id = count;

        setTimeout(() => dragStickyNote(count), 200);
    }

    function getRandomColorClass() {
        const colorClasses = [
            "bg-blue-300",
            "bg-indigo-300",
            "bg-yellow-300",
            "bg-yellow-300",
        ];
        const randomIndex = Math.floor(Math.random() * colorClasses.length);
        return colorClasses[randomIndex];
    }

    function deleteStickyNote(_stickyNote: IStickyNote) {
        const index = stickyNote.value.findIndex(
            (obj) => obj.id === _stickyNote.id
        );
        stickyNote.value.splice(index, index);

        yArrayStickyNote.value.delete(index);
    }

    function dragStickyNote(id: number) {
        const stickyNote = document.querySelector(
            ".sticky-note-" + id
        ) as HTMLElement;
        const stickyNoteHandler = document.querySelector(
            ".sticky-note-handler-" + id
        ) as HTMLElement;
        const stickyNoteResizer = document.querySelector(
            ".sticky-note-resizer-" + id
        ) as HTMLElement;

        // dragging
        // resizing

        //resizing
        stickyNoteResizer.addEventListener("mousedown", function (e: any) {
            stickyNoteStore.stickyNote.id = id;

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
                newResizeX = newWidth;
                newResizeY = newHeight;

                changeStickyNoteResizeXYPosition(id);

                stickyNote.style.width = Math.max(newWidth, newResizeX) + "px";
                stickyNote.style.height =
                    Math.max(newHeight, newResizeY) + "px";
            }

            function mouseUp(e: any) {
                document.removeEventListener("mousemove", mouseMove);
            }
        });

        //dragging
        stickyNoteHandler.addEventListener("mousedown", function (e: any) {
            stickyNoteStore.stickyNote.id = id;

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

                changeStickyNoteXYPosition(id);

                stickyNote.style.top = stickyNote.offsetTop - newY + "px";
                stickyNote.style.left = stickyNote.offsetLeft - newX + "px";
            }

            function mouseUp(e: any) {
                document.removeEventListener("mousemove", mouseMove);
            }
        });
    }

    return {
        dragStickyNote,
        createStickyNote,
        stickyNote,

        deleteStickyNote,

        yArrayStickyNote,

        stickyNoteHasEventSet,
        changeStickyNoteBodyContent,
    };
}
