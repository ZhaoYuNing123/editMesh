import { Behaviour, Vector3, GameEntity, Application } from "@egret/engine";
import { component, Component } from "@egret/ecs";
import { MyVertInfo } from "./MyVertInfo";
import { hideFlag, HideFlag, property, EditType, serializedField } from "@egret/core";
import { EditCubeController } from "./EditCubeController";
import { Mesh, MeshFilter, MeshNeedUpdate } from "@egret/render";
import { AttributeSemantics } from "@egret/gltf";



// @hideFlag(HideFlag.Hide & HideFlag.HideInMenu|& HideFlag.DontSave)
// @hideFlag(HideFlag.Hide | HideFlag.HideInMenu | HideFlag.DontSave)
@component()
export class EditPoint extends Component {

    public lastPosition: Vector3 = Vector3.create();
    public verticeID = 0;
    public targetEntity: GameEntity = null;
    public myVertInfo: MyVertInfo;

    @property(EditType.Boolean)
    @serializedField
    public delete: boolean = false;




    public updatePoints() {


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
            return false; // 若未发生变化则不更新
        }
        this.changeModelVertices();
        return true;
    }

    public changeModelVertices() {
        const entity = this.entity as GameEntity;
        // const meshFilter = this.targetEntity.getComponentInChildren(MeshFilter);
        // const meshRenderer = this.targetEntity.getComponentInChildren(MeshRenderer);

        const editCubeController = this.targetEntity.getComponent(EditCubeController);

        // const cubeMesh = meshFilter.mesh;


        for (let i = 0; i < this.myVertInfo.vertIndex.length; i++) {
            const vertIndex = this.myVertInfo.vertIndex[i];
            editCubeController.vertices[vertIndex] = entity.transform.localPosition.x;
            editCubeController.vertices[vertIndex + 1] = entity.transform.localPosition.y;
            editCubeController.vertices[vertIndex + 2] = entity.transform.localPosition.z;
        }

        this.myVertInfo.setPosition(entity.transform.localPosition)

    }

    //TODO
    public deletePoint() {
        // for (const triangle of this.myVertInfo.relatedTriangle) {
        //     triangle.editTriangle.entity.getComponent(MeshRenderer).material = DefaultMaterials.MESH_BASIC
        // }
        // return


        const editCubeController = this.targetEntity.getComponent(EditCubeController);

        console.log(" this.myVertInfo.vertIndex", this.myVertInfo.vertIndex);
        // const vertIndex = this.myVertInfo.vertIndex.sort();
        const vertsIndex = this.myVertInfo.vertIndex;

        const vertices = [];
        const normal = [];
        const uv = [];

        const indices = []


        // for (let i = 0; i < this.myVertInfo.vertIndex.length; i++) {
        //     const vertIndex = this.myVertInfo.vertIndex[i];
        //     editCubeController.vertices[vertIndex] = 0;
        //     editCubeController.vertices[vertIndex + 1] = 0;
        //     editCubeController.vertices[vertIndex + 2] = 0;
        // }



        ////.......todo.......
        for (let i = 0; i < editCubeController.vertices.length; i++) {
            vertices.push(editCubeController.vertices[i])
        }

        for (let i = 0; i < editCubeController.normal.length; i++) {
            normal.push(editCubeController.normal[i])
        }

        for (let i = 0; i < editCubeController.uv.length; i++) {
            uv.push(editCubeController.uv[i])
        }

        for (let i = 0; i < editCubeController.indices.length; i++) {
            indices.push(editCubeController.indices[i])
        }

        for (let i = vertsIndex.length - 1; i >= 0; i--) {
            // const vertIndex = this.myVertInfo.vertIndex[i];
            //模型点清零
            // TODO 存储 删掉这些点
            // editCubeController.vertices.set([0, 0, 0, 0, 0, 0, 0, 0, 0], i * 9);
            const vertIndex = vertsIndex[i] / 3;
            vertices.splice(vertIndex * 3, 3)
            normal.splice(vertIndex * 3, 3)
            uv.splice(vertIndex * 2, 2)


            for (let index = 0; index < indices.length; index += 3) {

                if (indices[index] == vertIndex || indices[index + 1] == vertIndex || indices[index + 2] == vertIndex) {
                    console.log("删除相关indices", indices[index], indices[index + 1], indices[index + 2]);
                    indices.splice(index, 3);
                    for (let j = 0; j < indices.length; j++) {
                        if (indices[j] > vertIndex) {
                            console.log("修改indices", "j:", j, "index[j]", indices[j]);

                            indices[j]--;
                            console.log("修改后的index[j]", indices[j]);

                        }
                    }
                }
            }
        }

        const aa = [];
        for (let i = vertices.length; i < editCubeController.vertices.length; i++) {
            aa.push(0);
            // vertices.push(0)
        }

        const bb = [];
        for (let i = indices.length; i < editCubeController.indices.length; i++) {
            bb.push(0);
            // indices.push(0)
        }


        const cc = [];
        for (let i = uv.length; i < editCubeController.uv.length; i++) {
            cc.push(0);
            // vertices.push(0)
        }


        console.error("SET!!!");


        //todo 修改原来的mesh
        editCubeController.vertices.set(vertices)
        editCubeController.vertices.set(aa, vertices.length)

        editCubeController.indices.set(indices)
        // editCubeController.indices.set(bb, indices.length)

        editCubeController.normal.set(normal)
        // editCubeController.normal.set(aa, normal.length)

        editCubeController.uv.set(uv)
        // editCubeController.uv.set(cc, uv.length)

        //todo 修改原来的mesh
        const newMesh = Mesh.create(10000, 10000)
        newMesh.setAttribute(AttributeSemantics.POSITION, vertices.slice());
        newMesh.setAttribute(AttributeSemantics.NORMAL, normal.slice());
        newMesh.setAttribute(AttributeSemantics.TEXCOORD_0, uv.slice());
        newMesh.setIndices(indices.slice());
        editCubeController.entity.getComponent(MeshFilter).mesh = newMesh;
        newMesh.needUpdate(MeshNeedUpdate.All);

        //TODO 删除其他对象中记录的 线 面
        for (const edge of this.myVertInfo.relatedEdges) {
            //TODO 删掉
            if (edge.editEdge.entity && !edge.editEdge.entity.isDestroyed)
                edge.editEdge.entity.destroy();
        }

        for (const triangle of this.myVertInfo.relatedTriangle) {
            if (triangle.editTriangle.entity && !triangle.editTriangle.entity.isDestroyed)

                triangle.editTriangle.entity.destroy();
        }

        this.entity.destroy();

    }

}