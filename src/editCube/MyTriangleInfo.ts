import { MyVertInfo } from "./MyVertInfo";
import { EditPoint } from "./EditPoint";
import { EditTriangle } from "./EditTriangle";

export class MyTriangleInfo {

    // public relatedPoint_a: MyVertInfo;
    // public relatedPoint_b: MyVertInfo;
    // public relatedPoint_c: MyVertInfo;

    public relatedPoint_a: EditPoint;
    public relatedPoint_b: EditPoint;
    public relatedPoint_c: EditPoint;

    public editTriangle: EditTriangle;
}