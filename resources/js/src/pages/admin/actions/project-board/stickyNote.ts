import { ref } from "vue";
import { IStickyNote } from "./stickyNoteTypes";
import { stickyNoteStore } from "../../../../store/stickyNote";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from 'y-indexeddb'

export function useDragStickyNote() {
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
    const stickyNote = ref<IStickyNote[]>([] as IStickyNote[]);
    let count = 0;

    const doc = ref()

    const yArrayStickyNote = ref();

    const stickyNoteHasEventSet = new Set();

     function initYjs() {
        console.log("...");
       
        doc.value = new Y.Doc();

        yArrayStickyNote.value = doc.value.getArray("y-array-sticky-notes");

        yArrayStickyNote.value.observe((event: any) => {
            // margin.value.left = yMap.value.get("margin-left");
            // console.log("ymap was modified");
            stickyNote.value = yArrayStickyNote.value.toArray();
            console.log(yArrayStickyNote.value.toArray())

            for (const item of   stickyNote.value ) {
                if (stickyNoteHasEventSet.has(item.id) === false) {
                    stickyNoteHasEventSet.add(item.id);
                    setTimeout(() => {
                       
                        dragStickyNote(item.id);
                        let stickyNote = document.querySelector(
                            ".sticky-note-" + item.id
                        ) as HTMLElement;
                        stickyNote.style.position="absolute"
                    
                        //add an event on each sticky note
                        
                    }, 2000);
                }
            }
        });


        const indexeddbProvider = new IndexeddbPersistence('count-demo', doc.value)
indexeddbProvider.whenSynced.then(() => {
  console.log('loaded data from indexed db')
})

        new WebsocketProvider("ws://localhost:1234", "my-room", doc.value);
        // pro.once('synced', () => {
        //     const allT=getAllTypes()
        //     console.log('all types',allT);
        // })
    }


    function getAllTypes(){
        const types:any=[]
        doc.value.share.forEach((value:any,key:any) => {
            types.push({key:key,value:value})
        });
        return types;
    }

    function changeStickyNoteXYPosition(id: number) {
        const index = stickyNote.value.findIndex((obj) => obj.id === id);

        const x = (stickyNote.value[index].dragPosition.x = startX);
        const y = (stickyNote.value[index].dragPosition.y = startY);

        doc.value.transact(function () {
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
                x: 0,
                y: 0,
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
                    x: 0,
                    y: 0,
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

                stickyNote.style.width = Math.max(newWidth, 150) + "px";
                stickyNote.style.height = Math.max(newHeight, 100) + "px";
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
        initYjs,
        deleteStickyNote,
    };
}
