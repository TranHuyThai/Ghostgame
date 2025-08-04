// Controls
const keysPressed = {
    w: false,
    a: false,
    s: false,
    d: false,
};


export function setUpEventListeners(){
    // Setting up event listeners for movement
    window.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        if (key in keysPressed) keysPressed[key] = true;
    });

    window.addEventListener('keyup', (event) => {
        const key = event.key.toLowerCase();
        if (key in keysPressed) keysPressed[key] = false;
    });        
}

export function handleMovement(camera, clock){
    // Takes in camera and clock object and handles movement
    const delta = clock.getElapsedTime();
    const angle = camera.rotation.y;
    const walkSpeed = 0.015;
    const turnSpeed = 0.1;

    // Forward / backward
    if (keysPressed.w || keysPressed.s) {
        camera.position.y = 0.12 + Math.sin(delta * 30) * 0.01; // bobbing
    } else {
        camera.position.y = 0.12; // reset when not moving forward/backward
    }   
    if (keysPressed.w) {
        camera.position.x -= Math.sin(angle) * walkSpeed;
        camera.position.z -= Math.cos(angle) * walkSpeed;
        camera.position.y = 0.12 + Math.sin(delta * 26) * 0.01; 
    }
    if (keysPressed.s) {
        camera.position.x += Math.sin(angle) * walkSpeed;
        camera.position.z += Math.cos(angle) * walkSpeed;
    }

    // Left / right rotation (in place)
    if (keysPressed.a) camera.rotation.y += turnSpeed;
    if (keysPressed.d) camera.rotation.y -= turnSpeed;   
}
    