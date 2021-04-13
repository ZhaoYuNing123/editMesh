import { Behaviour, GameEntity, EngineFactory, Vector3, Application, Color, Triangle, Box, TreeNode } from "@egret/engine";
import { component, IEntity } from "@egret/ecs";
import { MeshFilter, MeshRenderer, DefaultMeshes, DefaultMaterials, Mesh, MeshCreater, Material, DefaultShaders, BlendMode, RenderQueue } from "@egret/render";
import { MyVertInfo } from "./MyVertInfo";
import { EditPoint } from "./EditPoint";
import { hideFlag, HideFlag, serializedField } from "@egret/core";
import { AttributeSemantics, MeshPrimitiveMode, MeshDrawMode } from "@egret/gltf";
import { EditVerticeRoot } from "./EditVerticeRoot";
import { Picked, EditorCreator, AxisName } from "@egret/editor";
import { InputManager, Input, InputCode } from "@egret/input";
import { MyEdgeInfo } from "./MyEdgeInfo";
import { EditEdge } from "./EditEdge";
import { createLine } from "./LineCreater";
import { arrayEquals } from "../utils/MyUtils";
import { MyTriangleInfo } from "./MyTriangleInfo";
import { EditTriangle } from "./EditTriangle";
import { EditCubeSystem } from "./EditCubeSystem";

// @hideFlag(HideFlag.Hide | HideFlag.HideInMenu)
// @hideFlag(HideFlag.DontSave)
@component()
export class EditCubeController extends Behaviour {

    /**所有编辑物体的根节点*/
    public verticesEntity: GameEntity = null;
    /**边的根节点*/
    public myEdgesEntityRoot: GameEntity = null;

    /**当前模型 所有点 信息 */
    public myVerticesInfo: MyVertInfo[] = [];
    public myEditEdge: MyEdgeInfo[] = [];

    public myTriangles: MyTriangleInfo[] = [];

    /**可编辑点的组件 */
    public editPoints: EditPoint[] = [];
    public editEdges: EditEdge[] = [];


    public verticesShowScale = 0.05;
    public edgeShowScale = 0.05;


    /**暂存 点的信息 */
    @serializedField
    vertices: Float32Array;

    @serializedField
    normal: Float32Array;

    /**暂存 点的信息 */
    @serializedField
    uv: Float32Array;

    /**暂存 点的信息 */
    @serializedField
    indices: Uint16Array

    // private inputManager: InputManager = null;
    // protected _application: Application = Application.instance;
    // public _leftMouseInput: Input;;

    // onAwake() {
    //     this._application = Application.instance;
    //     this.inputManager = this._application.globalEntity.getComponent(InputManager);
    //     this._leftMouseInput = this.inputManager.getInput(InputCode.LeftMouse);

    // }

    onStart() {

        // this.entity.getComponent(MeshRenderer).enabled = false;
        Application.instance.systemManager.registerSystem(EditCubeSystem);
    }

    /**创建编辑点实体 */
    public createVerticesEntities() {
        console.log("createVerticesEntities");

        const editorScene = Application.instance.sceneManager.editorScene.root.entity;
        this.verticesEntity = EngineFactory.createGameEntity3D("this.verticesEntity", { parent: editorScene });
        const editVerticeRoot = this.verticesEntity.addComponent(EditVerticeRoot);
        editVerticeRoot.targetEditCube = this.entity;

        this.myEdgesEntityRoot = EngineFactory.createGameEntity3D("myEdgesEntityRoot");
        this.myEdgesEntityRoot.parent = this.verticesEntity;


        // const meshFilter = this.entity.getComponentInChildren(MeshFilter);
        // const meshRenderer = this.entity.getComponentInChildren(MeshRenderer);
        const meshFilter = this.entity.getComponent(MeshFilter);
        const meshRenderer = this.entity.getComponent(MeshRenderer);


        //todo
        const saveMesh = Mesh.create(20000, 60000);
        //不能直接改原来的mesh 不然如果用默认的cube可能别的也会被改了
        if (this.vertices && this.vertices.length > 0) {
            // const saveMesh = Mesh.create(this.vertices.length / 3, this.indices.length);


        } else {

            // const cubeMesh = MeshCreater.createCube(1, 1, 1, 2, 2, 2);
            let targetMesh: Mesh;
            if (meshFilter.mesh) {
                targetMesh = meshFilter.mesh;
            } else {
                targetMesh = MeshCreater.createCube();
            }


            // meshFilter.mesh = targetMesh;
            this.vertices = targetMesh.getAttribute("POSITION").slice();
            this.normal = targetMesh.getAttribute("NORMAL").slice();
            this.uv = targetMesh.getAttribute("TEXCOORD_0").slice();
            this.indices = targetMesh.getIndices().slice();

            console.error("记录 vertices");

        }


        saveMesh.setAttribute(AttributeSemantics.POSITION, this.vertices.slice());
        saveMesh.setAttribute(AttributeSemantics.NORMAL, this.normal.slice());
        saveMesh.setAttribute(AttributeSemantics.TEXCOORD_0, this.uv.slice());
        saveMesh.setIndices(this.indices.slice());
        meshFilter.mesh = saveMesh;

        // const myVertices: Vector3[] = [];
        for (let i = 0; i < this.vertices.length; i += 3) {
            let hasVertInfo = false;

            for (const vertInfo of this.myVerticesInfo) {
                if (vertInfo.x == this.vertices[i]
                    && vertInfo.y == this.vertices[i + 1]
                    && vertInfo.z == this.vertices[i + 2]) {
                    vertInfo.vertIndex.push(i);
                    // vertInfo.indicesIndex.push(this.indices[i / 3]);
                    hasVertInfo = true;
                    break;
                }
            }
            if (!hasVertInfo) {
                const vertInfo = new MyVertInfo();
                //TODO
                // vertInfo.x = this.vertices[i];
                // vertInfo.y = this.vertices[i + 1];
                // vertInfo.z = this.vertices[i + 2];
                vertInfo.setPosition(Vector3.create(this.vertices[i], this.vertices[i + 1], this.vertices[i + 2]).release())
                vertInfo.vertIndex.push(i);
                // vertInfo.indicesIndex.push(this.indices[i / 3]);
                this.myVerticesInfo.push(vertInfo)
            }
        }


        // console.log("this.myVerticesInfo", this.myVerticesInfo);



        this.createEditPoint();
        this.createEditEdgeFromIndices();
        this.createEdgeEntityFormIndices();


        this.createEditTriangleFromIndices();

        // console.log("this.entity", this.entity);

    }


    /**创建编辑点 */
    private createEditPoint() {
        //创建点
        for (let i = 0; i < this.myVerticesInfo.length; i++) {
            const myVertInfo = this.myVerticesInfo[i];

            const verticePositionEntity = EngineFactory.createGameEntity3D("a_vertices_" + i);
            verticePositionEntity.addComponent(MeshFilter).mesh = DefaultMeshes.CUBE;
            verticePositionEntity.addComponent(MeshRenderer).material = DefaultMaterials.MESH_NORMAL;
            verticePositionEntity.parent = this.verticesEntity;
            verticePositionEntity.transform.setLocalScale(this.verticesShowScale, this.verticesShowScale, this.verticesShowScale);
            verticePositionEntity.transform.localPosition.set(myVertInfo.x, myVertInfo.y, myVertInfo.z);
            verticePositionEntity.transform.localPosition = verticePositionEntity.transform.localPosition;

            verticePositionEntity.addComponent(Picked);

            const editPoint = verticePositionEntity.addComponent(EditPoint);
            editPoint.targetEntity = this.entity;
            editPoint.verticeID = i;
            editPoint.myVertInfo = myVertInfo;
            editPoint.lastPosition.set(
                verticePositionEntity.transform.localPosition.x,
                verticePositionEntity.transform.localPosition.y,
                verticePositionEntity.transform.localPosition.z
            );

            this.editPoints.push(editPoint)
        }

        // this.verticesEntity.transform.position.updater.onUpdate.bind(this.entity.transform.position.updater.onUpdate)
        // this.verticesEntity.transform.position.updater.onUpdate = this.entity.transform.position.updater.onUpdate

    }


    /**根据Indices获取所有边的信息 */
    private createEditEdgeFromIndices() {
        const verts = []
        for (let i = 0; i < this.indices.length; i += 3) {
            const vert1 = [
                this.vertices[this.indices[i] * 3],
                this.vertices[this.indices[i] * 3 + 1],
                this.vertices[this.indices[i] * 3 + 2]
            ];

            const vert2 = [
                this.vertices[this.indices[i + 1] * 3],
                this.vertices[this.indices[i + 1] * 3 + 1],
                this.vertices[this.indices[i + 1] * 3 + 2]
            ];


            const vert3 = [
                this.vertices[this.indices[i + 2] * 3],
                this.vertices[this.indices[i + 2] * 3 + 1],
                this.vertices[this.indices[i + 2] * 3 + 2]
            ];


            let hasNewVerts_1 = false;
            let hasNewVerts_2 = false;
            let hasNewVerts_3 = false;

            const newVerts_1 = [vert1, vert2].sort();
            const newVerts_2 = [vert2, vert3].sort();
            const newVerts_3 = [vert3, vert1].sort();
            for (const vertArr of verts) {
                vertArr.sort()

                if (arrayEquals(newVerts_1, vertArr)) {
                    // console.log("has newVerts_1");
                    hasNewVerts_1 = true;
                } else {
                    // verts.push(newVerts_1);
                }
                if (arrayEquals(newVerts_2, vertArr)) {
                    // console.log("has newVerts_2");
                    hasNewVerts_2 = true;

                } else {
                    // verts.push(newVerts_2);

                }
                if (arrayEquals(newVerts_3, vertArr)) {
                    // console.log("has newVerts_3");
                    hasNewVerts_3 = true;

                } else {
                    // verts.push(newVerts_3);
                }

            }

            if (!hasNewVerts_1) {
                verts.push(newVerts_1);
            }
            if (!hasNewVerts_2) {
                verts.push(newVerts_2);
            }
            if (!hasNewVerts_3) {
                verts.push(newVerts_3);
            }

        }
        // console.error("verts", verts);



        for (const vertArr of verts) {
            const edge = new MyEdgeInfo()
            edge.pointStart = vertArr[0];
            edge.pointEnd = vertArr[1];
            this.myEditEdge.push(edge);

        }


        //把边的信息记录到点上
        for (const edge of this.myEditEdge) {
            for (const editPoint of this.editPoints) {
                const vertInfo = editPoint.myVertInfo;
                if ((edge.pointStart[0] == vertInfo.x
                    && edge.pointStart[1] == vertInfo.y
                    && edge.pointStart[2] == vertInfo.z)
                    ||
                    (edge.pointEnd[0] == vertInfo.x
                        && edge.pointEnd[1] == vertInfo.y
                        && edge.pointEnd[2] == vertInfo.z)
                ) {
                    vertInfo.relatedEdges.push(edge);
                }
            }
        }


    }




    private createEdgeEntityFormIndices() {
        console.log("开始画边 FormIndices");

        for (let i = 0; i < this.myEditEdge.length; i++) {
            const editEdgeInfo = this.myEditEdge[i];
            const editEdgeEntity = EngineFactory.createGameEntity3D("a_editEdge_" + i);

            // editEdgeEntity.parent = this.verticesEntity;
            editEdgeEntity.parent = this.myEdgesEntityRoot;


            editEdgeEntity.addComponent(Picked);

            const editEdge = editEdgeEntity.addComponent(EditEdge);
            editEdge.targetEntity = this.entity;
            editEdge.verticeID = i;


            editEdge.myEdgeInfo = editEdgeInfo;
            editEdge.myEdgeInfo.editEdge = editEdge;


            let dx = editEdgeInfo.pointStart[0] - editEdgeInfo.pointEnd[0];
            let dy = editEdgeInfo.pointStart[1] - editEdgeInfo.pointEnd[1];
            let dz = editEdgeInfo.pointStart[2] - editEdgeInfo.pointEnd[2];


            editEdgeEntity.addComponent(MeshFilter).mesh = createLine(
                [editEdgeInfo.pointStart[0], editEdgeInfo.pointStart[1], editEdgeInfo.pointStart[2]],
                [editEdgeInfo.pointEnd[0], editEdgeInfo.pointEnd[1], editEdgeInfo.pointEnd[2]],
            )

            editEdgeInfo.lineMesh = editEdgeEntity.addComponent(MeshFilter).mesh;

            // editEdgeEntity.addComponent(MeshFilter).mesh = MeshCreater.createCube(
            //     dx, dy, dz
            // )


            // editEdgeEntity.addComponent(MeshFilter).mesh = DefaultMeshes.LINE_X;
            editEdgeEntity.addComponent(MeshRenderer).material = DefaultMaterials.MISSING;
            // editEdgeEntity.transform.localPosition.set(editEdge.vertsInfo[0].x - dx, editEdge.vertsInfo[0].y - dy, editEdge.vertsInfo[0].z - dz);
            // editEdgeEntity.transform.localPosition.set(editEdge.vertsInfo[0].x, editEdge.vertsInfo[0].y, editEdge.vertsInfo[0].z);

            editEdgeEntity.transform.localPosition = editEdgeEntity.transform.localPosition;

            // editEdgeEntity.getComponent(MeshRenderer).localBoundingBox = Box.create(Vector3.create(0.1, 1, 0.1));

            // if (dx < this.edgeShowScale) {
            //     dx = this.edgeShowScale;
            // }
            // if (dy < this.edgeShowScale) {
            //     dy = this.edgeShowScale;
            // }
            // if (dz < this.edgeShowScale) {
            //     dz = this.edgeShowScale;
            // }
            // editEdgeEntity.transform.setLocalScale(dx, dy, dz);


            editEdge.lastPosition.set(
                editEdgeEntity.transform.localPosition.x,
                editEdgeEntity.transform.localPosition.y,
                editEdgeEntity.transform.localPosition.z
            );
            this.editEdges.push(editEdge)
        }
    }


    reDrawEdge() {

        // console.log("reDrawEdge");
        this.myEdgesEntityRoot.destroy();
        this.myEdgesEntityRoot = EngineFactory.createGameEntity3D("myEdgesEntityRoot");
        this.myEdgesEntityRoot.parent = this.verticesEntity;

        this.myEditEdge = [];
        this.editEdges = [];


        this.createEditEdgeFromIndices();
        this.createEdgeEntityFormIndices();

    }

    //画三角形
    private createEditTriangleFromIndices() {

        for (let i = 0; i < this.indices.length; i += 3) {

            let triangleVertices = [
                this.vertices[this.indices[i] * 3], this.vertices[this.indices[i] * 3 + 1], this.vertices[this.indices[i] * 3 + 2],
                this.vertices[this.indices[i + 1] * 3], this.vertices[this.indices[i + 1] * 3 + 1], this.vertices[this.indices[i + 1] * 3 + 2],
                this.vertices[this.indices[i + 2] * 3], this.vertices[this.indices[i + 2] * 3 + 1], this.vertices[this.indices[i + 2] * 3 + 2]
            ];

            const myTriangleInfo = new MyTriangleInfo();
            const helpVector1 = [this.vertices[this.indices[i] * 3], this.vertices[this.indices[i] * 3 + 1], this.vertices[this.indices[i] * 3 + 2]]
            const helpVector2 = [this.vertices[this.indices[i + 1] * 3], this.vertices[this.indices[i + 1] * 3 + 1], this.vertices[this.indices[i + 1] * 3 + 2]]
            const helpVector3 = [this.vertices[this.indices[i + 2] * 3], this.vertices[this.indices[i + 2] * 3 + 1], this.vertices[this.indices[i + 2] * 3 + 2]]


            for (const editPoint of this.editPoints) {
                const myVert = editPoint.myVertInfo;
                const myVertPosition = [myVert.x, myVert.y, myVert.z];
                if (arrayEquals(helpVector1, myVertPosition)) {
                    myTriangleInfo.relatedPoint_a = editPoint;

                    editPoint.myVertInfo.relatedTriangle.push(myTriangleInfo);
                    // break;
                }
                if (arrayEquals(helpVector2, myVertPosition)) {
                    myTriangleInfo.relatedPoint_b = editPoint;
                    editPoint.myVertInfo.relatedTriangle.push(myTriangleInfo);

                    // break;
                }
                if (arrayEquals(helpVector3, myVertPosition)) {
                    myTriangleInfo.relatedPoint_c = editPoint;
                    editPoint.myVertInfo.relatedTriangle.push(myTriangleInfo);

                    // break;
                }
            }
            this.myTriangles.push(myTriangleInfo);

            const triangleMesh = Mesh.create(3, 3);
            triangleMesh.setAttribute(AttributeSemantics.POSITION, triangleVertices);
            // triangleMesh.setAttribute(AttributeSemantics.NORMAL, this.normal);
            // triangleMesh.setAttribute(AttributeSemantics.TEXCOORD_0, this.uv);
            triangleMesh.setIndices([0, 1, 2]);


            const triangleEntity = EngineFactory.createGameEntity3D("triangleEntity_" + i / 3);
            triangleEntity.parent = this.verticesEntity;
            const triangleMeshFilter = triangleEntity.addComponent(MeshFilter);
            const triangleMeshRenderer = triangleEntity.addComponent(MeshRenderer);
            triangleEntity.addComponent(Picked);


            triangleMeshFilter.mesh = triangleMesh;
            // triangleMeshRenderer.material = DefaultMaterials.MESH_BASIC;


            //位置控制
            triangleEntity.addComponent(Picked);
            const editTriangle = triangleEntity.addComponent(EditTriangle);
            editTriangle.myTriangleInfo = myTriangleInfo;
            editTriangle.myTriangleInfo.editTriangle = editTriangle;

        }

        // console.log("this.myTriangles", this.myTriangles);

    }


    clearVerticesEntities() {
        this.verticesEntity.destroy();
    }





















    private createEditEdge() {
        let time = 0;

        for (let i = 0; i < this.myVerticesInfo.length; i++) {
            const myVerticesInfo = this.myVerticesInfo[i];
            for (const vertIndex of myVerticesInfo.vertIndex) {
                // console.log("i ", i, "vertIndex", vertIndex);
                // const edgeInfo = new MyEdgeInfo();
                // this.myEditEdge.push(edgeInfo);



                let nextVertArray = []
                // for (let i = 0; i < this.indices.length; i += 3) {
                for (let i = 0; i < this.indices.length; i++) {
                    if (this.indices[i] == vertIndex / 3) {
                        nextVertArray = [
                            this.vertices[this.indices[i + 1]],
                            this.vertices[this.indices[i + 1] + 1],
                            this.vertices[this.indices[i + 1] + 2],
                        ];
                        // console.log("i", i, "nextVertArray", nextVertArray);
                        console.log("(this.indices[i] == vertIndex / 3)");
                        break;
                    }
                    // else if (this.indices[i + 1] == vertIndex / 3) {
                    //     console.log("(this.indices[i] == vertIndex / 3 +1)");
                    //     nextVertArray = [
                    //         this.vertices[this.indices[(i + 1) + 1]],
                    //         this.vertices[this.indices[(i + 1) + 1] + 1],
                    //         this.vertices[this.indices[(i + 1) + 1] + 2],
                    //     ];
                    //     // console.log("i", i, "nextVertArray", nextVertArray);
                    //     break;
                    // }
                }

                if (nextVertArray.length == 0) {
                    console.error("nextVertArray.length == 0");
                    continue;
                }

                let nextVert: MyVertInfo;
                for (const myVertInfo of this.myVerticesInfo) {
                    if (myVertInfo.x == nextVertArray[0]
                        && myVertInfo.y == nextVertArray[1]
                        && myVertInfo.z == nextVertArray[2]) {
                        // console.log("find myVertInfo");
                        // debugger
                        nextVert = myVertInfo;
                        break;
                    }
                }

                let hasEditEdge = false;

                // for (const editEdge of this.myEditEdge) {
                //     if ((editEdge.vertsInfo[0] == myVerticesInfo && editEdge.vertsInfo[1] == nextVert)
                //         || (editEdge.vertsInfo[1] == myVerticesInfo && editEdge.vertsInfo[0] == nextVert)
                //     ) {
                //         hasEditEdge = true;
                //     }
                // }

                if (!hasEditEdge) {
                    const editEdge = new MyEdgeInfo();
                    editEdge.vertsInfo.push(myVerticesInfo, nextVert);
                    this.myEditEdge.push(editEdge)
                    time++;
                }
            }

        }

        // console.log("time", time)
        console.log("  this.myEditEdge", this.myEditEdge);


    }




    private createEdgeEntity(): void {
        console.log("开始画边");

        for (let i = 0; i < this.myEditEdge.length; i++) {
            const editEdge = this.myEditEdge[i];
            const editEdgeEntity = EngineFactory.createGameEntity3D("a_editEdge_" + i);

            editEdgeEntity.parent = this.verticesEntity;

            editEdgeEntity.addComponent(Picked);

            const editEdgeController = editEdgeEntity.addComponent(EditEdge);
            editEdgeController.targetEntity = this.entity;
            editEdgeController.verticeID = i;


            editEdgeController.myEdgeInfo = editEdge;

            let dx = editEdge.vertsInfo[0].x - editEdge.vertsInfo[1].x;
            let dy = editEdge.vertsInfo[0].y - editEdge.vertsInfo[1].y;
            let dz = editEdge.vertsInfo[0].z - editEdge.vertsInfo[1].z;


            editEdgeEntity.addComponent(MeshFilter).mesh = createLine(
                [editEdge.vertsInfo[0].x, editEdge.vertsInfo[0].y, editEdge.vertsInfo[0].z],
                [editEdge.vertsInfo[1].x, editEdge.vertsInfo[1].y, editEdge.vertsInfo[1].z],
            )

            // editEdgeEntity.addComponent(MeshFilter).mesh = DefaultMeshes.LINE_X;
            editEdgeEntity.addComponent(MeshRenderer).material = DefaultMaterials.MISSING;
            // editEdgeEntity.transform.localPosition.set(editEdge.vertsInfo[0].x - dx, editEdge.vertsInfo[0].y - dy, editEdge.vertsInfo[0].z - dz);
            // editEdgeEntity.transform.localPosition.set(editEdge.vertsInfo[0].x, editEdge.vertsInfo[0].y, editEdge.vertsInfo[0].z);

            // editEdgeEntity.transform.localPosition = editEdgeEntity.transform.localPosition;

            // if (dx < this.edgeShowScale) {
            //     dx = this.edgeShowScale;
            // }
            // if (dy < this.edgeShowScale) {
            //     dy = this.edgeShowScale;
            // }
            // if (dz < this.edgeShowScale) {
            //     dz = this.edgeShowScale;
            // }
            // editEdgeEntity.transform.setLocalScale(dx, dy, dz);


            editEdgeController.lastPosition.set(
                editEdgeEntity.transform.localPosition.x,
                editEdgeEntity.transform.localPosition.y,
                editEdgeEntity.transform.localPosition.z
            );
        }


    }




}