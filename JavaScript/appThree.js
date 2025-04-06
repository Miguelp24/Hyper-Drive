import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// Configuração da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 300); // Increased far clipping plane
//const camera = new THREE.OrthographicCamera(-10, 10, 10, -5, 0.1, 1000); // Changed to OrthographicCamera for better performance
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Basic lighting - important for models to be visible
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

// Carregar Skybox
let materialArray = [];

// Load das texturas
let texture_ft = new THREE.TextureLoader().load("assets/texture/skybox/meadow_ft.jpg");
let texture_bk = new THREE.TextureLoader().load("assets/texture/skybox/meadow_bk.jpg");
let texture_up = new THREE.TextureLoader().load("assets/texture/skybox/meadow_up.jpg");
let texture_dn = new THREE.TextureLoader().load("assets/texture/skybox/meadow_dn.jpg");
let texture_rt = new THREE.TextureLoader().load("assets/texture/skybox/meadow_rt.jpg");
let texture_lf = new THREE.TextureLoader().load("assets/texture/skybox/meadow_lf.jpg");

// Materials para cada face do skybox - in correct order for BoxGeometry
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft })); // front
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk })); // back
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up })); // up
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn })); // down
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt })); // right
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf })); // left

// Ver o interior do cubo
for (let i = 0; i < 6; i++) {
    materialArray[i].side = THREE.BackSide;
}

// Criar um cubo para o skybox (reduzido para melhor visibilidade)
let skyboxGeo = new THREE.BoxGeometry(100, 100, 100);
let skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);

// Luz
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 10);
scene.add(light);

// Carregar textura da estrada
const roadTextureLoader = new THREE.TextureLoader();
const roadTexture = roadTextureLoader.load('assets/texture/road.jpg');
roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(2, 20); // Double width repeat (2 instead of 1)

// Estrada - made wider and longer
const roadGeometry = new THREE.PlaneGeometry(20, 200); // Double width (20 instead of 10)
const roadMaterial = new THREE.MeshBasicMaterial({ map: roadTexture, side: THREE.DoubleSide });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.set(0, 0, -70); // Position it further back
scene.add(road);

// SIMPLIFIED GUARD RAILS - 3D objects only, positioned lower
// Keep the existing support posts but make them lower
const postGeometry = new THREE.BoxGeometry(0.2, 1.5, 0.2);
const postMaterial = new THREE.MeshPhongMaterial({ color: 0x777777 });

// Create arrays to track rail objects for animation
const railPosts = [];
const railElements = [];

// IMPROVED GUARD RAILS IMPLEMENTATION
// Remove existing rail code first

// Create two groups for each side (for continuous scrolling)
const leftRailGroup1 = new THREE.Group();
const leftRailGroup2 = new THREE.Group();
const rightRailGroup1 = new THREE.Group();
const rightRailGroup2 = new THREE.Group();
scene.add(leftRailGroup1);
scene.add(leftRailGroup2);
scene.add(rightRailGroup1);
scene.add(rightRailGroup2);

// Define dimensions
const railLength = 200;
const postSpacing = 5;

// Create posts and rails for first set
for (let z = 0; z < railLength; z += postSpacing) {
    // Left posts
    const leftPost = new THREE.Mesh(postGeometry, postMaterial);
    leftPost.position.set(0, 0.40, z);
    leftRailGroup1.add(leftPost);
    
    // Right posts
    const rightPost = new THREE.Mesh(postGeometry, postMaterial);
    rightPost.position.set(0, 0.40, z);
    rightRailGroup1.add(rightPost);
}

// Create posts for second set (identical but positioned differently)
for (let z = 0; z < railLength; z += postSpacing) {
    // Left posts
    const leftPost = new THREE.Mesh(postGeometry, postMaterial);
    leftPost.position.set(0, 0.40, z);
    leftRailGroup2.add(leftPost);
    
    // Right posts
    const rightPost = new THREE.Mesh(postGeometry, postMaterial);
    rightPost.position.set(0, 0.40, z);
    rightRailGroup2.add(rightPost);
}

// Create horizontal rails for both sets
const horizontalRailGeometry = new THREE.BoxGeometry(0.2, 0.2, railLength);
const horizontalRailMaterial = new THREE.MeshPhongMaterial({ color: 0xAAAAAA });

// Top and middle rails for first set
const leftTopRail1 = new THREE.Mesh(horizontalRailGeometry, horizontalRailMaterial);
leftTopRail1.position.set(0, 1.1, railLength/2);
leftRailGroup1.add(leftTopRail1);

const leftMiddleRail1 = new THREE.Mesh(horizontalRailGeometry, horizontalRailMaterial);
leftMiddleRail1.position.set(0, 0.7, railLength/2);
leftRailGroup1.add(leftMiddleRail1);

const rightTopRail1 = new THREE.Mesh(horizontalRailGeometry, horizontalRailMaterial);
rightTopRail1.position.set(0, 1.1, railLength/2);
rightRailGroup1.add(rightTopRail1);

const rightMiddleRail1 = new THREE.Mesh(horizontalRailGeometry, horizontalRailMaterial);
rightMiddleRail1.position.set(0, 0.7, railLength/2);
rightRailGroup1.add(rightMiddleRail1);

// Top and middle rails for second set
const leftTopRail2 = new THREE.Mesh(horizontalRailGeometry, horizontalRailMaterial);
leftTopRail2.position.set(0, 1.1, railLength/2);
leftRailGroup2.add(leftTopRail2);

const leftMiddleRail2 = new THREE.Mesh(horizontalRailGeometry, horizontalRailMaterial);
leftMiddleRail2.position.set(0, 0.7, railLength/2);
leftRailGroup2.add(leftMiddleRail2);

const rightTopRail2 = new THREE.Mesh(horizontalRailGeometry, horizontalRailMaterial);
rightTopRail2.position.set(0, 1.1, railLength/2);
rightRailGroup2.add(rightTopRail2);

const rightMiddleRail2 = new THREE.Mesh(horizontalRailGeometry, horizontalRailMaterial);
rightMiddleRail2.position.set(0, 0.7, railLength/2);
rightRailGroup2.add(rightMiddleRail2);

// Position the groups properly
leftRailGroup1.position.set(-10, 0, -170);
leftRailGroup2.position.set(-10, 0, -170 - railLength);
rightRailGroup1.position.set(10, 0, -170);
rightRailGroup2.position.set(10, 0, -170 - railLength);


//////

// Create a basic player car placeholder while the model loads
let car = new THREE.Group();
const tempCarGeometry = new THREE.BoxGeometry(2, 1, 4);
const tempCarMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
const tempCar = new THREE.Mesh(tempCarGeometry, tempCarMaterial);
tempCar.position.y = 0.75;
car.add(tempCar);
car.position.set(0, 0.5, 5);
scene.add(car);

// Simple obstacle car model
let obstacleCarModel = null;

// Load player car model
console.log("Loading player car model...");
const fbxLoader = new FBXLoader();
fbxLoader.load(
    'assets/Low Poly Cars (Free)_fbx/Models/car_2.fbx',
    (object) => {
        console.log("Player car model loaded successfully!");
        
        // Remove the placeholder car
        scene.remove(car);
        
        // Load texture for player car
        const textureLoader = new THREE.TextureLoader();
        const carTexture = textureLoader.load('assets/Low Poly Cars (Free)_fbx/Textures/Car Texture 2.png');
        
        // Apply texture to all meshes in the model
        object.traverse((child) => {
            if (child.isMesh) {
                // Create a new material with the texture
                child.material = new THREE.MeshPhongMaterial({
                    map: carTexture,
                    shininess: 10
                });
            }
        });
        
        // Scale and position the new model
        object.scale.set(1.5, 1.5, 1.5);
        object.rotation.set(Math.PI/2, 0, Math.PI/2);
        object.position.set(0, 0.5, 5);
        
        // Use this as our player car
        car = object;
        scene.add(car);
        
        console.log("Player car added to scene with texture applied");
    },
    (xhr) => {
        console.log(`Player car loading: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading player car model:', error);
    }
);

// Load obstacle car model
console.log("Loading obstacle car model...");
fbxLoader.load(
    'assets/Low Poly Cars (Free)_fbx/Models/car_1.fbx',
    (object) => {
        console.log("Obstacle car model loaded successfully!");
        
        // Load texture for obstacle car
        const textureLoader = new THREE.TextureLoader();
        const obstacleTexture = textureLoader.load('assets/Low Poly Cars (Free)_fbx/Textures/Car Texture 1.png');
        
        // Apply texture to all meshes in the model
        object.traverse((child) => {
            if (child.isMesh) {
                // Create a new material with the texture
                child.material = new THREE.MeshPhongMaterial({
                    map: obstacleTexture,
                    shininess: 10
                });
            }
        });
        
        // Scale model appropriately
        object.scale.set(1.5, 1.5, 1.5);
        
        // Rotate to face forward - same rotation as player car
        object.rotation.set(Math.PI/2, 0, Math.PI/2);

        // Save for later cloning
        obstacleCarModel = object;
        
        console.log("Obstacle car model ready with texture applied");
    },
    (xhr) => {
        console.log(`Obstacle car loading: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading obstacle car model:', error);
    }
);

// Add this after loading the car models (outside the animate function)
// This will store our collision helpers
const carBoundingBox = new THREE.Box3();
const obstacleBoundingBox = new THREE.Box3();

// Variável para controlar a velocidade do jogo
let gameSpeed = 1.0;
let lastSpeedIncrease = 0;

// Variável para armazenar o ID da animação
let animationFrameId;

// Obstáculos (agora são carros)
const obstacles = [];

// Updated obstacle creation function
function createObstacle() {
    // Create a car model instead of a box
    let obstacleCar;
    
    if (obstacleCarModel) {
        // Use the loaded model if available
        obstacleCar = obstacleCarModel.clone();
    } else {
        // Use a placeholder if model hasn't loaded yet
        obstacleCar = new THREE.Group();
        const tempObstacleGeometry = new THREE.BoxGeometry(1.5, 0.8, 3);
        const tempObstacleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        const tempObstacle = new THREE.Mesh(tempObstacleGeometry, tempObstacleMaterial);
        tempObstacle.position.y = 0.6;
        obstacleCar.add(tempObstacle);
    }
    
    // Position in one of the lanes
    const position = Math.floor(Math.random() * 4); // 0, 1, 2, or 3
    let xPos = -7.5; // Lane 1 center
    if (position === 1) xPos = -2.5; // Lane 2 center
    if (position === 2) xPos = 2.5;  // Lane 3 center
    if (position === 3) xPos = 7.5;  // Lane 4 center
    
    obstacleCar.position.set(xPos, 0.5, -70);
    scene.add(obstacleCar);
    obstacles.push(obstacleCar);
}
setInterval(createObstacle, 2000);

// Score
let score = 0;
const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.color = 'white';
scoreElement.style.fontSize = '20px';
scoreElement.innerHTML = `Score: ${score}`;
document.body.appendChild(scoreElement);

// Game Over Element
const gameOverContainer = document.createElement('div');
gameOverContainer.style.position = 'absolute';
gameOverContainer.style.top = '50%';
gameOverContainer.style.left = '50%';
gameOverContainer.style.transform = 'translate(-50%, -50%)';
gameOverContainer.style.textAlign = 'center';
gameOverContainer.style.display = 'none'; // Hidden initially
document.body.appendChild(gameOverContainer);

const gameOverElement = document.createElement('div');
gameOverElement.style.color = 'yellow';
gameOverElement.style.fontSize = '72px';
gameOverElement.style.fontWeight = 'bold';
gameOverElement.innerHTML = 'GAME OVER';
gameOverContainer.appendChild(gameOverElement);

const finalScoreElement = document.createElement('div');
finalScoreElement.style.color = 'white';
finalScoreElement.style.fontSize = '36px';
finalScoreElement.style.marginTop = '20px';
gameOverContainer.appendChild(finalScoreElement);

// Criar botão de Restart
const restartButton = document.createElement('button');
restartButton.style.marginTop = '30px';
restartButton.style.padding = '15px 30px';
restartButton.style.fontSize = '24px';
restartButton.style.backgroundColor = '#FF5500';
restartButton.style.color = 'white';
restartButton.style.border = 'none';
restartButton.style.borderRadius = '5px';
restartButton.style.cursor = 'pointer';
restartButton.innerHTML = 'Restart';
gameOverContainer.appendChild(restartButton);

// Adicionar evento de clique para reiniciar o jogo
restartButton.addEventListener('click', () => {
    // Resetar variáveis do jogo
    gameOver = false;
    collisionAnimating = false;
    collisionTime = 0;
    score = 0;
    gameSpeed = 1.0; // Reset da velocidade para o valor inicial
    lastSpeedIncrease = 0;
    
    // Resetar posição do carro com a rotação correta
    car.position.set(0, 0.5, 5);
    car.rotation.set(Math.PI/2, 0, Math.PI/2); // Correct rotation
    
    // Remover obstáculos existentes
    for (let i = obstacles.length - 1; i >= 0; i--) {
        scene.remove(obstacles[i]);
        obstacles.splice(i, 1);
    }
    
    // Esconder o painel de Game Over
    gameOverContainer.style.display = 'none';
    
    // Resetar posição dos guard rails
    leftRailGroup1.position.set(-10, 0, -170);
    leftRailGroup2.position.set(-10, 0, -170 - railLength);
    rightRailGroup1.position.set(10, 0, -170);
    rightRailGroup2.position.set(10, 0, -170 - railLength);
    
    // Atualizar o score na tela
    scoreElement.innerHTML = `Score: ${score}`;
    
    // Reiniciar animação com velocidade inicial
    // Cancelar a animação atual antes de iniciar uma nova
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Reiniciar a animação
    animate();
});

// Add this after your other UI elements (score, game over panel, etc.)

// Create a controls panel
const controlsPanel = document.createElement('div');
controlsPanel.style.position = 'absolute';
controlsPanel.style.top = '10px';
controlsPanel.style.right = '10px';
controlsPanel.style.background = 'rgba(0, 0, 0, 0.5)';
controlsPanel.style.padding = '10px';
controlsPanel.style.borderRadius = '5px';
controlsPanel.style.color = 'white';
controlsPanel.style.fontFamily = 'Arial, sans-serif';
controlsPanel.style.width = '220px';
document.body.appendChild(controlsPanel);

// Panel title
const panelTitle = document.createElement('div');
panelTitle.innerHTML = 'Controls';
panelTitle.style.fontSize = '18px';
panelTitle.style.fontWeight = 'bold';
panelTitle.style.marginBottom = '10px';
panelTitle.style.textAlign = 'center';
controlsPanel.appendChild(panelTitle);

// 1. Camera Controls
const cameraSection = document.createElement('div');
cameraSection.style.marginBottom = '15px';
controlsPanel.appendChild(cameraSection);

const cameraLabel = document.createElement('div');
cameraLabel.innerHTML = 'Camera Type:';
cameraLabel.style.marginBottom = '5px';
cameraSection.appendChild(cameraLabel);

// Create and maintain two cameras
// perspectiveCamera is already defined in your code
// Create orthographic camera
const orthographicCamera = new THREE.OrthographicCamera(-10, 10, 10, -5, 0.1, 1000);
orthographicCamera.position.set(0, 5, 10);
orthographicCamera.lookAt(0, 0, 0);

// Camera toggle button
const cameraToggle = document.createElement('button');
cameraToggle.style.width = '100%';
cameraToggle.style.padding = '5px';
cameraToggle.style.cursor = 'pointer';
cameraToggle.innerHTML = 'Perspective Camera';
cameraToggle.style.backgroundColor = '#4CAF50';
cameraToggle.style.border = 'none';
cameraToggle.style.borderRadius = '3px';
cameraToggle.style.color = 'white';
cameraSection.appendChild(cameraToggle);

// Track current camera
let currentCamera = camera; // Use the existing camera as default (perspective)
let usingPerspective = true;

cameraToggle.addEventListener('click', () => {
    if (usingPerspective) {
        // Switch to orthographic
        currentCamera = orthographicCamera;
        cameraToggle.innerHTML = 'Orthographic Camera';
        cameraToggle.style.backgroundColor = '#2196F3';
    } else {
        // Switch to perspective
        currentCamera = camera; // The existing perspective camera
        cameraToggle.innerHTML = 'Perspective Camera';
        cameraToggle.style.backgroundColor = '#4CAF50';
    }
    usingPerspective = !usingPerspective;
});

// 2. Light Controls
const lightSection = document.createElement('div');
controlsPanel.appendChild(lightSection);

const lightLabel = document.createElement('div');
lightLabel.innerHTML = 'Light Sources:';
lightLabel.style.marginBottom = '5px';
lightSection.appendChild(lightLabel);

// Add a PointLight since it's not in the scene yet
const pointLight = new THREE.PointLight(0xff9000, 1.5, 30, 1);  // Orange color, higher intensity, limited distance, decay
pointLight.position.set(0, 5, 0); // Position directly above the player car
scene.add(pointLight);


// Create light toggle buttons
function createLightToggle(name, light, defaultOn = true) {
    const toggle = document.createElement('button');
    toggle.style.width = '100%';
    toggle.style.padding = '5px';
    toggle.style.marginBottom = '5px';
    toggle.style.cursor = 'pointer';
    toggle.style.border = 'none';
    toggle.style.borderRadius = '3px';
    toggle.style.color = 'white';
    
    // Set initial state
    light.visible = defaultOn;
    toggle.innerHTML = name + ': ON';
    toggle.style.backgroundColor = '#4CAF50';
    
    toggle.addEventListener('click', () => {
        light.visible = !light.visible;
        if (light.visible) {
            toggle.innerHTML = name + ': ON';
            toggle.style.backgroundColor = '#4CAF50';
        } else {
            toggle.innerHTML = name + ': OFF';
            toggle.style.backgroundColor = '#F44336';
        }
    });
    
    return toggle;
}

// Create toggle for each light type
const ambientToggle = createLightToggle('Ambient Light', ambientLight);
const directionalToggle = createLightToggle('Directional Light', directionalLight);
const pointToggle = createLightToggle('Point Light', pointLight);

lightSection.appendChild(ambientToggle);
lightSection.appendChild(directionalToggle);
lightSection.appendChild(pointToggle);

// Add a function to animate the point light to make it more noticeable
function animatePointLight() {
    // Make the point light follow the player car
    pointLight.position.x = car.position.x;
    pointLight.position.z = car.position.z + 2;
    
    // Optional: add subtle pulsing effect
    const time = Date.now() * 0.001;
    pointLight.intensity = 1.5 + Math.sin(time * 2) * 0.3; // Intensity fluctuates between 1.2 and 1.8
}

// Movimento do carro
let moveLeft = false, moveRight = false;
document.addEventListener('keydown', (event) => {
    if (event.key === 'a') moveLeft = true;
    if (event.key === 'd') moveRight = true;
});
document.addEventListener('keyup', (event) => {
    if (event.key === 'a') moveLeft = false;
    if (event.key === 'd') moveRight = false;
});

// Loop do jogo
let gameOver = false;
let collisionAnimating = false;
let collisionTime = 0;
const collisionAnimationDuration = 70;

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    if (gameOver) {
        // Collision animation code remains unchanged
        if (collisionAnimating) {
            car.rotation.z += 0.1;
            
            collisionTime++;
            
            if (collisionTime >= collisionAnimationDuration) {
                collisionAnimating = false;
                gameOverContainer.style.display = 'block';
            }
            
            renderer.render(scene, currentCamera);
        }
        return;
    }

    // Speed increase logic remains unchanged
    if (score >= lastSpeedIncrease + 1000) {
        gameSpeed += 0.1;
        lastSpeedIncrease = Math.floor(score / 1000) * 1000;
        
        // Visual indicator code remains unchanged
        const speedIndicator = document.createElement('div');
        speedIndicator.style.position = 'absolute';
        speedIndicator.style.top = '50%';
        speedIndicator.style.left = '50%';
        speedIndicator.style.transform = 'translate(-50%, -50%)';
        speedIndicator.style.color = 'yellow';
        speedIndicator.style.fontSize = '36px';
        speedIndicator.innerHTML = `Speed Up! ${gameSpeed.toFixed(1)}x`;
        document.body.appendChild(speedIndicator);
        
        setTimeout(() => {
            document.body.removeChild(speedIndicator);
        }, 2000);
    }

    // FIXED SYNCHRONIZED SPEEDS
    // Base speed values - same base for all movements
    const baseTextureSpeed = 0.01;
    const baseObjectSpeed = 1.0;
    
    // Calculate speeds with game speed multiplier
    const textureSpeed = baseTextureSpeed * gameSpeed;
    const objectSpeed = baseObjectSpeed * gameSpeed;
    
    // Road texture scrolling
    roadTexture.offset.y += textureSpeed;
    
    // Calculate a movement speed that visually matches the texture scroll rate
    // This is the key to synchronization
    const railMoveSpeed = objectSpeed * 0.1; // Double the previous value (was 0.04)
    
    // Move physical guard rail elements
    for (let post of railPosts) {
        post.position.z += railMoveSpeed;
        // Reset posts when they get too far ahead
        if (post.position.z > 30) {
            post.position.z -= 200; // Move back to beginning
        }
    }
    
    // Move horizontal rails
    for (let element of railElements) {
        element.position.z += railMoveSpeed;
        if (element.position.z > 30) {
            element.position.z -= 200;
        }
    }
    
    // Move rail groups
    leftRailGroup1.position.z += railMoveSpeed;
    leftRailGroup2.position.z += railMoveSpeed;
    rightRailGroup1.position.z += railMoveSpeed;
    rightRailGroup2.position.z += railMoveSpeed;

    // Reset rail groups when they move too far
    if (leftRailGroup1.position.z > 30) {
        leftRailGroup1.position.z = leftRailGroup2.position.z - railLength;
    }
    if (leftRailGroup2.position.z > 30) {
        leftRailGroup2.position.z = leftRailGroup1.position.z - railLength;
    }
    if (rightRailGroup1.position.z > 30) {
        rightRailGroup1.position.z = rightRailGroup2.position.z - railLength;
    }
    if (rightRailGroup2.position.z > 30) {
        rightRailGroup2.position.z = rightRailGroup1.position.z - railLength;
    }
    
    // Car movement speed
    const carSpeed = objectSpeed * 0.15;
    if (moveLeft && car.position.x > -9) car.position.x -= carSpeed;
    if (moveRight && car.position.x < 9) car.position.x += carSpeed;

    // Obstacle movement
    for (let i = 0; i < obstacles.length; i++) {
        // Obstacle cars move at 40% of the player car speed
        obstacles[i].position.z += objectSpeed * 0.04;
        
        // Only check collision if obstacle is close enough to the player
        if (obstacles[i].position.z > 0 && obstacles[i].position.z < 10) {
            // Create bounding boxes for both cars that update with their positions
            carBoundingBox.setFromObject(car);
            obstacleBoundingBox.setFromObject(obstacles[i]);
            
            // Check if the bounding boxes intersect (true collision)
            if (carBoundingBox.intersectsBox(obstacleBoundingBox)) {
                // Debugging - uncomment if needed to test collision points
                // console.log("Collision detected!");
                // console.log("Car bounds:", carBoundingBox.min, carBoundingBox.max);
                // console.log("Obstacle bounds:", obstacleBoundingBox.min, obstacleBoundingBox.max);
                
                gameOver = true;
                collisionAnimating = true;
                finalScoreElement.innerHTML = `Score: ${score}`;
                return;
            }
        }
        
        // Object cleanup
        if (obstacles[i].position.z > 20) {
            scene.remove(obstacles[i]);
            obstacles.splice(i, 1);
            i--;
        }
    }

    // Score update remains unchanged
    score += 1;
    scoreElement.innerHTML = `Score: ${score}`;

    if (!gameOver && pointLight.visible) {
        animatePointLight();
    }

    renderer.render(scene, currentCamera);
}
animate();
