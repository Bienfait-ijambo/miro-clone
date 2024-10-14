import { yDocStore } from "./../../../../../store/yDoc";
export function useShareUserCursor() {
    function trackMousePosition(event: any) {

        yDocStore.mousePosition.x = event.clientX;
        yDocStore.mousePosition.y = event.clientY;
        yDocStore.yCursor.set("x", event.clientX);
        yDocStore.yCursor.set("y", event.clientY);
    }

    return {
        trackMousePosition,
    };
}
