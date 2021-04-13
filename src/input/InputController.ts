import { Behaviour, Application, Vector2, GameEntity, Vector3, ExecuteMode } from "@egret/engine";
import { IEntity, component, Matcher } from "@egret/ecs";
import { property, serializedField, EditType, getItemsFromEnum } from "@egret/core";
import { Input, InputManager, InputCode, Pointer, InputState } from "@egret/input";

// import { pointerMatcher } from "../../MatcherCreateItem";



export const pointerMatcher = Matcher.create(GameEntity, true, Pointer);

export enum InputType {
    MOUSE,
    KEYBOARD,
    TOUCH
}

export let inputController: InputController = null;

@component()
export class InputController extends Behaviour {

    //当前移动方向
    // public currentMoveVector: Vector2;

    @property(EditType.Enum, { listItems: getItemsFromEnum(InputType as any) })
    @serializedField
    public inputType: InputType = InputType.MOUSE;

    protected _application: Application = Application.instance;

    public _inputManager: InputManager;

    public keyW: Input;
    public keyA: Input;
    public keyS: Input;
    public keyD: Input;

    public keyLeft: Input;
    public keyRight: Input;
    public keyUp: Input;
    public keyDown: Input;

    public _leftMouseInput: Input;

    public space: Input;
    public isSpaceDown = false;




    public keyDelete: Input;


    onStart() {
        // this.inputType = InputType.KEYBOARD;

        // if (Application.instance.executeMode & CustomExecuteMode.GameSceneRunning_Server)
        //     return;
        this._application = Application.instance;

        this._inputManager = this._application.globalEntity.getComponent(InputManager);

        this.keyW = this._inputManager.getInput(InputCode.KeyW);
        this.keyA = this._inputManager.getInput(InputCode.KeyA);
        this.keyS = this._inputManager.getInput(InputCode.KeyS);
        this.keyD = this._inputManager.getInput(InputCode.KeyD);

        this.keyLeft = this._inputManager.getInput(InputCode.ArrowLeft);
        this.keyRight = this._inputManager.getInput(InputCode.ArrowRight);
        this.keyUp = this._inputManager.getInput(InputCode.ArrowUp);
        this.keyDown = this._inputManager.getInput(InputCode.ArrowDown);

        this.keyDelete = this._inputManager.getInput(InputCode.Delete);



        this._leftMouseInput = this._inputManager.getInput(InputCode.LeftMouse);
        this.space = this._inputManager.getInput(InputCode.Space);
        const inputManager = this._inputManager;
        // inputManager.onPointerDown.add(this._onTouchBegin, this);
        // inputManager.onPointerUp.add(this._onTouchEnd, this);

        inputController = this;
    }

    // onUpdate() {
    //     if (this.keyDelete.isUp) {
    //         console.error("this.keyDelete.isUp");
    //     }
    // }




    public getTotalPoints() {
        const pointers = Application.instance.gameEntityContext.getGroup(pointerMatcher).entities;
        return pointers;
    }

}
