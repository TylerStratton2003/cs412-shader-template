out vec2 texCoord;
out vec3 fPosition;
out vec3 fNormal;

void main() {
    texCoord = uv;

    //  Convert the position (position) and normal (normal) into camera coordinates using
    //     modelViewMatrix.  Send the transformed values to the fragment shader via the output variables
    //     fPosition and fNormal.  Be sure to normalize the normal before writing.
    //check later
    fPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    fNormal = normalize(mat3(modelViewMatrix) * normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}