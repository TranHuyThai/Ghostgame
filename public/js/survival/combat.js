import * as THREE from 'three';
import { scene, camera } from './main.js';
import { stopSpawnZombies, clickableObjects, removeClickableObject, zombies, boss, getSpawnersLoc, killBoss } from './zombie.js';



// Set up raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


export function displayClickables(){
    console.log(clickableObjects);
}


export function win(){
    const status = document.getElementById("status");
    status.textContent = "WIN!";
    stopSpawnZombies();
}

export function checkDie(){
    const hp = document.getElementById("hp");
    let currentHP = parseInt(hp.textContent);
    if (currentHP <= 0){
        const status = document.getElementById("status");
        status.textContent = "DIED!";
        stopSpawnZombies();
        killBoss();
    }
}


function updateKillCounter(){
    const counter = document.getElementById("ghostkilled");
    counter.textContent ++; 
}


export function updatehealth(value){
    const hp = document.getElementById("hp");
    let currentHP = parseInt(hp.textContent);
    currentHP += value;
    hp.textContent = currentHP;
}


export function shoot(event) {
    console.log('Click detected!');
    
    let clickX, clickY;
    
    if (!event) {
        mouse.x = 0;
        mouse.y = 0;
        clickX = window.innerWidth / 2;
        clickY = window.innerHeight / 2;
    } else {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        clickX = event.clientX;
        clickY = event.clientY;
    }
    
    // Create visual click indicator
    createClickDot(clickX, clickY);
    
    raycaster.setFromCamera(mouse, camera);

    if (boss) {
        const bossIntersects = raycaster.intersectObject(boss, true);
        if (bossIntersects.length > 0) {
            console.log('Boss hit!');
            boss.userData.hp -= 1;
            console.log(`Boss HP remaining: ${boss.userData.hp}`);
            
            if (boss.userData.hp <= 0) {
                // Boss defeated
                console.log("Boss defeated!");
                scene.remove(boss);
                killBoss();
                updateKillCounter(); // Count boss as a kill
                win();
            } else {
                // Boss still alive, teleport it away
                const arr = getSpawnersLoc();
                if (arr.length > 0) {
                    const randomSpawnerPoint = arr[Math.floor(Math.random() * arr.length)];
                    boss.position.copy(randomSpawnerPoint);
                    console.log("Boss hit but still alive, teleported away");
                }
            }
            return; // Exit early, boss was hit
        }
    }

    const intersects = raycaster.intersectObjects(clickableObjects, true);
    console.log('Intersects found:', intersects.length);
    console.log('Clickable objects in list:', clickableObjects.length);
    
    if (intersects.length > 0) {
        const hitObject = intersects[0].object;
        console.log('Hit object:', hitObject);
        
        // Find the actual clickable object (might be a parent)
        let targetObject = hitObject;
        
        // First check if the hit object itself is in clickableObjects
        if (clickableObjects.includes(hitObject)) {
            targetObject = hitObject;
        } else {
            // Look for parent that's in clickableObjects
            let current = hitObject.parent;
            while (current && current !== scene) {
                if (clickableObjects.includes(current)) {
                    targetObject = current;
                    break;
                }
                current = current.parent;
            }
        }
        // Remove from scene
        scene.remove(targetObject);

        if (targetObject.userData.tag === 'ghost') {
            const zombieIndex = zombies.findIndex(z => z.uuid === targetObject.uuid);
            if (zombieIndex > -1) {
                zombies.splice(zombieIndex, 1);
                console.log('Zombie removed from zombies array');
            }
        }
        
        // Remove from clickable objects list
        removeClickableObject(targetObject);

        // Increment counter
        updateKillCounter();
        
        console.log('Object removed. Remaining clickable objects:', clickableObjects.length);
    }
}

// Function to create visual click indicators
function createClickDot(x, y) {
    const dot = document.createElement('div');
    dot.style.position = 'fixed';
    dot.style.left = (x - 5) + 'px'; // Center the dot
    dot.style.top = (y - 5) + 'px';  // Center the dot
    dot.style.width = '10px';
    dot.style.height = '10px';
    dot.style.backgroundColor = 'red';
    dot.style.borderRadius = '50%';
    dot.style.pointerEvents = 'none'; // Don't interfere with clicking
    dot.style.zIndex = '9999';
    dot.style.opacity = '0.8';
    
    document.body.appendChild(dot);
    
    // Remove the dot after 2 seconds
    setTimeout(() => {
        if (dot.parentNode) {
            dot.parentNode.removeChild(dot);
        }
    }, 1000);
}


export function shootclick(){
    window.addEventListener("click", shoot);
}

