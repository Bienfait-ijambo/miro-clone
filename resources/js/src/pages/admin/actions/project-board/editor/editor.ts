import { yDocStore } from "../../../../../store/yDoc";

export function useEditor() {
    function initMiniTextEditor(id: number) {
        const toolbar = document.querySelector(".toolbar");

        toolbar?.addEventListener("click", function (e: any) {
            const btnName = e.target.getAttribute("data-name");
            const iconName = e.target.closest("svg");

            // short-circuit evaluation 
            const className =
                btnName || (iconName.getAttribute("data-name") as string);
            // apply-italic-1
          
            switch (className.trim()) {
                case "apply-italic-" + id:
                    applyItalic(id);
                    break;

                case "apply-bold-" + id:
                    applyBold(id);
                    break;

                case "apply-underline-" + id:
                    applyUnderline(id);
                    break;

                case "apply-h1-" + id:
                    applyTag(id, "h1");
                    break;

                case "apply-h2-" + id:
                    applyTag(id, "h2");
                    break;

                case "apply-h3-" + id:
                    break;
                case "apply-align-left-" + id:
                    console.log("apply....");
                    applyAlignment(id, "left");
                    break;

                case "apply-align-right-" + id:
                    applyAlignment(id, "right");
                    break;

                case "apply-align-center-" + id:
                    applyAlignment(id, "center");
                    break;

                case "apply-list-" + id:
                    applyUnOrderedList(id);
                    break;

                case "apply-link-" + id:
                    applyLink(id);
                    break;

                case "insert-image-" + id:
                    insertImage(id);
                    break;

                case "highlight-text-" + id:
                    hightLightText(id);
                    break;

                default:
                   
                    break;
            }
        });
    }

    function applyItalic(id: number) {
        const bold = document.querySelector(
            ".apply-italic-" + id
        ) as HTMLElement;
        const selection = window.getSelection() as Selection;

        // bold.addEventListener("click", function () {
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            const selectedText = range.cloneContents();
            const parentElement = range.commonAncestorContainer.parentElement;
            const isBold = parentElement?.closest("i");

            if (isBold) {
                //remove bold
                removeItalic(range);
                replicateTextFormating(id);
            } else {
                //add bold
                addItalic(range, selectedText);
                replicateTextFormating(id);
            }
            selection.removeAllRanges();
        // });

        function addItalic(range: Range, selectedText: DocumentFragment) {
            const italicText = document.createElement("i") as HTMLElement;
            italicText.appendChild(selectedText);
            range.deleteContents();
            range.insertNode(italicText);
        }

        function removeItalic(range: Range) {
            // <b>content</b>
            const parentElement =
                range.commonAncestorContainer.parentElement?.closest("i");
            const docFragment = document.createDocumentFragment();
            if (parentElement?.firstChild) {
                docFragment.appendChild(parentElement?.firstChild);
            }
            parentElement?.replaceWith(docFragment);
        }
    }

    function hightLightText(id: number) {
        const hightLightBtn = document.querySelector(
            ".apply-hightLightText-" + id
        ) as HTMLElement;

        // hightLightBtn.addEventListener("click", function () {
            const selection = document.getSelection() as Selection;
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            const selectedText = range.cloneContents();

            const parentElement = range.commonAncestorContainer.parentElement;
            const isHighLighted = parentElement?.closest("hl");

            if (isHighLighted) {
                //remove bold
                removeHightLight(range);
                replicateTextFormating(id);
            } else {
                //add bold
                AddhightLightText(range, selectedText);
                replicateTextFormating(id);
            }
            selection.removeAllRanges();
        // });

        function AddhightLightText(
            range: Range,
            selectedText: DocumentFragment
        ) {
            const hightLightText = document.createElement("hl") as HTMLElement;
            hightLightText.style.backgroundColor = "#fde047";
            hightLightText.style.color = "black";
            hightLightText.appendChild(selectedText);
            range.deleteContents();
            range.insertNode(hightLightText);
        }

        function removeHightLight(range: Range) {
            const parentElement =
                range.commonAncestorContainer.parentElement?.closest("hl");
            const docFragment = document.createDocumentFragment();
            if (parentElement?.firstChild) {
                docFragment.appendChild(parentElement?.firstChild);
            }
            parentElement?.replaceWith(docFragment);
        }
    }

    function replicateTextFormating(id: number) {
        const bodyContent = document.querySelector(
            ".text-editor-body-" + id
        ) as HTMLElement;
        const index = yDocStore.miniTextEditor.findIndex(
            (obj) => obj.id === id
        );

        yDocStore.miniTextEditor[index].body = bodyContent.innerHTML;

        yDocStore.doc.transact(function () {
            const trackminiTextEditor =
                yDocStore.yArrayMiniTextEditor.get(index);

            if (trackminiTextEditor) {
                trackminiTextEditor.body = bodyContent.innerHTML;
            }
            yDocStore.yArrayMiniTextEditor.delete(index);
            yDocStore.yArrayMiniTextEditor.insert(index, [trackminiTextEditor]);
        });
    }
    function applyBold(id: number) {
        const bold = document.querySelector(".apply-bold-" + id) as HTMLElement;
        const selection = window.getSelection() as Selection;

        bold.addEventListener("click", function () {
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            const selectedText = range.cloneContents();
            const parentElement = range.commonAncestorContainer.parentElement;
            const isBold = parentElement?.closest("b");

            if (isBold) {
                //remove bold
                removeBold(range);
                replicateTextFormating(id);
            } else {
                //add bold
                addBold(range, selectedText);
                replicateTextFormating(id);
            }

            selection.removeAllRanges();
        });

        function addBold(range: Range, selectedText: DocumentFragment) {
            const boldText = document.createElement("b") as HTMLElement;
            boldText.appendChild(selectedText);
            range.deleteContents();
            range.insertNode(boldText);
        }

        function removeBold(range: Range) {
            // <b>content</b>
            const parentElement =
                range.commonAncestorContainer.parentElement?.closest("b");
            const docFragment = document.createDocumentFragment();
            if (parentElement?.firstChild) {
                docFragment.appendChild(parentElement?.firstChild);
            }
            parentElement?.replaceWith(docFragment);
        }
    }

    function applyUnderline(id: number) {
    
        const selection = window.getSelection() as Selection;

            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            const selectedText = range.cloneContents();
            const parentElement = range.commonAncestorContainer.parentElement;
            const isBold = parentElement?.closest("u");

            if (isBold) {
                //remove bold
                removeUnderline(range);
                replicateTextFormating(id);
            } else {
                //add bold
                addUnderline(range, selectedText);
                replicateTextFormating(id);
            }
            selection.removeAllRanges();
        // });

        function addUnderline(range: Range, selectedText: DocumentFragment) {
            const underlineText = document.createElement("u") as HTMLElement;
            underlineText.appendChild(selectedText);
            range.deleteContents();
            range.insertNode(underlineText);
        }

        function removeUnderline(range: Range) {
            // <b>content</b>
            const parentElement =
                range.commonAncestorContainer.parentElement?.closest("u");
            const docFragment = document.createDocumentFragment();
            if (parentElement?.firstChild) {
                docFragment.appendChild(parentElement?.firstChild);
            }
            parentElement?.replaceWith(docFragment);
        }
    }

    function applyUnOrderedList(id: number) {
        const btnList = document.querySelector(
            `.apply-list-` + id
        ) as HTMLElement;
        const selection = window.getSelection() as Selection;

            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);

            const ul = document.createElement("ul") as HTMLElement;
            const li = document.createElement("li") as HTMLElement;
            ul.style.listStyle = "disc";
            ul.style.marginLeft = "15px";
            li.textContent = "";
            ul.appendChild(li);

            range.deleteContents();
            range.insertNode(ul);
            replicateTextFormating(id);
            //move the cursor after the ul tag
            range.setStartAfter(ul);
            range.setEndAfter(ul);
            selection.addRange(range);
            selection.removeAllRanges();
        // });
    }

    function applyLink(id: number) {
        const btnLink = document.querySelector(
            `.apply-link-` + id
        ) as HTMLElement;
        const selection = window.getSelection() as Selection;

            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            const selectedText = range.extractContents();

            const link = document.createElement("a") as HTMLElement;
            link.href = prompt("Enter URL :");
            link.style.color = "blue";
            link.style.textDecoration = "underline";
            link.appendChild(selectedText);
            range.insertNode(link);
            replicateTextFormating(id);

            selection.removeAllRanges();
        // });
    }

    function insertImage(id: number) {
        const imgBtn = document.querySelector(
            `.apply-image-` + id
        ) as HTMLElement;
        const selection = window.getSelection() as Selection;

            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);

            const img = document.createElement("img") as HTMLElement;
            img.src = prompt("Enter IMG URL :");
            img.alt = "image";
            img.style.width = "50%";
            //move the cursor after the img tag
            range.insertNode(img);
            range.setStartAfter(img);
            range.setEndAfter(img);
            selection.addRange(range);
            replicateTextFormating(id);

            selection.removeAllRanges();
        // });
    }

    function applyAlignment(id: number, alignment: string) {
        const alignmentBtn = document.querySelector(
            `.apply-align-${alignment}-` + id
        ) as HTMLElement;
        const selection = window.getSelection() as Selection;

        // alignmentBtn.addEventListener("click", function () {
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            const selectedText = range.extractContents();

            const alignText = document.createElement("div") as HTMLElement;
            if (alignment === "left") {
                alignText.style.textAlign = "left";
            } else if (alignment === "right") {
                alignText.style.textAlign = "right";
            } else if (alignment === "center") {
                alignText.style.textAlign = "center";
            }
            alignText.appendChild(selectedText);
            range.deleteContents();
            range.insertNode(alignText);
            replicateTextFormating(id);

            selection.removeAllRanges();
        // });
    }

    //h tags
    function applyTag(id: number, tagName: string) {
        const tag = document.querySelector(
            `.apply-${tagName}-` + id
        ) as HTMLElement;
        const selection = window.getSelection() as Selection;

        // tag.addEventListener("click", function () {
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            const selectedText = range.cloneContents();
            const parentElement = range.commonAncestorContainer.parentElement;
            const isBold = parentElement?.closest(tagName);

            if (isBold) {
                //remove bold
                removeTag(range);
            } else {
                //add bold
                addTag(range, selectedText, tagName);
            }
            selection.removeAllRanges();
        // });

        function addTag(
            range: Range,
            selectedText: DocumentFragment,
            tagName: string
        ) {
            const tagText = document.createElement(tagName) as HTMLElement;
            if (tagName === "h1") {
                tagText.style.fontSize = "26px";
            } else if (tagName === "h2") {
                tagText.style.fontSize = "22px";
            } else if (tagName === "h3") {
                tagText.style.fontSize = "18px";
            }
            tagText.appendChild(selectedText);

            range.deleteContents();
            range.insertNode(tagText);
            replicateTextFormating(id);
        }

        function removeTag(range: Range) {
            // <b>content</b>
            const parentElement =
                range.commonAncestorContainer.parentElement?.closest(tagName);
            const docFragment = document.createDocumentFragment();
            if (parentElement?.firstChild) {
                docFragment.appendChild(parentElement?.firstChild);
            }
            parentElement?.replaceWith(docFragment);
        }
    }

    return {
       
        initMiniTextEditor,
    };
}
