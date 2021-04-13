import { System, system, Matcher, IGroup, Entity, entity } from "@egret/ecs";
import { ExecuteMode, GameEntity, Application, Const } from "@egret/engine";
import { EditCubeController } from "./EditCubeController";
import { EditPoint } from "./EditPoint";
import { ResourceManager } from "@egret/core";
import { EventType, Picked, Selected } from "@egret/editor";
import { EditVerticeRoot } from "./EditVerticeRoot";
import { EditTriangle } from "./EditTriangle";
import { EditEdge } from "./EditEdge";
import { MeshFilter, MeshNeedUpdate } from "@egret/render";
import { AttributeSemantics } from "@egret/gltf";
import { inputController } from "../input/InputController";

export enum EditType {
    None = "None",
    Vertex = "Vertex",
    Edge = "Edge",
    Face = "Face",
    // Polygon,
    Element = "Element"
}

// @system({ allOfExecuteMode: ExecuteMode.Editor })
@system({ anyOfExecuteMode: ExecuteMode.Running })
export class EditCubeSystem extends System {

    // public meshDataRoot: string = "model_data/";
    // public meshName: string = "cubeMeshInfo"
    getMatchers() {
        return [
            Matcher.create(GameEntity, true, EditCubeController),
            Matcher.create(GameEntity, true, EditPoint),
            Matcher.create(GameEntity, false, EditVerticeRoot),
            Matcher.create(GameEntity, true, EditTriangle),

            Matcher.create(GameEntity, true, Selected),



        ]
    }



    async onStart() {
        // const url = this.meshDataRoot + this.meshName;
        // const modelData = await ResourceManager.instance.loadUri(url);
        // console.log("modelData", modelData);


    }

    // public testModelUrl = "modelData/test111"

    // /**
    //  * 根据路径保存数据文件
    //  */
    // public saveAssets(content: any, uri: string) {
    //     const signal = Application.instance.signals.getSignal<[any, string]>(EventType.GenerateGpuAnimationAsset)!;
    //     signal.dispatch(content, uri);
    // }


    public selectedEntity: GameEntity = null;

    public editType: EditType = EditType.None;

    onEntityAdded(entity: GameEntity, group: IGroup) {

        const { groups } = this;
        if (group === groups[0]) {
            // this.saveAssets("111111111", this.testModelUrl)
            entity.getComponent(EditCubeController).createVerticesEntities();
        }

        if (entity.getComponent(Selected)) {

            this.selectedEntity = entity;
            if (entity.getComponent(EditPoint)) {
                this.editType = EditType.Vertex;
            } else if (entity.getComponent(EditEdge)) {
                this.editType = EditType.Edge;

            } else if (entity.getComponent(EditTriangle)) {
                this.editType = EditType.Face;
            } else {
                this.editType = EditType.None;
            }

            console.log("收集到 Selected 选中物体", this.editType);
        }
    }




    onEntityRemoved(entity: GameEntity, group: IGroup) {
        // const { groups } = this;
        // if (group === groups[0]) {
        //     entity.getComponent(EditCubeController).clearVerticesEntities();
        // }

        const { groups } = this;
        if (group === groups[2]) {
            // entity.getComponent(EditCubeController).clearVerticesEntities();
            console.log("destroy EditVerticeRoot");
            entity.destroy();
        } if (group === groups[0]) {
            for (const editVerticeRoot of this.groups[2].entities) {
                editVerticeRoot.destroy();
            }
        }

    }


    reDrawEdge() {
        const editCubes = this.groups[0].entities;
        for (const editCube of editCubes) {
            const editCubeController = editCube.getComponent(EditCubeController);
            editCubeController.reDrawEdge();
        }
    }

    onFrame() {
        //移动位置
        const editVerticeRoots = this.groups[2].entities as GameEntity[];

        for (const editVerticeRoot of editVerticeRoots) {
            editVerticeRoot.getComponent(EditVerticeRoot).updatePosition();
        }

        //只更新选中的点

        let hasChange = false;
        switch (this.editType) {
            case EditType.Vertex:
                //TODO 面的mesh 更新
                //TODO 删除后找不到的问题
                const editPoint = this.selectedEntity.getComponent(EditPoint);
                hasChange = editPoint.updatePoints();

                //TODO 编辑模式监听不到。。。
                if (inputController.keyDelete.isUp) {
                    editPoint.deletePoint();
                    hasChange = true;
                };
                if (editPoint.delete) {
                    editPoint.deletePoint();
                    hasChange = true;
                    this.selectedEntity = null;
                    this.editType = EditType.None

                    editPoint.delete = false;
                    console.log("删除点");

                }


                break;
            case EditType.Edge:
                break;
            case EditType.Face:

                hasChange = this.selectedEntity.getComponent(EditTriangle).updatePoints();
                break;
            case EditType.Element:
                //TODO
                break;
            default:
                break;
        }


        //更新模型
        if (hasChange) {
            //TODO 多物体编辑？？
            const entities = this.groups[0].entities;
            //TODO 
            const mesh = entities[0].getComponent(MeshFilter).mesh;
            mesh.setAttribute(AttributeSemantics.POSITION, entities[0].getComponent(EditCubeController).vertices);
            mesh.needUpdate(MeshNeedUpdate.All);
            console.log("update model");

        }



    }





}