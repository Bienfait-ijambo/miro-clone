import { ref } from "vue";
import { IMiniTextEditor } from "../miniTextEditorTypes";
import { miniTextEditorStore } from "../../../../../store/miniTextEditor";
import { useEditor } from "./editor";

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

    function createMiniTextEditor() {
        count++;
        const color = getRandomColorClass();

        miniTextEditor.value.push({
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

        miniTextEditorStore.miniTextEditor.id = count;
        setTimeout(() => dragMiniTextEditor(count), 200);
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

    function deleteMiniTextEditor(miniTextEditor: IMiniTextEditor) {
        console.log("deleteMiniTextEditor", miniTextEditor);
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

        let newX = 0,
            newY = 0,
            startX = 0,
            startY = 0;

        let newRX = 0,
            newRY = 0,
            startRX = 0,
            startRY = 0;

        let miniTextEditorStartwidth = 0,
            miniTextEditorStartHeight = 0;

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
    };
}
