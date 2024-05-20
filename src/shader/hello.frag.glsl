#define NUM_LIGHTS 1

uniform sampler2D diffuseTex;  // Texture for the diffuse component Kd
uniform sampler2D aoTex;       // AO texture

// Light positions and colors
struct Light {
    vec3 color;
    vec3 position;  // In camera coordinates
};
uniform Light lights[NUM_LIGHTS];

uniform float alpha;    // The specular exponent
uniform float specular; // The Ks term in the Blinn-Phong model

in vec2 texCoord;
in vec3 fNormal;    // fragment normal in camera coordinates
in vec3 fPosition;  // fragment position in camera coordinates

void main() {

    // TODO - Part 2 - Compute the Blinn-Phong shading model using the uniform variables above.
    //       When using textures, convert the texture value from sRGB to linear space first using the
    //       provided function sRGBToLinear( color ).  Sum the contributions of each light with a loop.
    vec4 kD = texture(diffuseTex, texCoord);
    vec4 ambient = texture(aoTex, texCoord);
    vec3 finalLight = vec3(0.0, 0.0, 0.0);

    for (int i = 0; i < NUM_LIGHTS; i++) {
        vec3 lightVec = normalize(lights[i].position - fPosition);
        vec3 viewVec = normalize(-fPosition);
        vec3 halfVec = normalize(lightVec + viewVec);
        
        vec3 normal = normalize(fNormal);
        float diffuse = max(dot(lightVec, normal),0.0);
        vec3 diffuseFinal = kD.rgb * lights[i].color * diffuse;

        vec3 specularFinal = pow(max(0.0, dot(normal, halfVec)), alpha) * lights[i].color * specular;

        finalLight += diffuseFinal + specularFinal;
    }
    //finalLight += ambient.rgb;

    // TODO - Part 2 - Convert the result of the Blinn-Phong model from linear to sRGB before writing,
    //       using LinearTosRGB( color ).
    pc_fragColor = vec4(finalLight, 1.0); 
}