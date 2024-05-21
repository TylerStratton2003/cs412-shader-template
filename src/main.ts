

import {controller as controller} from './final';

window.addEventListener("DOMContentLoaded", main);

type controller = {
    init: () => void,
    resize: () => void
};

let mainController : controller;
let canvas : HTMLCanvasElement;

function main() {
    canvas = document.querySelector('#main-canvas');
    const hash = window.location.hash;

    
    mainController = controller;
    

    mainController.init();
    window.addEventListener( "resize", mainController.resize );
}