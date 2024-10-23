import { ref } from "vue";
import { __debounce } from "../../../../../helper/util";
import { ITextCaption } from "./textCaptionTypes";
import { yDocStore } from "../../../../../store/yDoc";
import { textCaptionStore } from "../../../../../store/textCaption";

export function useDragTextCaption() {
    let newX = 0,
        newY = 0,
        startX = 0,
        startY = 0;

    //default width
    let newResizeX = 200,
        //default height
        newResizeY = 70,
        startRX = 0,
        startRY = 0;

    let textCaptionStartwidth = 0,
        textCaptionStartHeight = 0;
    const textCaption = ref<ITextCaption[]>([] as ITextCaption[]);
    let count = 0;

    const yArrayTextCaption = ref();

    const textCaptionHasEventSet = new Set<number>();


    
    const _modifyTextCaption=__debounce(function(fn:(...args: any[]) => void){
        fn()
        
    }, 1000);

    function changeTextCaptionBodyContent(id: number) {
        const textCaptionContent = document.querySelector(
            ".text-caption-body-" + id
        ) as HTMLElement;
        const index = textCaption.value.findIndex((obj) => obj.id === id);

        textCaptionContent.addEventListener("keydown", function () {

            _modifyTextCaption(_changeTextCaptionContent)
            
           function _changeTextCaptionContent(){
            yDocStore.doc.transact(function () {
                const trackTextCaption = yArrayTextCaption.value.get(index);

                if (trackTextCaption) {
                    trackTextCaption.body = textCaptionContent.textContent;
                }
                yArrayTextCaption.value.delete(index);
                yArrayTextCaption.value.insert(index, [trackTextCaption]);
            });
           }
        });
    }

    function changeTextCaptionResizeXYPosition(id: number) {
        const index = textCaption.value.findIndex((obj) => obj.id === id);

        const x = (textCaption.value[index].resizePosition.x = newResizeX);
        const y = (textCaption.value[index].resizePosition.y = newResizeY);

        yDocStore.doc.transact(function () {
            const trackTextCaption = yArrayTextCaption.value.get(index);

            if (trackTextCaption) {
                trackTextCaption.resizePosition.y = y;
                trackTextCaption.resizePosition.x = x;
            }
            yArrayTextCaption.value.delete(index);
            yArrayTextCaption.value.insert(index, [trackTextCaption]);
        });
    }

    function changeTextCaptionXYPosition(id: number) {
        const index = textCaption.value.findIndex((obj) => obj.id === id);

        const x = (textCaption.value[index].dragPosition.x = startX);
        const y = (textCaption.value[index].dragPosition.y = startY);

        yDocStore.doc.transact(function () {
            const trackTextCaption = yArrayTextCaption.value.get(index);

            if (trackTextCaption) {
                trackTextCaption.dragPosition.y = y;
                trackTextCaption.dragPosition.x = x;
            }
            yArrayTextCaption.value.delete(index);
            yArrayTextCaption.value.insert(index, [trackTextCaption]);
        });
    }

    function createTextCaption() {
        count++;
        const color = getRandomColorClass();

        textCaption.value.push({
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

        yArrayTextCaption.value.insert(0, [
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

        textCaptionStore.textCaption.id = count;

        setTimeout(() => dragTextCaption(count), 200);
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

    function deleteTextCaption(_textCaption: ITextCaption) {
        const index = textCaption.value.findIndex(
            (obj) => obj.id === _textCaption.id
        );
        textCaption.value.splice(index, index);

        yArrayTextCaption.value.delete(index);
    }

    function dragTextCaption(id: number) {
        const textCaption = document.querySelector(
            ".text-caption-" + id
        ) as HTMLElement;
        const textCaptionHandler = document.querySelector(
            ".text-caption-handler-" + id
        ) as HTMLElement;
        const textCaptionResizer = document.querySelector(
            ".text-caption-resizer-" + id
        ) as HTMLElement;

        // dragging
        // resizing

        //resizing
        textCaptionResizer.addEventListener("mousedown", function (e: any) {
            textCaptionStore.textCaption.id = id;

            startRX = e.clientX;
            startRY = e.clientY;

            textCaptionStartwidth = textCaption.offsetWidth;
            textCaptionStartHeight = textCaption.offsetHeight;

            textCaption.style.position = "absolute";

            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);

            function mouseMove(e: any) {
                const newWidth = textCaptionStartwidth + e.clientX - startRX;
                // const newHeight = textCaptionStartHeight + e.clientY - startRY;
                newResizeX = newWidth;
                // newResizeY = newHeight;

                changeTextCaptionResizeXYPosition(id);

                textCaption.style.width = Math.max(newWidth, newResizeX) + "px";
                // textCaption.style.height =
                //     Math.max(newHeight, newResizeY) + "px";
            }

            function mouseUp(e: any) {
                document.removeEventListener("mousemove", mouseMove);
            }
        });

        //dragging
        textCaptionHandler.addEventListener("mousedown", function (e: any) {
            textCaptionStore.textCaption.id = id;

            startX = e.clientX;
            startY = e.clientY;

            textCaption.style.position = "absolute";

            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);

            function mouseMove(e: any) {
                newX = startX - e.clientX;
                newY = startY - e.clientY;

                startX = e.clientX;
                startY = e.clientY;

                changeTextCaptionXYPosition(id);

                textCaption.style.top = textCaption.offsetTop - newY + "px";
                textCaption.style.left = textCaption.offsetLeft - newX + "px";
            }

            function mouseUp(e: any) {
                document.removeEventListener("mousemove", mouseMove);
            }
        });
    }

    return {
        dragTextCaption,
        createTextCaption,
        textCaption,

        deleteTextCaption,

        yArrayTextCaption,

        textCaptionHasEventSet,
        changeTextCaptionBodyContent,
    };
}
