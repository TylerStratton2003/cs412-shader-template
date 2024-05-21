import GUI from 'lil-gui';
import {Texture, Scene, PerspectiveCamera, WebGLRenderer, Mesh, 
    ShaderMaterial, TextureLoader, Vector3} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import vertShader from './shader/hello.vert.glsl';
import fragShader from './shader/hello.frag.glsl';
import * as THREE from 'three';

let canvas : HTMLCanvasElement;
let renderer : WebGLRenderer;
let camera : PerspectiveCamera;
let scene : Scene;
var intensity : number = 1;
var spotlightGroup = new THREE.Object3D();
let directionalLight : THREE.DirectionalLight = new THREE.DirectionalLight(0xff0000, intensity);
directionalLight.position.set(0, 0, 0); // Position of the light

let capture = false;   // Whether or not to download an image of the canvas on the next redraw

export const controller = {init, resize};

let uniforms = {
    lights: { value: [
        { color: directionalLight.color, position: directionalLight.position }
    ]},
    alpha: { value: 100.0 },
    specular: { value: 1.0 },
    diffuseTex: { value: null as Texture },
    aoTex: {value: null as Texture}
};

// Called when the lights angle is changed.
export function AngleChanged( angle : number ) : void {
    guiState.angle = angle;
    draw();
}   

// Called when the cylinder's scale is changed in the GUI.
export function intensityChanged( value : number ) : void {
    guiState.intensity = value;
    draw();
}


function init() {
    setupGui();
    scene = new Scene();
    canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    camera = new PerspectiveCamera( 48, canvas.width / canvas.height, 0.1, 1000 );
    const controls = new OrbitControls(camera, canvas);
    controls.enablePan = true;
    camera.position.z = 2.5;
    renderer = new WebGLRenderer({ canvas });

    directionalLight.position.set(10, 10, 10); // Position of the light
    scene.add(directionalLight);

    // Create cone geometry and material
    var coneGeometry = new THREE.ConeGeometry(1, 2, 32);
    var coneMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: false, opacity: 0.5 });
    var coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);


    // Position and rotate cone to match the directional light
    coneMesh.position.copy(directionalLight.position);
    var target = new THREE.Vector3(5, 5, 5);
    target.addVectors(directionalLight.position, directionalLight.target.position);
    coneMesh.lookAt(target);
    scene.add(coneMesh);

    // Create an Object3D group and add the light and cone to it
    spotlightGroup = new THREE.Object3D();
    spotlightGroup.add(directionalLight);
    spotlightGroup.add(coneMesh);
    scene.add(spotlightGroup);

    spotlightGroup.position.x -= 8; // Move right +, - left
    spotlightGroup.position.y -= 8; // Move up +, - down
    spotlightGroup.position.z -= 4; // Move forward +, - back

    scene.add(directionalLight);

    const texLoader = new TextureLoader();
    
    const diffTex = texLoader.load( 'data/ogre/diffuse.png' );
    diffTex.flipY = false;
    uniforms.diffuseTex.value = diffTex;

    const aoTex = texLoader.load('data/ogre/ao_smile.png');
    aoTex.flipY = false;
    uniforms.aoTex.value = aoTex;

    const loader = new GLTFLoader().setPath( 'data/ogre/' );
    loader.load( 'ogre_smile_tangent.gltf', ( gltf ) => {
        gltf.scene.traverse( ( child ) => {
            if( child.type === 'Mesh' ) {
                const mesh = child as Mesh;
                mesh.material = new ShaderMaterial({ 
                    uniforms: uniforms,
                    vertexShader: vertShader, 
                    fragmentShader: fragShader 
                });
                scene.add(child);
            }
        });
    });

    resize();
    // Start the rendering loop.
    window.requestAnimationFrame(draw);
}

const guiState = {
    angle: directionalLight.rotation.y,
    intensity: 1
};

function draw() : void {
    renderer.render( scene, camera );
    spotlightGroup.rotation.y = guiState.angle * (Math.PI/180);
    directionalLight.rotation.y = guiState.angle * (Math.PI/180);
    directionalLight.intensity = guiState.intensity;

    uniforms = {
        lights: { value: [
            { color: directionalLight.color, position: directionalLight.position }
        ]},
        alpha: { value: 100.0 },
        specular: { value: 1.0 },
        diffuseTex: { value: null as Texture },
        aoTex: {value: null as Texture}
    };

    const texLoader = new TextureLoader();
    
    const diffTex = texLoader.load( 'data/ogre/diffuse.png' );
    diffTex.flipY = false;
    uniforms.diffuseTex.value = diffTex;

    const aoTex = texLoader.load('data/ogre/ao_smile.png');
    aoTex.flipY = false;
    uniforms.aoTex.value = aoTex;

    const loader = new GLTFLoader().setPath( 'data/ogre/' );
    loader.load( 'ogre_smile_tangent.gltf', ( gltf ) => {
        gltf.scene.traverse( ( child ) => {
            if( child.type === 'Mesh' ) {
                const mesh = child as Mesh;
                mesh.material = new ShaderMaterial({ 
                    uniforms: uniforms,
                    vertexShader: vertShader, 
                    fragmentShader: fragShader 
                });
                scene.add(child);
            }
        });
    });

    if (capture) {
        capture = false;
        const image = canvas.toDataURL("image/png");
        const aEl = document.createElement('a');
        aEl.setAttribute("download", 'screen.png');
        aEl.setAttribute("href", image);
        aEl.click();
        aEl.remove();
    }
    window.requestAnimationFrame( draw );
}

function resize() {
    const container = document.getElementById('canvas-container');
    
    renderer.setSize( container.clientWidth, container.clientHeight );
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
}

const buttons = {
    screenshot: () => { capture = true; }
};

function setupGui() {
    const gui = new GUI();
    gui.add(uniforms.alpha, 'value', 1, 200).name("Alpha: ");
    gui.add(uniforms.specular, 'value', 0, 1).name("Specular:");
    gui.add(buttons, 'screenshot' ).name("Capture Screenshot");
    var lightFolder = gui.addFolder('Spotlight');
    lightFolder.add(guiState, 'intensity', 0, 2).name('Intensity').onChange((v : number) => intensityChanged(v));
    lightFolder.add(guiState, 'angle', -180, 180).name('Angle').onChange((v : number) => AngleChanged(v));
    lightFolder.open();
}