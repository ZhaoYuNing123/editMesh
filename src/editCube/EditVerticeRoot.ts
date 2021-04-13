import { Behaviour, GameEntity } from "@egret/engine";
import { component, Component } from "@egret/ecs";
import { hideFlag, HideFlag } from "@egret/core";

// @hideFlag(HideFlag.Hide | HideFlag.HideInMenu | HideFlag.DontSave)
@component()
export class EditVerticeRoot extends Component {

    public targetEditCube: GameEntity = null;

    // onStart() {
    //     this.entity.transform.position = this.targetEditCube.transform.position;

    // }

    // onUpdate() {
    //     // this.entity.transform.position = this.entity.transform.position;
    //     console.log("EditVerticeRoot onUpdate");

    //     this.entity.transform.position = this.targetEditCube.transform.position;

    //     // if (this.targetEditCube) {

    //     // }

    // }

    public updatePosition() {
        return
        (this.entity as GameEntity).transform.position = (this.targetEditCube as GameEntity).transform.position;
    }

}