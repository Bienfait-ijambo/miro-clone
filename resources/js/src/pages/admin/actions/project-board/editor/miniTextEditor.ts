import { ref } from "vue";
import { IMiniTextEditor } from "../miniTextEditorTypes";
import { miniTextEditorStore } from "../../../../../store/miniTextEditor";
import { useEditor } from "./editor";
import { yDocStore } from "../../../../../store/yDoc";

export function useDragMiniTextEditor() {
    const {
        applyBold,
        applyItalic,
        applyUnderline,
        applyTag,
        insertImage,
        applyAlignment,
        applyLink,
        applyUnOrderedList,
    } = useEditor();
    const miniTextEditor = ref<IMiniTextEditor[]>([] as IMiniTextEditor[]);
    let count = 0;

    let newX = 0,
    newY = 0,
    startX = 0,
    startY = 0;

let newMiniTextEditorHeight = 0,
    startRX = 0,
    startRY = 0;

let miniTextEditorStartwidth = 0,
    miniTextEditorStartHeight = 0;

    
    const yArrayMiniTextEditor = ref();

    const miniTextEditorHasEventSet = new Set<number>();

    function createMiniTextEditor() {
        count++;
        const color = getRandomColorClass();

        miniTextEditor.value.push({
            id: count,
            body: "",
            color: color,
            resizePosition: {
                x: 0,
                y: newMiniTextEditorHeight,
            },
            dragPosition: {
                x: 0,
                y: 0,
            },
        });


        yArrayMiniTextEditor.value.insert(0,[{
            id: count,
            body: "",
            color: color,
            resizePosition: {
                x: 0,
                y: newMiniTextEditorHeight,
            },
            dragPosition: {
                x: 0,
                y: 0,
            },
        }]);

        miniTextEditorStore.miniTextEditor.id = count;
        setTimeout(() => dragMiniTextEditor(count), 200);
    }

    function changeMiniTextEditorBodyContent(id:number){

        const miniTextEditorContent = document.querySelector(
            ".text-editor-body-" + id
        ) as HTMLElement;
        const index = miniTextEditor.value.findIndex((obj) => obj.id === id);

        miniTextEditorContent.addEventListener("keydown", function () {
            yDocStore.doc.transact(function () {
                const trackminiTextEditor = yArrayMiniTextEditor.value.get(index);

                if (trackminiTextEditor) {
                    trackminiTextEditor.body = miniTextEditorContent.textContent;
                }
                yArrayMiniTextEditor.value.delete(index);
                yArrayMiniTextEditor.value.insert(index, [trackminiTextEditor]);
            });
        });

    }

    function changeMiniTextEditorXYPosition(id: number) {
        const index = miniTextEditor.value.findIndex((obj) => obj.id === id);

        const x = (miniTextEditor.value[index].dragPosition.x = startX);
        const y = (miniTextEditor.value[index].dragPosition.y = startY);

        yDocStore.doc.transact(function () {
            const trackminiTextEditor = yArrayMiniTextEditor.value.get(index);

            if (trackminiTextEditor) {
                trackminiTextEditor.dragPosition.y = y;
                trackminiTextEditor.dragPosition.x = x;
            }
            yArrayMiniTextEditor.value.delete(index);
            yArrayMiniTextEditor.value.insert(index, [trackminiTextEditor]);
        });
    }

    function changeMiniTextEditorResizeXYPosition(id: number) {
        const index = miniTextEditor.value.findIndex((obj) => obj.id === id);

        // const x = (miniTextEditor.value[index].resizePosition.x = newResizeX);
        const y = (miniTextEditor.value[index].resizePosition.y = newMiniTextEditorHeight);

        yDocStore.doc.transact(function () {
            const trackminiTextEditor = yArrayMiniTextEditor.value.get(index);

            if (trackminiTextEditor) {
                trackminiTextEditor.resizePosition.y = y;
            }
            yArrayMiniTextEditor.value.delete(index);
            yArrayMiniTextEditor.value.insert(index, [trackminiTextEditor]);
        });
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

    function deleteMiniTextEditor(_miniTextEditor: IMiniTextEditor) {
       
        const index = miniTextEditor.value.findIndex(
            (obj) => obj.id === _miniTextEditor.id
        );
        miniTextEditor.value.splice(index, index);

        yArrayMiniTextEditor.value.delete(index);
    }

    function dragMiniTextEditor(id: number) {
        const miniTextEditor = document.querySelector(
            ".text-editor-" + id
        ) as HTMLElement;
        const miniTextEditorHandler = document.querySelector(
            ".text-editor-handler-" + id
        ) as HTMLElement;
        const miniTextEditorResizer = document.querySelector(
            ".text-editor-resizer-" + id
        ) as HTMLElement;

      

        // dragging
        // resizing

        //resizing
        miniTextEditorResizer.addEventListener("mousedown", function (e: any) {
            miniTextEditorStore.miniTextEditor.id = id;

            startRX = e.clientX;
            startRY = e.clientY;

            miniTextEditorStartwidth = miniTextEditor.offsetWidth;
            miniTextEditorStartHeight = miniTextEditor.offsetHeight;

            miniTextEditor.style.position = "absolute";

            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);

            function mouseMove(e: any) {
                const newWidth = miniTextEditorStartwidth + e.clientX - startRX;
                const newHeight =
                    miniTextEditorStartHeight + e.clientY - startRY;

                    newMiniTextEditorHeight=newHeight

                    changeMiniTextEditorResizeXYPosition(id);

                // miniTextEditor.style.width = Math.max(newWidth, 150) + "px";
                miniTextEditor.style.height = Math.max(newHeight, 100) + "px";
            }

            function mouseUp(e: any) {
                document.removeEventListener("mousemove", mouseMove);
            }
        });

        //dragging
        miniTextEditorHandler.addEventListener("mousedown", function (e: any) {
            miniTextEditorStore.miniTextEditor.id = id;

            startX = e.clientX;
            startY = e.clientY;

            miniTextEditor.style.position = "absolute";

            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);

            function mouseMove(e: any) {
                newX = startX - e.clientX;
                newY = startY - e.clientY;

                startX = e.clientX;
                startY = e.clientY;

                changeMiniTextEditorXYPosition(id);

                miniTextEditor.style.top =
                    miniTextEditor.offsetTop - newY + "px";
                miniTextEditor.style.left =
                    miniTextEditor.offsetLeft - newX + "px";
            }

            function mouseUp(e: any) {
                document.removeEventListener("mousemove", mouseMove);
            }
        });

        applyBold(id);
        applyItalic(id);
        applyUnderline(id);
        applyTag(id, "h1");
        applyTag(id, "h2");
        applyTag(id, "h3");
        applyAlignment(id, "left");
        applyAlignment(id, "right");
        applyAlignment(id, "center");
        applyUnOrderedList(id);
        applyLink(id);
        insertImage(id);
    }

    // return { dragminiTextEditor,createminiTextEditor ,miniTextEditor,deleteminiTextEditor};

    return {
        dragMiniTextEditor,
        createMiniTextEditor,
        deleteMiniTextEditor,
        miniTextEditor,
        yArrayMiniTextEditor,
      
        miniTextEditorHasEventSet,
        changeMiniTextEditorBodyContent,
    };
}
