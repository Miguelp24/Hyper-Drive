import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// ===== CONFIGURAÇÃO BÁSICA DA CENA =====
const scene = new THREE.Scene();
// Câmara em perspectiva - fornece uma visão mais realista com profundidade
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 300); 
// Câmara ortográfica - desativada por padrão, pode ser alternada para uma visão sem perspectiva
//const camera = new THREE.OrthographicCamera(-10, 10, 10, -5, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Configuração do renderizador - responsável por desenhar a cena na tela
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== ILUMINAÇÃO DA CENA ====
// Luz ambiente - ilumina toda a cena uniformemente, sem direção específica
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Luz direcional - simula a luz do sol, vem de uma direção específica
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

// ===== SKYBOX (CENÁRIO DE FUNDO) =====
// Cria um "céu" ao redor do jogo usando um cubo com texturas nas faces internas
let materialArray = [];

// Carregamento das texturas para cada face do skybox
let texture_ft = new THREE.TextureLoader().load("assets/texture/skybox/meadow_ft.jpg");
let texture_bk = new THREE.TextureLoader().load("assets/texture/skybox/meadow_bk.jpg");
let texture_up = new THREE.TextureLoader().load("assets/texture/skybox/meadow_up.jpg");
let texture_dn = new THREE.TextureLoader().load("assets/texture/skybox/meadow_dn.jpg");
let texture_rt = new THREE.TextureLoader().load("assets/texture/skybox/meadow_rt.jpg");
let texture_lf = new THREE.TextureLoader().load("assets/texture/skybox/meadow_lf.jpg");

// Aplicação das texturas aos materiais para cada face do cubo
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft })); // frente
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk })); // trás
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up })); // cima
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn })); // baixo
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt })); // direita
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf })); // esquerda

// Configura os materiais para serem visíveis do lado interno do cubo
for (let i = 0; i < 6; i++) {
    materialArray[i].side = THREE.BackSide;
}

// Criação e adição do skybox à cena
let skyboxGeo = new THREE.BoxGeometry(100, 100, 100);
let skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);

// Luz adicional para melhorar a visibilidade
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 10);
scene.add(light);

// ===== ESTRADA =====
// Carregamento e configuração da textura da estrada
const roadTextureLoader = new THREE.TextureLoader();
const roadTexture = roadTextureLoader.load('assets/texture/road.jpg');
roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping; // Permite repetição da textura
roadTexture.repeat.set(2, 20); // Configura a repetição (largura, comprimento)

// Criação da geometria da estrada - plano largo e comprido
const roadGeometry = new THREE.PlaneGeometry(20, 200);
const roadMaterial = new THREE.MeshBasicMaterial({ map: roadTexture, side: THREE.DoubleSide });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2; // Rotaciona para ficar na horizontal
road.position.set(0, 0, -70); // Posiciona à frente do jogador
scene.add(road);

// ===== GUARDA-RAILS =====
// Geometria comum para os postes dos guarda-rails
const postGeometry = new THREE.BoxGeometry(0.2, 1.5, 0.2);
const postMaterial = new THREE.MeshPhongMaterial({ color: 0x777777 });

// Arrays para rastrear objetos para animação
const railPosts = [];
const railElements = [];

// Criação de grupos para permitir movimentação contínua dos guarda-rails
const leftRailGroup1 = new THREE.Group();
const leftRailGroup2 = new THREE.Group();
const rightRailGroup1 = new THREE.Group();
const rightRailGroup2 = new THREE.Group();
scene.add(leftRailGroup1);
scene.add(leftRailGroup2);
scene.add(rightRailGroup1);
scene.add(rightRailGroup2);

// Definição de dimensões dos guarda-rails
const railLength = 200;
const postSpacing = 5;

// Criação dos postes para o primeiro conjunto de guarda-rails
for (let z = 0; z < railLength; z += postSpacing) {
    // Postes esquerdos
    const leftPost = new THREE.Mesh(postGeometry, postMaterial);
    leftPost.position.set(0, 0.40, z);
    leftRailGroup1.add(leftPost);
    
    // Postes direitos
    const rightPost = new THREE.Mesh(postGeometry, postMaterial);
    rightPost.position.set(0, 0.40, z);
    rightRailGroup1.add(rightPost);
}

// Criação dos postes para o segundo conjunto de guarda-rails
for (let z = 0; z < railLength; z += postSpacing) {
    // Postes esquerdos
    const leftPost = new THREE.Mesh(postGeometry, postMaterial);
    leftPost.position.set(0, 0.40, z);
    leftRailGroup2.add(leftPost);
    
    // Postes direitos
    const rightPost = new THREE.Mesh(postGeometry, postMaterial);
    rightPost.position.set(0, 0.40, z);
    rightRailGroup2.add(rightPost);
}

// Criação das barras horizontais dos guarda-rails
const horizontalRailGeometry = new THREE.BoxGeometry(0.2, 0.2, railLength);
const horizontalRailMaterial = new THREE.MeshPhongMaterial({ color: 0xAAAAAA });

// Barras horizontais para o primeiro conjunto
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

// Barras horizontais para o segundo conjunto
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

// Posicionamento dos grupos de guarda-rails
leftRailGroup1.position.set(-10, 0, -170);
leftRailGroup2.position.set(-10, 0, -170 - railLength);
rightRailGroup1.position.set(10, 0, -170);
rightRailGroup2.position.set(10, 0, -170 - railLength);

// ===== CARROS =====
// Criação de um carro temporário (placeholder) enquanto o modelo carrega
let car = new THREE.Group();
const tempCarGeometry = new THREE.BoxGeometry(2, 1, 4);
const tempCarMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
const tempCar = new THREE.Mesh(tempCarGeometry, tempCarMaterial);
tempCar.position.y = 0.75;
car.add(tempCar);
car.position.set(0, 0.5, 5);
scene.add(car);

// Variável para armazenar o modelo do carro obstáculo
let obstacleCarModel = null;

// Carregamento do modelo do carro do jogador usando FBXLoader
console.log("Loading player car model...");
const fbxLoader = new FBXLoader();
fbxLoader.load(
    'assets/Low Poly Cars (Free)_fbx/Models/car_2.fbx',
    (object) => {
        console.log("Player car model loaded successfully!");
        
        // Remove o carro temporário
        scene.remove(car);
        
        // Carrega a textura para o carro do jogador
        const textureLoader = new THREE.TextureLoader();
        const carTexture = textureLoader.load('assets/Low Poly Cars (Free)_fbx/Textures/Car Texture 2.png');
        
        // Aplica a textura a todas as partes do modelo
        object.traverse((child) => {
            if (child.isMesh) {
                // Cria um novo material com a textura
                child.material = new THREE.MeshPhongMaterial({
                    map: carTexture,
                    shininess: 10
                });
            }
        });
        
        // Ajusta a escala e posição do modelo
        object.scale.set(1.5, 1.5, 1.5);
        object.rotation.set(Math.PI/2, 0, Math.PI/2);
        object.position.set(0, 0.5, 5);
        
        // Usa este como o carro do jogador
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

// Carregamento do modelo do carro obstáculo
console.log("Loading obstacle car model...");
fbxLoader.load(
    'assets/Low Poly Cars (Free)_fbx/Models/car_1.fbx',
    (object) => {
        console.log("Obstacle car model loaded successfully!");
        
        // Carrega a textura para o carro obstáculo
        const textureLoader = new THREE.TextureLoader();
        const obstacleTexture = textureLoader.load('assets/Low Poly Cars (Free)_fbx/Textures/Car Texture 1.png');
        
        // Aplica a textura a todas as partes do modelo
        object.traverse((child) => {
            if (child.isMesh) {
                // Cria um novo material com a textura
                child.material = new THREE.MeshPhongMaterial({
                    map: obstacleTexture,
                    shininess: 10
                });
            }
        });
        
        // Ajusta a escala do modelo
        object.scale.set(1.5, 1.5, 1.5);
        
        // Rotaciona para apontar para a frente - mesma rotação do carro do jogador
        object.rotation.set(Math.PI/2, 0, Math.PI/2);

        // Salva para clonagem posterior
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

// ===== SISTEMA DE COLISÃO =====
// Caixas delimitadoras para detecção de colisão
const carBoundingBox = new THREE.Box3();
const obstacleBoundingBox = new THREE.Box3();

// ===== VARIÁVEIS DE JOGO =====
// Controla a velocidade global do jogo
let gameSpeed = 1.0; 
let lastSpeedIncrease = 0;

// ID da animação para controle de loop
let animationFrameId;

// Array para armazenar obstáculos ativos
const obstacles = [];

// ===== CRIAÇÃO DE OBSTÁCULOS =====
// Função para criar carros obstáculos
function createObstacle() {
    // Cria um modelo de carro obstáculo
    let obstacleCar;
    
    if (obstacleCarModel) {
        // Usa o modelo carregado, se disponível
        obstacleCar = obstacleCarModel.clone();
    } else {
        // Usa um placeholder se o modelo ainda não carregou
        obstacleCar = new THREE.Group();
        const tempObstacleGeometry = new THREE.BoxGeometry(1.5, 0.8, 3);
        const tempObstacleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        const tempObstacle = new THREE.Mesh(tempObstacleGeometry, tempObstacleMaterial);
        tempObstacle.position.y = 0.6;
        obstacleCar.add(tempObstacle);
    }
    
    // Posiciona em uma das quatro pistas aleatoriamente
    const position = Math.floor(Math.random() * 4); // 0, 1, 2, ou 3
    let xPos = -7.5; // Centro da pista 1
    if (position === 1) xPos = -2.5; // Centro da pista 2
    if (position === 2) xPos = 2.5;  // Centro da pista 3
    if (position === 3) xPos = 7.5;  // Centro da pista 4
    
    obstacleCar.position.set(xPos, 0.5, -70);
    scene.add(obstacleCar);
    obstacles.push(obstacleCar);
}
// Cria novos obstáculos a cada 2 segundos
setInterval(createObstacle, 2000);

// ===== INTERFACE DE USUÁRIO =====
// Elemento de pontuação
let score = 0;
const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.color = 'white';
scoreElement.style.fontSize = '20px';
scoreElement.innerHTML = `Score: ${score}`;
document.body.appendChild(scoreElement);

// Elemento de Game Over
const gameOverContainer = document.createElement('div');
gameOverContainer.style.position = 'absolute';
gameOverContainer.style.top = '50%';
gameOverContainer.style.left = '50%';
gameOverContainer.style.transform = 'translate(-50%, -50%)';
gameOverContainer.style.textAlign = 'center';
gameOverContainer.style.display = 'none'; // Inicialmente escondido
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

// Botão de reiniciar
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

// Evento de clique para reiniciar o jogo
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
    car.rotation.set(Math.PI/2, 0, Math.PI/2); // Rotação correta
    
    // Remover obstáculos existentes
    for (let i = obstacles.length - 1; i >= 0; i--) {
        scene.remove(obstacles[i]);
        obstacles.splice(i, 1);
    }
    
    // Esconder o painel de Game Over
    gameOverContainer.style.display = 'none';
    
    // Resetar posição dos guarda-rails
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

// ===== PAINEL DE CONTROLES =====
// Criação do painel de controles
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

// Título do painel
const panelTitle = document.createElement('div');
panelTitle.innerHTML = 'Controls';
panelTitle.style.fontSize = '18px';
panelTitle.style.fontWeight = 'bold';
panelTitle.style.marginBottom = '10px';
panelTitle.style.textAlign = 'center';
controlsPanel.appendChild(panelTitle);

// ===== CONTROLES DE CÂMERA =====
const cameraSection = document.createElement('div');
cameraSection.style.marginBottom = '15px';
controlsPanel.appendChild(cameraSection);

const cameraLabel = document.createElement('div');
cameraLabel.innerHTML = 'Camera Type:';
cameraLabel.style.marginBottom = '5px';
cameraSection.appendChild(cameraLabel);

// Criação da câmera ortográfica (alternativa)
const orthographicCamera = new THREE.OrthographicCamera(-10, 10, 10, -5, 0.1, 1000);
orthographicCamera.position.set(0, 5, 10);
orthographicCamera.lookAt(0, 0, 0);

// Botão para alternar entre câmeras
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

// Variáveis de controle da câmera
let currentCamera = camera; // Usa a câmera existente como padrão (perspectiva)
let usingPerspective = true;

// Evento para alternar entre câmeras
cameraToggle.addEventListener('click', () => {
    if (usingPerspective) {
        // Muda para câmera ortográfica
        currentCamera = orthographicCamera;
        cameraToggle.innerHTML = 'Orthographic Camera';
        cameraToggle.style.backgroundColor = '#2196F3';
    } else {
        // Muda para câmera perspectiva
        currentCamera = camera; // A câmera perspectiva existente
        cameraToggle.innerHTML = 'Perspective Camera';
        cameraToggle.style.backgroundColor = '#4CAF50';
    }
    usingPerspective = !usingPerspective;
});

// ===== CONTROLES DE ILUMINAÇÃO =====
const lightSection = document.createElement('div');
controlsPanel.appendChild(lightSection);

const lightLabel = document.createElement('div');
lightLabel.innerHTML = 'Light Sources:';
lightLabel.style.marginBottom = '5px';
lightSection.appendChild(lightLabel);

// Adiciona uma luz pontual (não incluída anteriormente)
const pointLight = new THREE.PointLight(0xff9000, 1.5, 30, 1);  // Cor laranja, maior intensidade, distância limitada
pointLight.position.set(0, 5, 0); // Posicionada acima do carro do jogador
scene.add(pointLight);

// Função para criar botões de alternância de luzes
function createLightToggle(name, light, defaultOn = true) {
    const toggle = document.createElement('button');
    toggle.style.width = '100%';
    toggle.style.padding = '5px';
    toggle.style.marginBottom = '5px';
    toggle.style.cursor = 'pointer';
    toggle.style.border = 'none';
    toggle.style.borderRadius = '3px';
    toggle.style.color = 'white';
    
    // Define o estado inicial
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

// Cria botões para cada tipo de luz
const ambientToggle = createLightToggle('Ambient Light', ambientLight);
const directionalToggle = createLightToggle('Directional Light', directionalLight);
const pointToggle = createLightToggle('Point Light', pointLight);

lightSection.appendChild(ambientToggle);
lightSection.appendChild(directionalToggle);
lightSection.appendChild(pointToggle);

// Função para animar a luz pontual
function animatePointLight() {
    // Faz a luz pontual seguir o carro do jogador
    pointLight.position.x = car.position.x;
    pointLight.position.z = car.position.z + 2;
    
    // Efeito de pulsação sutil
    const time = Date.now() * 0.001;
    pointLight.intensity = 1.5 + Math.sin(time * 2) * 0.3; // Intensidade flutua entre 1.2 e 1.8
}

// ===== CONTROLES DE MOVIMENTO =====
let moveLeft = false, moveRight = false;
document.addEventListener('keydown', (event) => {
    if (event.key === 'a') moveLeft = true;
    if (event.key === 'd') moveRight = true;
});
document.addEventListener('keyup', (event) => {
    if (event.key === 'a') moveLeft = false;
    if (event.key === 'd') moveRight = false;
});

// ===== LOOP PRINCIPAL DO JOGO =====
let gameOver = false;
let collisionAnimating = false;
let collisionTime = 0;
const collisionAnimationDuration = 70;
let lastTime = 0; // Nova variável para controle de tempo

function animate(currentTime = 0) {
    animationFrameId = requestAnimationFrame(animate);
    
    // Calcula o delta time (tempo decorrido entre frames em segundos)
    const deltaTime = (currentTime - lastTime) / 1000; 
    lastTime = currentTime;
    
    // Limita o delta time para evitar saltos grandes após pausas
    const clampedDelta = Math.min(deltaTime, 0.1);
    
    // Lógica de game over e animação de colisão
    if (gameOver) {
        if (collisionAnimating) {
            car.rotation.z += 0.1; // Faz o carro girar após colisão
            
            collisionTime++;
            
            if (collisionTime >= collisionAnimationDuration) {
                collisionAnimating = false;
                gameOverContainer.style.display = 'block'; // Mostra o painel de game over
            }
            
            renderer.render(scene, currentCamera);
        }
        return;
    }

    // Aumento de velocidade com base na pontuação
    if (score >= lastSpeedIncrease + 1000) {
        gameSpeed += 0.1;
        lastSpeedIncrease = Math.floor(score / 1000) * 1000;
        
        // Indicador visual de aumento de velocidade
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

    // Cálculo de velocidades sincronizadas
    const baseTextureSpeed = 1.2; // Aumentamos o valor base para compensar o deltaTime
    const baseObjectSpeed = 120.0; // Aumentamos o valor base para compensar o deltaTime
    
    // Velocidades ajustadas pelo multiplicador e deltaTime
    const textureSpeed = baseTextureSpeed * gameSpeed * clampedDelta;
    const objectSpeed = baseObjectSpeed * gameSpeed * clampedDelta;
    
    // Rolagem da textura da estrada
    roadTexture.offset.y += textureSpeed;
    
    // Velocidade de movimento dos guarda-rails sincronizada com a textura
    const railMoveSpeed = objectSpeed * 0.1;
    
    // Movimento dos elementos dos guarda-rails
    for (let post of railPosts) {
        post.position.z += railMoveSpeed;
        // Reposiciona os postes quando avançam muito
        if (post.position.z > 30) {
            post.position.z -= 200; // Volta para o início
        }
    }
    
    // Movimento das barras horizontais
    for (let element of railElements) {
        element.position.z += railMoveSpeed;
        if (element.position.z > 30) {
            element.position.z -= 200;
        }
    }
    
    // Movimento dos grupos de guarda-rails
    leftRailGroup1.position.z += railMoveSpeed;
    leftRailGroup2.position.z += railMoveSpeed;
    rightRailGroup1.position.z += railMoveSpeed;
    rightRailGroup2.position.z += railMoveSpeed;

    // Reposiciona os grupos de guarda-rails quando avançam muito
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
    
    // Movimento do carro do jogador também ajustado com deltaTime
    const carSpeed = objectSpeed * 0.15;
    if (moveLeft && car.position.x > -9) car.position.x -= carSpeed;
    if (moveRight && car.position.x < 9) car.position.x += carSpeed;

    // Movimento e detecção de colisão com obstáculos
    for (let i = 0; i < obstacles.length; i++) {
        // Carros obstáculo movem-se a 40% da velocidade do jogador
        obstacles[i].position.z += objectSpeed * 0.04;
        
        // Só verifica colisão se o obstáculo estiver próximo do jogador
        if (obstacles[i].position.z > 0 && obstacles[i].position.z < 10) {
            // Cria caixas delimitadoras para ambos os carros que atualizam com suas posições
            carBoundingBox.setFromObject(car);
            obstacleBoundingBox.setFromObject(obstacles[i]);
            
            // Verifica se as caixas delimitadoras se intersectam (colisão real)
            if (carBoundingBox.intersectsBox(obstacleBoundingBox)) {
                gameOver = true;
                collisionAnimating = true;
                finalScoreElement.innerHTML = `Score: ${score}`;
                return;
            }
        }
        
        // Limpeza de objetos que passaram
        if (obstacles[i].position.z > 20) {
            scene.remove(obstacles[i]);
            obstacles.splice(i, 1);
            i--;
        }
    }

    // Atualização da pontuação - ajustada com deltaTime para manter consistente
    score += Math.round(60 * clampedDelta); // Aproximadamente 1 ponto por frame a 60fps
    scoreElement.innerHTML = `Score: ${score}`;

    // Anima a luz pontual se estiver visível
    if (!gameOver && pointLight.visible) {
        animatePointLight();
    }

    // Renderiza a cena usando a câmera atual
    renderer.render(scene, currentCamera);
}
animate(); // Inicia o loop de animação


/*
===== ÍNDICE DO CÓDIGO =====
O código está organizado nas seguintes seções:

1. CONFIGURAÇÃO BÁSICA
   - Imports: linhas 1-2
   - Configuração da cena: linhas 4-5
   - Configuração das câmeras: linhas 6-10
   - Configuração do renderizador: linhas 12-14

2. ILUMINAÇÃO DA CENA
   - Luz ambiente: linhas 17-18
   - Luz direcional: linhas 20-22
   - Luz pontual (point light): linhas 436-438

3. CENÁRIO
   - Skybox: linhas 25-49
   - Estrada: linhas 56-66
   - Guarda-Rails: linhas 68-162

4. VEÍCULOS
   - Carro temporário (placeholder): linhas 165-171
   - Carro do jogador (FBX): linhas 176-212
   - Carro obstáculo (FBX): linhas 215-253

5. MECÂNICAS DE JOGO
   - Sistema de colisão: linhas 256-257
   - Velocidade do jogo: linhas 260-261
   - Geração de obstáculos: linhas 276-303
   - Interface de pontuação: linhas 306-312
   - Tela de Game Over: linhas 314-357

6. CONTROLES DE JOGO
   - Painel de controles: linhas 360-379
   - Controles de câmera: linhas 382-416
   - Controles de iluminação: linhas 419-466
   - Controles de movimento: linhas 469-476

7. LOOP DE ANIMAÇÃO
   - Variáveis de controle: linhas 479-482
   - Função principal animate(): linhas 484-571
   - Detecção de colisões: linhas 533-550
   - Aumento de velocidade: linhas 489-508
   - Animação de elementos: linhas 519-532

As seções mais importantes a verificar em caso de problemas são:
- Carregamento de modelos 3D: linhas 176-253
- Sistema de colisão: linhas 533-550
- Loop principal do jogo: linhas 484-571
*/

// ===== FIM DO CÓDIGO =====

//Entregas
//Semana 0 (dia 21): 1,2,3
//Semana 1 (dia 28): 6
//Semana 2 (dia 5): 4
//Semana 3 (dia 12): 5
//Semana 4 (dia 19): 7

