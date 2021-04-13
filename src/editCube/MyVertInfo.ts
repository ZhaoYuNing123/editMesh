import { MyEdgeInfo } from "./MyEdgeInfo";
import { Vector3 } from "@egret/engine";
import { AttributeSemantics } from "@egret/gltf";
import { MeshNeedUpdate } from "@egret/render";
import { MyTriangleInfo } from "./MyTriangleInfo";

export class MyVertInfo {
    private _x = 0;
    private _y = 0;
    private _z = 0;
    public vertIndex: number[] = [];

    //TODO 不应该在这
    public relatedEdges: MyEdgeInfo[] = [];
    public relatedTriangle: MyTriangleInfo[] = [];


    public get x(): number {
        return this._x;
    }
    // public set x(v: number) {
    //     this._x = v;
    // }


    public get y(): number {
        return this._y;
    }
    // public set y(v: number) {
    //     this._y = v;
    // }


    public get z(): number {
        return this._z;
    }
    // public set z(v: number) {
    //     this._z = v;
    // }


    // setPosition(x: number, y: number, z: number) {
    //     this._x = x;
    //     this._y = y;
    //     this._z = z;


    //     // for (const edge of this.relatedEdges) {
    //     //     relatedEdges
    //     // }
    // }

    setPosition(vector3: Vector3) {
        for (const edge of this.relatedEdges) {
            if (edge.pointStart[0] == this._x
                && edge.pointStart[1] == this._y
                && edge.pointStart[2] == this._z) {
                edge.pointStart = [vector3.x, vector3.y, vector3.z];
            } else if (edge.pointEnd[0] == this._x
                && edge.pointEnd[1] == this._y
                && edge.pointEnd[2] == this._z) {
                edge.pointEnd = [vector3.x, vector3.y, vector3.z];
            }

            edge.lineMesh.setAttribute(AttributeSemantics.POSITION,
                [
                    edge.pointStart[0], edge.pointStart[1], edge.pointStart[2],
                    edge.pointEnd[0], edge.pointEnd[1], edge.pointEnd[2],
                ]
            );


            edge.lineMesh.needUpdate(MeshNeedUpdate.VertexBuffer);
        }

        this._x = vector3.x;
        this._y = vector3.y;
        this._z = vector3.z;

    }


}