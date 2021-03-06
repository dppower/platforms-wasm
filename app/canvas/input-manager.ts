import { Injectable, Inject } from "@angular/core";

import { Subject } from "rxjs/Subject";
import { TouchEventTypes, MultiTouch } from "./touch-utility";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../physics/constant-tokens";
import { Vec2, Vec2_T } from "../maths/vec2";

export interface KeyState {
    left: boolean,
    right: boolean,
    jump: boolean
}

export type KeyActions = keyof KeyState;

const InitialKeyState: KeyState = {
    left: false,
    right: false,
    jump: false
};

export interface PointerState {
    left: boolean;
    right: boolean;
    wheel: number;
    position: Vec2;
    delta: Vec2;
};

class InitialPointerState implements PointerState {
    left = false;
    right = false;
    wheel = 0;
    position = new Vec2();
    delta = new Vec2();
};

@Injectable()
export class InputManager {

    get canvas_aspect() {
        return this.canvas_aspect_;
    };

    get world_aspect() {
        return this.world_aspect_;
    };

    set canvas_aspect(value: number) {
        this.canvas_aspect_ = value;
    };

    get delta() {
        return this.current_pointer_state_.delta;
    };

    get position() {
        return this.current_pointer_state_.position;
    };

    get wheel() {
        return this.current_pointer_state_.wheel;
    };

    readonly touch_events = new Subject<MultiTouch>();

    private previous_key_state_: KeyState;
    private current_key_state_: KeyState;

    private previous_pointer_state_: PointerState;
    private current_pointer_state_: PointerState;

    private current_key_bindings_ = new Map<string, KeyActions>();

    private canvas_aspect_: number = 1.5;
    private world_aspect_: number;

    constructor(
        @Inject(WORLD_WIDTH) private world_width_: number,
        @Inject(WORLD_HEIGHT) private world_height_: number
    ) {
        this.world_aspect_ = this.world_width_ / this.world_height_;
        // Initialise state
        this.previous_key_state_ = Object.assign({}, InitialKeyState);
        this.current_key_state_ = Object.assign({}, InitialKeyState);
        this.previous_pointer_state_ = new InitialPointerState();
        this.current_pointer_state_ = new InitialPointerState();
        // set default key code bindings
        this.current_key_bindings_.set("KeyA", "left");
        this.current_key_bindings_.set("KeyD", "right");
        this.current_key_bindings_.set("Space", "jump");
    };

    canvasCoordsToWorldPosition(coordinates: Vec2_T) {
        if (this.canvas_aspect_ > this.world_aspect_) {
            let w = this.world_height_ * this.canvas_aspect_;
            let x = w * coordinates.x - (w - this.world_width_) / 2;
            return { x, y: coordinates.y * this.world_height_ }
        }
        else if (this.canvas_aspect_ < this.world_aspect_) {
            let h = this.world_width_ / this.canvas_aspect_
            let y = h * coordinates.y - (h - this.world_height_) / 2;
            return { x: coordinates.x * this.world_width_, y }
        }
        else {
            return { x: coordinates.x * this.world_width_, y: coordinates.y * this.world_height_ };
        }
    };

    setMousePosition(coordinates: Vec2_T) {
        let position = this.canvasCoordsToWorldPosition(coordinates);
        let current_delta = Vec2.subtract(position, this.previous_pointer_state_.position);
        this.current_pointer_state_.position.copy(position);
        this.current_pointer_state_.delta.copy(current_delta);
    };

    setWheelDirection(value: 1 | -1) {
        this.current_pointer_state_.wheel = value;
    };

    setKeyDown(key: string) {
        let code = this.parseKeyCode(key);
        let action = this.current_key_bindings_.get(code);
        if (action !== undefined) {
            this.current_key_state_[action] = true;
        }
    };

    setKeyUp(key: string) {
        let code = this.parseKeyCode(key);
        let action = this.current_key_bindings_.get(code);
        if (action !== undefined) {
            this.current_key_state_[action] = false;
        }
    };

    parseKeyCode(key_code: string) {
        let code = key_code;
        if (key_code === " ") {
            code = "Space";
        }
        else {
            let first = key_code.charAt(0);
            if (first !== "K" && first !== "S") {
                code = "Key" + key_code.toUpperCase();
            }
        }
        return code;
    };

    isKeyDown(action: KeyActions) {
        return this.current_key_state_[action];
    };

    wasKeyDown(action: KeyActions) {
        return this.previous_key_state_[action];
    };

    isKeyPressed(action: KeyActions) {
        if (this.isKeyDown(action) === true && this.wasKeyDown(action) === false) {
            return true;
        }
        return false;
    };

    wasKeyReleased(action: KeyActions) {
        if (this.isKeyDown(action) === false && this.wasKeyDown(action) === true) {
            return true;
        }
        return false;
    };

    setMouseButton(button: "left" | "right", state: boolean) {
        this.current_pointer_state_[button] = state;
    };

    isButtonDown(button: "left" | "right") {
        return this.current_pointer_state_[button];
    };

    wasButtonDown(button: "left" | "right") {
        return this.previous_pointer_state_[button];
    };

    isButtonPressed(button: "left" | "right") {
        if (this.isButtonDown(button) === true && this.wasButtonDown(button) === false) {
            return true;
        }
        return false;
    };

    wasButtonReleased(button: "left" | "right") {
        if (!this.isButtonDown(button) && this.wasButtonDown(button)) {
            return true;
        }
        return false;
    };

    updateInputStates(input_pointer: number) {
        this.copyInputsToHeap(input_pointer, this.previous_pointer_state_, this.previous_key_state_);
        this.copyInputsToHeap(input_pointer + 28, this.current_pointer_state_, this.current_key_state_);
    };

    copyInputsToHeap(offset: number, pointer_state: PointerState, key_state: KeyState) {
        let int_array = new Uint32Array(Module.HEAPU8.buffer, offset, 28);
        int_array[0] = +key_state.left;
        int_array[1] = +key_state.right;
        int_array[2] = +key_state.jump;
        int_array[3] = +pointer_state.left;
        int_array[4] = +pointer_state.right;
        let float_array = new Float32Array(Module.HEAPU8.buffer, offset, 28);
        float_array[5] = pointer_state.position.x;
        float_array[6] = pointer_state.position.y;
    };

    update() {
        // Reset inputs
        for (let input in this.current_key_state_) {
            this.previous_key_state_[input] = this.current_key_state_[input];
        }

        this.previous_pointer_state_["left"] = this.current_pointer_state_["left"];
        this.previous_pointer_state_["right"] = this.current_pointer_state_["right"];
        this.previous_pointer_state_["wheel"] = this.current_pointer_state_["wheel"];
        this.previous_pointer_state_["position"].copy(this.current_pointer_state_["position"]);
        this.previous_pointer_state_["delta"].copy(this.current_pointer_state_["delta"]);

        this.current_pointer_state_["delta"].setZero();
        this.current_pointer_state_.wheel = 0;
    };
}