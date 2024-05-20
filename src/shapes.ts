import { BufferAttribute, BufferGeometry } from "three";

export function cube( sideLength = 1.0 ) : BufferGeometry {
    const sl2 = sideLength / 2.0;
    const p = Float32Array.from( [
            // Front
            -sl2, -sl2, sl2, sl2, -sl2, sl2, sl2, sl2, sl2, -sl2, sl2, sl2,
            // Right
             sl2, -sl2, sl2, sl2, -sl2, -sl2, sl2, sl2, -sl2, sl2, sl2, sl2,
            // Left
            -sl2, -sl2, -sl2, -sl2, -sl2, sl2, -sl2, sl2, sl2, -sl2, sl2, -sl2,
            // Back
            sl2, -sl2, -sl2, -sl2, -sl2, -sl2, -sl2, sl2, -sl2, sl2, sl2, -sl2,
            // Top
            -sl2, sl2, sl2, sl2, sl2, sl2, sl2, sl2, -sl2, -sl2, sl2, -sl2,
            // Bottom
            -sl2, -sl2, -sl2, sl2, -sl2, -sl2, sl2, -sl2, sl2, -sl2, -sl2, sl2,
        ]);
    const n = Float32Array.from( [
            // Front
            0,0,1, 0,0,1, 0,0,1, 0,0,1,
            // Right
            1,0,0, 1,0,0, 1,0,0, 1,0,0,
            // Left
            -1,0,0, -1,0,0, -1,0,0, -1,0,0,
            // Back
            0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
            // Top
            0,1,0, 0,1,0, 0,1,0, 0,1,0,
            // Bottom
            0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
    ]);
    const tang = Float32Array.from( [
        // Front
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        // Right
        0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
        // Left
        0,0,1, 0,0,1, 0,0,1, 0,0,1,
        // Back
        -1,0,0, -1,0,0, -1,0,0, -1,0,0,
        // Top
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        // Bottom
        1,0,0, 1,0,0, 1,0,0, 1,0,0
    ]);
    const uv = Float32Array.from( [
        0,0, 1,0, 1,1, 0,1,
        0,0, 1,0, 1,1, 0,1,
        0,0, 1,0, 1,1, 0,1,
        0,0, 1,0, 1,1, 0,1,
        0,0, 1,0, 1,1, 0,1,
        0,0, 1,0, 1,1, 0,1
    ]);
    const idx = [
            // Front face
            0,1,2,0,2,3,
            // Right
            4,5,6,4,6,7,
            // Left
            8,9,10,8,10,11,
            // Back
            12,13,14,12,14,15,
            // Top
            16,17,18,16,18,19,
            // Bottom
            20,21,22,20,22,23,
        ];

    const geom = new BufferGeometry();
    geom.setAttribute('position', new BufferAttribute(p, 3));
    geom.setAttribute('normal', new BufferAttribute(n, 3));
    geom.setAttribute('uv', new BufferAttribute(uv, 2));
    geom.setAttribute('tangent', new BufferAttribute(tang, 3));
    geom.setIndex(idx);
    return geom;
}