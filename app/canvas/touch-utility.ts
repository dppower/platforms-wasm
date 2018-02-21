import { from } from "rxjs/observable/from";
import { mergeMap } from "rxjs/operators";

import { Vec2_T} from "../maths/vec2";

export type TouchEventTypes = "touchstart" | "touchend" | "touchmove" | "touchcancel";

export interface MultiTouch {
    type: TouchEventTypes,
    touches: {
        [identifier: number]: Vec2_T
    }
}

export interface SingleTouch {
    type: TouchEventTypes;
    identifier: string;    
    point: Vec2_T;
    timestamp?: number;
}

export const splitMultipleTouches = mergeMap((event: MultiTouch) => {
    let touches: SingleTouch[] = [];
    for (let id in event.touches) {
        let point = event.touches[id];
        let single_touch = { type: event.type, identifier: id, point: point };
        touches.push(single_touch);
    }
    return from(touches);
});