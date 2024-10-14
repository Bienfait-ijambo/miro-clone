import { ref } from "vue";
import { IMiniTextEditor } from "../miniTextEditorTypes";
import { miniTextEditorStore } from "../../../../../store/miniTextEditor";
import { useEditor } from "./editor";
import { yDocStore } from "../../../../../store/yDoc";
import { __debounce } from "../../../../../helper/util";

export function useDragMiniTextEditor() {
    const {
       
        initMiniTextEditor
    } = useEditor();

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

    
    const miniTextEditorHasEventSet = new Set<number>();

    function createMiniTextEditor() {
        count++;
        const color = getRandomColorClass();

        yDocStore.miniTextEditor.push({
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

        yDocStore.yArrayMiniTextEditor.insert(0, [
            {
                id: count,
                body: " ",
                color: color,
                resizePosition: {
                    x: 0,
                    y: newMiniTextEditorHeight,
                },
                dragPosition: {
                    x: 0,
                    y: 0,
                },
            },
        ]);

        miniTextEditorStore.miniTextEditor.id = count;
        setTimeout(() => dragMiniTextEditor(count), 200);
    }


    const _modifyMiniTextEditor= __debounce(function(fn:(...args: any[]) => void){
            fn()
    }, 2000);
  

    function getCursorPosition(editor:HTMLElement){
        const selection=window.getSelection() as Selection;
        
        if(selection?.rangeCount>0){
            const range=selection.getRangeAt(0) as Range
            const cloneRange=range.cloneRange()
            cloneRange.selectNodeContents(editor)
            cloneRange.setEnd(range.endContainer,range.endOffset)
            const cursorPosition=cloneRange.toString().length
            return cursorPosition

            
        }
    }
  
    

   
    


    function changeMiniTextEditorBodyContent(id: number) {
        const miniTextEditorContent = document.querySelector(
            ".text-editor-body-" + id
        ) as HTMLElement;
        const index = yDocStore.miniTextEditor.findIndex(
            (obj) => obj.id === id
        );

        miniTextEditorContent.addEventListener("keydown", function () {

            const cursorPos=getCursorPosition(miniTextEditorContent)
            console.log(cursorPos)

            _modifyMiniTextEditor(_changeMiniTextEditorContent)

            function _changeMiniTextEditorContent(){
            
                yDocStore.doc.transact(function () {
                    const trackminiTextEditor =
                        yDocStore.yArrayMiniTextEditor.get(index);

                    if (trackminiTextEditor) {
                        trackminiTextEditor.body =
                            miniTextEditorContent.innerHTML as string;
                        
                    }
                    yDocStore.yArrayMiniTextEditor.delete(index);
                    yDocStore.yArrayMiniTextEditor.insert(index, [
                        trackminiTextEditor,
                    ]);
                });
            
            }

          


            
            
        });
    }

    function changeMiniTextEditorXYPosition(id: number) {
        const index = yDocStore.miniTextEditor.findIndex(
            (obj) => obj.id === id
        );

        const x = (yDocStore.miniTextEditor[index].dragPosition.x = startX);
        const y = (yDocStore.miniTextEditor[index].dragPosition.y = startY);

        yDocStore.doc.transact(function () {
            const trackminiTextEditor =
                yDocStore.yArrayMiniTextEditor.get(index);

            if (trackminiTextEditor) {
                trackminiTextEditor.dragPosition.y = y;
                trackminiTextEditor.dragPosition.x = x;
            }
            yDocStore.yArrayMiniTextEditor.delete(index);
            yDocStore.yArrayMiniTextEditor.insert(index, [trackminiTextEditor]);
        });
    }

    function changeMiniTextEditorResizeXYPosition(id: number) {
        const index = yDocStore.miniTextEditor.findIndex(
            (obj) => obj.id === id
        );

        // const x = (yDocStore.miniTextEditor[index].resizePosition.x = newResizeX);
        const y = (yDocStore.miniTextEditor[index].resizePosition.y =
            newMiniTextEditorHeight);

        yDocStore.doc.transact(function () {
            const trackminiTextEditor =
                yDocStore.yArrayMiniTextEditor.get(index);

            if (trackminiTextEditor) {
                trackminiTextEditor.resizePosition.y = y;
            }
            yDocStore.yArrayMiniTextEditor.delete(index);
            yDocStore.yArrayMiniTextEditor.insert(index, [trackminiTextEditor]);
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
        const index = yDocStore.miniTextEditor.findIndex(
            (obj) => obj.id === _miniTextEditor.id
        );
        yDocStore.miniTextEditor.splice(index, index);

        yDocStore.yArrayMiniTextEditor.delete(index);
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
        miniTextEditorResizer.addEventListener("mousedown", function (e:MouseEvent) {
            miniTextEditorStore.miniTextEditor.id = id;

            startRX = e.clientX;
            startRY = e.clientY;

            miniTextEditorStartwidth = miniTextEditor.offsetWidth;
            miniTextEditorStartHeight = miniTextEditor.offsetHeight;

            miniTextEditor.style.position = "absolute";

            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);

            function mouseMove(e: MouseEvent) {
                const newWidth = miniTextEditorStartwidth + e.clientX - startRX;
                const newHeight =
                    miniTextEditorStartHeight + e.clientY - startRY;

                newMiniTextEditorHeight = newHeight;

                changeMiniTextEditorResizeXYPosition(id);

                miniTextEditor.style.height = Math.max(newHeight, 100) + "px";
            }

            function mouseUp(e: MouseEvent) {
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

       
        initMiniTextEditor(id)
    }

    return {
        dragMiniTextEditor,
        createMiniTextEditor,
        deleteMiniTextEditor,

        miniTextEditorHasEventSet,
        changeMiniTextEditorBodyContent,
    };
}
