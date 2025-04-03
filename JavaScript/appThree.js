import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// Configuração da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300); // Increased far clipping plane
//const camera = new THREE.OrthographicCamera(-10, 10, 10, -5, 0.1, 1000); // Changed to OrthographicCamera for better performance
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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
leftRailGroup2.position.set(-10, 0, -170 - railLength);  // Position right behind first group
rightRailGroup1.position.set(10, 0, -170);
rightRailGroup2.position.set(10, 0, -170 - railLength);  // Position right behind first group


//////

// Criando um carro simples com caixas
const car = new THREE.Group();
const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = 0.75;
car.add(body);

const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });

for (let i = 0; i < 4; i++) {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(i < 2 ? -0.9 : 0.9, 0.3, i % 2 === 0 ? -1.5 : 1.5);
    car.add(wheel);
}

car.position.set(0, 0.5, 5);
scene.add(car);

// Variável para controlar a velocidade do jogo
let gameSpeed = 1.0;
let lastSpeedIncrease = 0;

// Variável para armazenar o ID da animação
let animationFrameId;

// Obstáculos (agora são carros)
const obstacles = [];
function createObstacle() {
    // Create a car model instead of a box
    const obstacleCar = new THREE.Group();
    
    // Car body - smaller than player car, with red color
    const obstacleBodyGeometry = new THREE.BoxGeometry(1.5, 0.8, 3); 
    const obstacleBodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const obstacleBody = new THREE.Mesh(obstacleBodyGeometry, obstacleBodyMaterial);
    obstacleBody.position.y = 0.6;
    obstacleCar.add(obstacleBody);
    
    // Add wheels to the obstacle car
    const obstacleWheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
    const obstacleWheelMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
    
    for (let i = 0; i < 4; i++) {
        const wheel = new THREE.Mesh(obstacleWheelGeometry, obstacleWheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(i < 2 ? -0.7 : 0.7, 0.3, i % 2 === 0 ? -1.0 : 1.0);
        obstacleCar.add(wheel);
    }
    
    // Now 4 positions (one for each lane center) instead of 5
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
    
    // Resetar posição do carro
    car.position.set(0, 0.5, 5);
    car.rotation.set(0, 0, 0);
    
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
            car.rotation.y += 0.1;
            
            collisionTime++;
            
            if (collisionTime >= collisionAnimationDuration) {
                collisionAnimating = false;
                gameOverContainer.style.display = 'block';
            }
            
            renderer.render(scene, camera);
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
        
        // Update collision detection for the car models
        if (obstacles[i].position.z > 4.5 && obstacles[i].position.z < 5.5 && 
            Math.abs(obstacles[i].position.x - car.position.x) < 2.0) {
            gameOver = true;
            collisionAnimating = true;
            finalScoreElement.innerHTML = `Score: ${score}`;
            return;
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

    renderer.render(scene, camera);
}
animate();
