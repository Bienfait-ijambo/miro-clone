import { IMiniTextEditor } from "../miniTextEditorTypes";
import { miniTextEditorStore } from "../../../../../store/miniTextEditor";
import { useEditor } from "./editor";
import { ICursor, yDocStore } from "../../../../../store/yDoc";
import { __debounce, runFuncSequentially } from "../../../../../helper/util";

export function useDragMiniTextEditor() {
    const { initMiniTextEditor } = useEditor();

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

    const _modifyMiniTextEditor = __debounce(function ( fn: (...args: any[]) => void ) {
        fn();
    },1500);

    function getCursorPosition(
        editor: HTMLElement,
        cursor: HTMLElement
    ): ICursor {
        const selection = window.getSelection() as Selection;

        if (selection?.rangeCount > 0) {
            const range = selection.getRangeAt(0) as Range;
            const cloneRange = range.cloneRange();
            cloneRange.selectNodeContents(editor);
            cloneRange.setEnd(range.endContainer, range.endOffset);
            const cursorPosition = cloneRange.toString().length;

            const rect = range.getBoundingClientRect(); // Get the position of the cursor
            const editorRect = editor.getBoundingClientRect();

            const x = `${rect.left - editorRect.left}px`;
            const y = `${rect.bottom - editorRect.top + window.scrollY + 20}px`;

            return { cursorPosition, x, y };
        }
    }

    function moveCursorToPosition(editor: HTMLElement, position: number) {
        const selection = window.getSelection() as Selection;
        const range = document.createRange();

        let currentPos = 0;
        let node;

        // Iterate over child nodes to find the correct text node
        for (let i = 0; i < editor.childNodes.length; i++) {
            node = editor.childNodes[i];
            const nodeLength = (node.textContent as string).length;

            if (currentPos + nodeLength >= position) {
                // If it's a text node, set the cursor directly
                if (node.nodeType === Node.TEXT_NODE) {
                    range.setStart(node, position - currentPos);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // For element nodes, recursively go inside its child nodes to find the correct position
                    setCursorInsideElement(node, position - currentPos, range);
                }
                break;
            } else {
                currentPos += nodeLength;
            }
        }

        range.collapse(true); // Collapse the range to the start (move the cursor there)
        selection.removeAllRanges(); // Clear any existing selections
        selection.addRange(range); // Set the new range (moves the cursor)
        editor.focus(); // Ensure the contenteditable div has focus
    }

    // Helper function to set cursor inside nested elements
    function setCursorInsideElement(
        element: any,
        position: number,
        range: Range
    ) {
        for (let i = 0; i < element.childNodes.length; i++) {
            let child = element.childNodes[i];
            let length = (child.textContent as string).length;

            if (position <= length) {
                if (child.nodeType === Node.TEXT_NODE) {
                    range.setStart(child, position);
                } else {
                    setCursorInsideElement(child, position, range); // Recursive for nested elements
                }
                break;
            } else {
                position -= length;
            }
        }
    }

   
    function changeMiniTextEditorBodyContent(id: number) {
        const miniTextEditorContent = document.querySelector(
            ".text-editor-body-" + id
        ) as HTMLElement;
        const index = yDocStore.miniTextEditor.findIndex(
            (obj) => obj.id === id
        ); 
        
        miniTextEditorContent.addEventListener( "keydown", _changeMiniTextEditorContentOnEvent );
        miniTextEditorContent.addEventListener( "mouseup", _changeMiniTextEditorContentOnEvent );


        function _changeMiniTextEditorContentOnEvent() {
            const blinkingCursor = document.querySelector(
                ".blinking-cursor-" + id
            ) as HTMLElement;
            blinkingCursor.style.display = "block";
            const { cursorPosition, x, y } = getCursorPosition( miniTextEditorContent, blinkingCursor );

            yDocStore.cursor.cursorPosition = cursorPosition;
            yDocStore.cursor.x = x;
            yDocStore.cursor.y = y;
            yDocStore.yCursor.set("x", x);
            yDocStore.yCursor.set("y", y);

            function _changeMiniTextEditorContent() {
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

            const func1 = () => {
                return new Promise((resolve, reject) => {
                    yDocStore.cursor.cursorPosition = cursorPosition;
                    _changeMiniTextEditorContent();
                    resolve(null);
                });
            };

            const func2 = () => {
                return new Promise((resolve, reject) => {
                    console.log("change cursor......pos");
                    moveCursorToPosition(
                        miniTextEditorContent,
                        yDocStore.cursor.cursorPosition
                    );
                    resolve(null);
                });
            };

            function runner() {
                runFuncSequentially([func1, func2]).then(() => {
                    console.log("All functions completed in sequence.");
                });
            }

            _modifyMiniTextEditor(runner);
        }
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
        miniTextEditorResizer.addEventListener(
            "mousedown",
            function (e: MouseEvent) {
                miniTextEditorStore.miniTextEditor.id = id;

                startRX = e.clientX;
                startRY = e.clientY;

                miniTextEditorStartwidth = miniTextEditor.offsetWidth;
                miniTextEditorStartHeight = miniTextEditor.offsetHeight;

                miniTextEditor.style.position = "absolute";

                document.addEventListener("mousemove", mouseMove);
                document.addEventListener("mouseup", mouseUp);

                function mouseMove(e: MouseEvent) {
                    const newWidth =
                        miniTextEditorStartwidth + e.clientX - startRX;
                    const newHeight =
                        miniTextEditorStartHeight + e.clientY - startRY;

                    newMiniTextEditorHeight = newHeight;

                    changeMiniTextEditorResizeXYPosition(id);

                    miniTextEditor.style.height =
                        Math.max(newHeight, 100) + "px";
                }

                function mouseUp(e: MouseEvent) {
                    document.removeEventListener("mousemove", mouseMove);
                }
            }
        );

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

        initMiniTextEditor(id);
    }

    return {
        dragMiniTextEditor,
        createMiniTextEditor,
        deleteMiniTextEditor,

        miniTextEditorHasEventSet,
        changeMiniTextEditorBodyContent,
    };
}
