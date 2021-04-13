import { MyVertInfo } from "./MyVertInfo";
import { Mesh } from "@egret/render";
import { EditEdge } from "./EditEdge";

export class MyEdgeInfo {
    public x = 0;
    public y = 0;
    public z = 0;
    public vertIndex = [];

    public editEdge: EditEdge = null;

    /**todo mesh不应该在这 */
    public lineMesh: Mesh = null;

    public vertsInfo: MyVertInfo[] = []

    /** 3位数组 */
    public pointStart = [];
    /** 3位数组 */
    public pointEnd = [];

}