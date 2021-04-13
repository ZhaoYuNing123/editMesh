import { component, Component } from "@egret/ecs";
import { Vector3, GameEntity } from "@egret/engine";
import { Pool } from "@egret/basis";
import { MyTriangleInfo } from "./MyTriangleInfo";
@component()
export class EditTriangle extends Component {

    // public vector_a = [];
    // public vector_b = [];
    // public vector_c = [];

    public myTriangleInfo: MyTriangleInfo;
    public lastPosition: Vector3 = Vector3.create();

    // updatePoints() {
    //     this.myTriangleInfo.relatedPoint_a;
    //     this.myTriangleInfo.relatedPoint_b;
    //     this.myTriangleInfo.relatedPoint_c;

    // }

    private moveDirction: Vector3 = Vector3.create();

    public updatePoints(): boolean {

        Pool

        // console.log("EditTriangle updatePoints ");

        const entity = this.entity as GameEntity;
        // console.log("this.entity.transform.localPosition", this.entity.transform.localPosition);
        let isChange: boolean = false;
        // if (this.lastPosition.equal(Vector3.ZERO)) {
        //     return;


        // }
        if (!entity.transform.position.equal(this.lastPosition)) {
            this.moveDirction.set(
                entity.transform.position.x - this.lastPosition.x,
                entity.transform.position.y - this.lastPosition.y,
                entity.transform.position.z - this.lastPosition.z,

            )
            this.lastPosition.set(
                entity.transform.position.x,
                entity.transform.position.y,
                entity.transform.position.z);

            isChange = true;
        }
        if (isChange === false) {
            return isChange; // 若未发生变化则不更新
        }
        this.changeEditTriangle()

        return isChange;
    }

    public changeEditTriangle() {

        const verts = [
            this.myTriangleInfo.relatedPoint_a,
            this.myTriangleInfo.relatedPoint_b,
            this.myTriangleInfo.relatedPoint_c
        ]

        for (const vert of verts) {

            (vert.entity as GameEntity).transform.position.set(
                (vert.entity as GameEntity).transform.position.x + this.moveDirction.x,
                (vert.entity as GameEntity).transform.position.y + this.moveDirction.y,
                (vert.entity as GameEntity).transform.position.z + this.moveDirction.z,
            );
            (vert.entity as GameEntity).transform.position = (vert.entity as GameEntity).transform.position;
            // vert.myVertInfo.setPosition((vert.entity as GameEntity).transform.position);

            vert.updatePoints();
        }

        this.moveDirction.set(0, 0, 0);


    }



}