import { Behaviour, Vector3, GameEntity } from "@egret/engine";
import { component, Component } from "@egret/ecs";
import { MeshFilter, MeshRenderer, Mesh, MeshNeedUpdate } from "@egret/render";
import { MyEdgeInfo } from "./MyEdgeInfo";
import { EditCubeController } from "./EditCubeController";


// @hideFlag(HideFlag.Hide & HideFlag.HideInMenu|& HideFlag.DontSave)
@component()
export class EditEdge extends Component {

    public lastPosition: Vector3 = Vector3.create();
    public verticeID = 0;
    public targetEntity: GameEntity = null;
    public myEdgeInfo: MyEdgeInfo;


    public updatePoints(): void {

        const entity = this.entity as GameEntity;
        // console.log("this.entity.transform.localPosition", this.entity.transform.localPosition);
        let isChange: boolean = false;
        // if (this.lastPosition.equal(Vector3.ZERO)) {
        //     return;
        // }
        if (!entity.transform.localPosition.equal(this.lastPosition)) {
            // console.log("verticeID", this.verticeID, "位置发生变化");
            this.lastPosition.set(
                entity.transform.localPosition.x,
                entity.transform.localPosition.y,
                entity.transform.localPosition.z);

            isChange = true;
        }
        if (isChange === false) {
            return; // 若未发生变化则不更新
        }
        this.changeModelVertices()
    }

    public changeModelVertices() {
        // const entity = this.entity as GameEntity;
        // const meshFilter = this.targetEntity.getComponentInChildren(MeshFilter);
        // // const meshRenderer = this.targetEntity.getComponentInChildren(MeshRenderer);

        // const editCubeController = this.targetEntity.getComponent(EditCubeController);


        // const cubeMesh = meshFilter.mesh;



        // for (let i = 0; i < this.myVertInfo.vertIndex.length; i++) {
        //     const vertIndex = this.myVertInfo.vertIndex[i];
        //     // vertices[vertIndex] = this.myVertInfo.x;
        //     // vertices[vertIndex + 1] = this.myVertInfo.y;
        //     // vertices[vertIndex + 2] = this.myVertInfo.z;


        //     editCubeController.vertices[vertIndex] = entity.transform.localPosition.x;
        //     editCubeController.vertices[vertIndex + 1] = entity.transform.localPosition.y;
        //     editCubeController.vertices[vertIndex + 2] = entity.transform.localPosition.z;


        // }



        // // console.log("setAttribute");
        // // console.log("vertices", vertices);
        // cubeMesh.setAttribute(AttributeSemantics.POSITION, editCubeController.vertices);

        // // cubeMesh.needUpdate(MeshNeedUpdate.All);
        // //要update 才能显示
        // cubeMesh.needUpdate(MeshNeedUpdate.VertexBuffer);


    }

}