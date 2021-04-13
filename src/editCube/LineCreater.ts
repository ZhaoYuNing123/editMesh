import { AttributeSemantics, MeshPrimitiveMode } from "@egret/gltf";
import { Mesh, DefaultMeshes } from "@egret/render";
import { Vector3 } from "@egret/engine";

export function createLine(startPostion: number[], endPosition: number[]) {
    // LINE_X.
    const positionAndColor = [AttributeSemantics.POSITION, AttributeSemantics.COLOR_0];

    const mesh = Mesh.create(4, 2, positionAndColor);
    //???
    mesh.glTFMesh.primitives[0].mode = MeshPrimitiveMode.Lines;
    // mesh.setAttribute(AttributeSemantics.POSITION, [
    //     0.0, 0.0, 0.0, // Line start.
    //     1.0, 0.0, 0.0, // Line end.

    //     0.0, 0.0, 0.0, // Point start.
    //     1.0, 0.0, 0.0, // Point end.
    // ]);
    mesh.setAttribute(AttributeSemantics.POSITION, [
        startPostion[0], startPostion[1], startPostion[2],  // Line start.
        endPosition[0], endPosition[1], endPosition[2],  // Line end.
        //????
        // 0.0, 0.0, 0.0, // Point start.
        // 1.0, 0.0, 0.0, // Point end.
        // startPostion[0], startPostion[1], startPostion[2],
        // endPosition[0], endPosition[1], endPosition[2],

    ]);
    mesh.setAttribute(AttributeSemantics.COLOR_0, [
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,

        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
    ]);
    mesh.setIndices([0, 1], 0);

    return mesh
}