import { IStickyNote } from "./stickyNoteTypes";
import { __debounce } from "../../../../../helper/util";
import { stickyNoteStore } from "../../../../../store/stickyNote";
import { yDocStore } from "../../../../../store/yDoc";

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
    let count = 0;

    const stickyNoteHasEventSet = new Set<number>();

    const _modifyStickyNote = __debounce(function (
        fn: (...args: any[]) => void
    ) {
        fn();
    },
    1000);

    function changeStickyNoteBodyContent(id: number) {
        const stickyNoteContent = document.querySelector(
            ".sticky-note-body-" + id
        ) as HTMLElement;
        const index = yDocStore.stickyNote.findIndex((obj) => obj.id === id);

        stickyNoteContent.addEventListener("keydown", function () {
            _modifyStickyNote(_changeStickyNoteContent);

            function _changeStickyNoteContent() {
                yDocStore.doc.transact(function () {
                    const trackStickyNote =
                        yDocStore.yArrayStickyNote.get(index);
                   

                    if (trackStickyNote) {
                        trackStickyNote.body =
                            stickyNoteContent.textContent as string;
                    }
                    yDocStore.yArrayStickyNote.delete(index);
                    yDocStore.yArrayStickyNote.insert(index, [trackStickyNote]);
                });
            }
        });
    }

    function changeStickyNoteResizeXYPosition(id: number) {
        const index = yDocStore.stickyNote.findIndex((obj) => obj.id === id);

        const x = (yDocStore.stickyNote[index].resizePosition.x = newResizeX);
        const y = (yDocStore.stickyNote[index].resizePosition.y = newResizeY);

        yDocStore.doc.transact(function () {
            const trackStickyNote = yDocStore.yArrayStickyNote.get(index);

            if (trackStickyNote) {
                trackStickyNote.resizePosition.y = y;
                trackStickyNote.resizePosition.x = x;
            }
            yDocStore.yArrayStickyNote.delete(index);
            yDocStore.yArrayStickyNote.insert(index, [trackStickyNote]);
        });
    }

    function changeStickyNoteXYPosition(id: number) {
        const index = yDocStore.stickyNote.findIndex((obj) => obj.id === id);

        const x = (yDocStore.stickyNote[index].dragPosition.x = startX);
        const y = (yDocStore.stickyNote[index].dragPosition.y = startY);

        yDocStore.doc.transact(function () {
            const trackStickyNote = yDocStore.yArrayStickyNote.get(index);

            if (trackStickyNote) {
                trackStickyNote.dragPosition.y = y;
                trackStickyNote.dragPosition.x = x;
            }
            yDocStore.yArrayStickyNote.delete(index);
            yDocStore.yArrayStickyNote.insert(index, [trackStickyNote]);
        });
    }

    function createStickyNote() {
        count++;
        const color = getRandomColorClass();

        yDocStore.stickyNote.push({
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

        yDocStore.yArrayStickyNote.insert(0, [
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
        const index = yDocStore.stickyNote.findIndex(
            (obj) => obj.id === _stickyNote.id
        );
        yDocStore.stickyNote.splice(index, index);

        yDocStore.yArrayStickyNote.delete(index);
    }

    function dragStickyNote(id: number) {
        const stickyNote = document.querySelector( ".sticky-note-" + id ) as HTMLElement;
        const stickyNoteHandler = document.querySelector(
            ".sticky-note-handler-" + id
        ) as HTMLElement;
        const stickyNoteResizer = document.querySelector(
            ".sticky-note-resizer-" + id
        ) as HTMLElement;

        console.log('dragging',id,'val :'+stickyNote)

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

    function changeStickyNoteColor(stickyNoteId: number, color: string) {
        for (let i = 0; i < yDocStore.stickyNote.length; i++) {
            if (yDocStore.stickyNote[i].id === stickyNoteId) {
                yDocStore.stickyNote[i].color = color;
            }
        }
    }

    return {
        dragStickyNote,
        createStickyNote,
        deleteStickyNote,
        changeStickyNoteColor,
        stickyNoteHasEventSet,
        changeStickyNoteBodyContent,
    };
}
