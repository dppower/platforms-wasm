import { Injectable } from "@angular/core";

import { Vec2, Vec2_T } from "../maths/vec2";

export interface InputState {
    forward: boolean,
    back: boolean,
    left: boolean,
    right: boolean,
    jump: boolean,
    action_1: boolean,
    action_2: boolean,
    action_3: boolean,
    action_4: boolean,
    action_5: boolean,
    display_menu: boolean
}

export type InputTypes = keyof InputState;

const InitialInputState: InputState = {
    forward: false,
    back: false,
    left: false,
    right: false,
    jump: false,
    action_1: false,
    action_2: false,
    action_3: false,
    action_4: false,
    action_5: false,
    display_menu: false
};

export interface PointerState {
    left: boolean;
    right: boolean;
    wheel: number;
    position: Vec2;
    delta: Vec2;
};

const InitialPointerState: PointerState = {
    left: false,
    right: false,
    wheel: 0,
    position: new Vec2(),
    delta: new Vec2()
};

@Injectable()
export class InputManager {

    get aspect() {
        return this.current_aspect_ratio_ || 1.5;
    };

    set aspect(value: number) {
        this.current_aspect_ratio_ = value;
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

    private previous_key_state_: InputState;
    private current_key_state_: InputState;

    private previous_pointer_state_: PointerState;
    private current_pointer_state_: PointerState;

    private current_key_bindings_ = new Map<string, InputTypes>();

    private current_aspect_ratio_: number;

    constructor() {
        // Initialise state
        this.previous_key_state_ = Object.assign({}, InitialInputState);
        this.current_key_state_ = Object.assign({}, InitialInputState);
        this.previous_pointer_state_ = Object.assign({}, InitialPointerState);
        this.current_pointer_state_ = Object.assign({}, InitialPointerState);
        // set default key code bindings
        this.current_key_bindings_.set("KeyW", "forward");
        this.current_key_bindings_.set("KeyS", "back");
        this.current_key_bindings_.set("KeyA", "left");
        this.current_key_bindings_.set("KeyD", "right");
        this.current_key_bindings_.set("Space", "jump");
        this.current_key_bindings_.set("Digit1", "action_1");
        this.current_key_bindings_.set("Digit2", "action_2");
        this.current_key_bindings_.set("Digit3", "action_3");
        this.current_key_bindings_.set("Digit4", "action_4");
        this.current_key_bindings_.set("Digit5", "action_5");
        this.current_key_bindings_.set("Escape", "display_menu");
    };

    setMousePosition(position: Vec2_T) {
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
        if (action != undefined) {
            this.current_key_state_[action] = true;
        }
    };

    setKeyUp(key: string) {
        let code = this.parseKeyCode(key);
        let action = this.current_key_bindings_.get(code);
        if (action != undefined) {
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

    isKeyDown(action: InputTypes) {
        return this.current_key_state_[action];
    };

    wasKeyDown(action: InputTypes) {
        return this.previous_key_state_[action];
    };

    isKeyPressed(action: InputTypes) {
        if (this.isKeyDown(action) === true && this.wasKeyDown(action) === false) {
            return true;
        }
        return false;
    };

    wasKeyReleased(action: InputTypes) {
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