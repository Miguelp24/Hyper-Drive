import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// ===== CONFIGURAÇÃO BÁSICA DA CENA =====
const scene = new THREE.Scene();
// Câmara em perspectiva - fornece uma visão mais realista com profundidade
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 300); 
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Configuração do renderizador - habilitar sombras
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Habilitar sombras
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Tipo de sombra mais suave
document.body.appendChild(renderer.domElement);

// ===== ILUMINAÇÃO DA CENA =====
// Luz ambiente - ilumina toda a cena uniformemente, sem direção específica
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Luz direcional - simula a luz do sol, vem de uma direção específica
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

// Adiciona uma luz pontual
const pointLight = new THREE.PointLight(0xff9000, 1.5, 30, 1);  // Cor laranja, maior intensidade, distância limitada
pointLight.position.set(0, 5, 0); // Posicionada acima do carro do jogador
scene.add(pointLight);

// Configurar luzes para projetar sombras
// A luz ambiente não projeta sombras, então não precisa de configuração

// Luz direcional - configurar para projetar sombras
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048; // Resolução da sombra
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -25;
directionalLight.shadow.camera.right = 25;
directionalLight.shadow.camera.top = 25;
directionalLight.shadow.camera.bottom = -25;
directionalLight.shadow.bias = -0.0005;

// Luz pontual - configurar para projetar sombras
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 30;
pointLight.shadow.bias = -0.001;

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

// Configurar a estrada para receber sombras
const roadGeometry = new THREE.PlaneGeometry(20, 200);
const roadMaterial = new THREE.MeshStandardMaterial({ 
    map: roadTexture, 
    side: THREE.DoubleSide,
    roughness: 0.8,  // Ajuste para parecer mais realista
    metalness: 0.2   // Ajuste para parecer mais realista
});
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2; // Rotaciona para ficar na horizontal
road.position.set(0, 0, -70); // Posiciona à frente do jogador
road.receiveShadow = true; // A estrada recebe sombras
scene.add(road);

// ===== GUARD-RAILS =====
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

// ===== PLAYER CAR MODELS =====
// Array to store all car models
const carModels = [];
let selectedCarIndex = 0; // Default car

// Original blue car (already in the code)
function createBlueSportsCar() {
    const carGroup = new THREE.Group();

    // Definição das cores do carro
    const carBodyColor = 0x0066cc; // Azul escuro
    const carRoofColor = 0x66aaff; // Azul clarinho
    const wheelColor = 0x222222; // Preto
    const windowColor = 0x99ccff; // Azul claro para vidros
    const detailColor = 0xdddddd; // Cinza claro para detalhes
    const lightColor = 0xffffcc; // Amarelo claro para faróis

    // Corpo principal do carro
    const carBody = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.7, 5.2),
        new THREE.MeshPhongMaterial({ color: carBodyColor, shininess: 70 })
    );
    carBody.position.y = 0.6;
    carBody.castShadow = true;
    carGroup.add(carBody);

    // Teto/Cabine
    const carRoof = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 0.9, 2.6),
        new THREE.MeshPhongMaterial({ color: carRoofColor, shininess: 60 })
    );
    carRoof.position.set(0, 1.4, 0);
    carRoof.castShadow = true;
    carGroup.add(carRoof);

    // Vidro frontal (pequena inclinação)
    const frontWindow = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.8, 0.1),
        new THREE.MeshPhongMaterial({ 
            color: windowColor, 
            transparent: true, 
            opacity: 0.7,
            shininess: 100 
        })
    );
    frontWindow.position.set(0, 1.35, 1.3);
    frontWindow.rotation.x = Math.PI * 0.07;
    carGroup.add(frontWindow);

    // Vidro traseiro (pequena inclinação)
    const backWindow = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.8, 0.1),
        new THREE.MeshPhongMaterial({ 
            color: windowColor, 
            transparent: true, 
            opacity: 0.7,
            shininess: 100 
        })
    );
    backWindow.position.set(0, 1.35, -1.3);
    backWindow.rotation.x = -Math.PI * 0.07;
    carGroup.add(backWindow);

    // Vidros laterais
    const sideWindowGeometry = new THREE.BoxGeometry(0.1, 0.65, 2.3);
    const sideWindowMaterial = new THREE.MeshPhongMaterial({ 
        color: windowColor, 
        transparent: true, 
        opacity: 0.7,
        shininess: 100 
    });

    const leftWindow = new THREE.Mesh(sideWindowGeometry, sideWindowMaterial);
    leftWindow.position.set(1.25, 1.3, 0);
    carGroup.add(leftWindow);

    const rightWindow = new THREE.Mesh(sideWindowGeometry, sideWindowMaterial);
    rightWindow.position.set(-1.25, 1.3, 0);
    carGroup.add(rightWindow);

    // Rodas (usando cilindros)
    const wheelGeometry = new THREE.CylinderGeometry(0.52, 0.52, 0.39, 16);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: wheelColor, shininess: 30 });
    const wheelPositions = [
        {x: -1.17, y: 0.52, z: 1.7},  // Frente-esquerda
        {x: 1.17, y: 0.52, z: 1.7},   // Frente-direita
        {x: -1.17, y: 0.52, z: -1.7}, // Traseira-esquerda
        {x: 1.17, y: 0.52, z: -1.7}   // Traseira-direita
    ];

    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.rotation.z = Math.PI / 2; // Roda na orientação correta
        wheel.castShadow = true;
        carGroup.add(wheel);
    });

    // Para-choques
    const frontBumper = new THREE.Mesh(
        new THREE.BoxGeometry(2.7, 0.39, 0.39),
        new THREE.MeshPhongMaterial({ color: detailColor, shininess: 80 })
    );
    frontBumper.position.set(0, 0.52, 2.6);
    frontBumper.castShadow = true;
    carGroup.add(frontBumper);

    const backBumper = new THREE.Mesh(
        new THREE.BoxGeometry(2.7, 0.39, 0.39),
        new THREE.MeshPhongMaterial({ color: detailColor, shininess: 80 })
    );
    backBumper.position.set(0, 0.52, -2.6);
    backBumper.castShadow = true;
    carGroup.add(backBumper);

    // Faróis e lanternas
    const headlightGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const headlightMaterial = new THREE.MeshPhongMaterial({ 
        color: lightColor, 
        emissive: lightColor,
        emissiveIntensity: 0.5,
        shininess: 100 
    });

    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(0.78, 0.78, 2.67);
    leftHeadlight.scale.set(1.3, 1.3, 0.4);
    carGroup.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(-0.78, 0.78, 2.67);
    rightHeadlight.scale.set(1.3, 1.3, 0.4);
    carGroup.add(rightHeadlight);

    const tailLightGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const tailLightMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff0000, 
        emissive: 0xff0000,
        emissiveIntensity: 0.5,
        shininess: 100 
    });

    const leftTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
    leftTailLight.position.set(0.78, 0.78, -2.67);
    leftTailLight.scale.set(1.3, 1.3, 0.4);
    carGroup.add(leftTailLight);

    const rightTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
    rightTailLight.position.set(-0.78, 0.78, -2.67);
    rightTailLight.scale.set(1.3, 1.3, 0.4);
    carGroup.add(rightTailLight);

    // Rack no teto
    const roofRack = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.13, 1.95),
        new THREE.MeshPhongMaterial({ color: 0x444444 })
    );
    roofRack.position.set(0, 1.95, 0);
    carGroup.add(roofRack);

    // Placa 
    const licensePlate = new THREE.Mesh(
        new THREE.PlaneGeometry(0.8, 0.3),
        new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            emissive: 0xdddddd,
            emissiveIntensity: 0.1
        })
    );
    licensePlate.position.set(0, 0.6, -2.05);
    licensePlate.rotation.y = Math.PI;
    carGroup.add(licensePlate);

    carGroup.rotation.y = Math.PI; // Gira o carro 180 graus
    
    return carGroup;
}

// ===== OBSTÁCULOS (CARROS FBX) =====
let obstacleCarModel1 = null;
let obstacleCarModel2 = null;
const obstacles = [];
let obstacleTexture1, obstacleTexture2;

const textureLoader = new THREE.TextureLoader();
obstacleTexture1 = textureLoader.load('assets/Low Poly Cars (Free)_fbx/Textures/Car Texture 1.png');
obstacleTexture2 = textureLoader.load('assets/Low Poly Cars (Free)_fbx/Textures/Car Texture 2.png');

const fbxLoader = new FBXLoader();

// Carrega o primeiro modelo de carro
fbxLoader.load('assets/Low Poly Cars (Free)_fbx/Models/car_1.fbx', (object1) => {
    object1.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
                map: obstacleTexture1,
                shininess: 10
            });
            child.castShadow = true;
        }
    });
    object1.scale.set(1.5, 1.5, 1.5);
    object1.rotation.set(Math.PI/2, 0, Math.PI/2);
    obstacleCarModel1 = object1;
});

// Carrega o segundo modelo de carro
fbxLoader.load('assets/Low Poly Cars (Free)_fbx/Models/car_2.fbx', (object2) => {
    object2.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
                map: obstacleTexture2,
                shininess: 10
            });
            child.castShadow = true;
        }
    });
    object2.scale.set(1.5, 1.5, 1.5);
    object2.rotation.set(Math.PI/2, 0, Math.PI/2);
    obstacleCarModel2 = object2;
});

// ===== SISTEMA DE COLISÕES =====
// Caixas delimitadoras para detecção de colisão
const carBoundingBox = new THREE.Box3();
const obstacleBoundingBox = new THREE.Box3();

// Variáveis de colisão e Game Over
let gameOver = false;
let collisionAnimating = false;
let collisionTime = 0;
const collisionAnimationDuration = 70;

// ===== SISTEMA DE PONTUAÇÃO =====
// Elemento de pontuação
let score = 0;
let gameSpeed = 1.0; // Velocidade inicial
let lastSpeedIncrease = 0;
let distanceTraveled = 0;

const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.color = 'white';
scoreElement.style.fontSize = '20px';
scoreElement.innerHTML = `Score: ${score}`;
document.body.appendChild(scoreElement);

// ===== TELA DE GAME OVER =====
const gameOverContainer = document.createElement('div');
gameOverContainer.style.position = 'absolute';
gameOverContainer.style.top = '0';
gameOverContainer.style.left = '0';
gameOverContainer.style.width = '100vw';
gameOverContainer.style.height = '100vh';
gameOverContainer.style.display = 'flex';
gameOverContainer.style.alignItems = 'center';
gameOverContainer.style.justifyContent = 'center';
gameOverContainer.style.background = 'rgba(0,0,0,0.65)';
gameOverContainer.style.backdropFilter = 'blur(4px)';
gameOverContainer.style.zIndex = '1000';
gameOverContainer.style.transition = 'opacity 0.5s';
gameOverContainer.style.opacity = '0';
gameOverContainer.style.pointerEvents = 'none'; // Só ativa quando visível
document.body.appendChild(gameOverContainer);

const gameOverBox = document.createElement('div');
gameOverBox.style.background = 'rgba(30,30,40,0.95)';
gameOverBox.style.borderRadius = '18px';
gameOverBox.style.boxShadow = '0 8px 32px 0 rgba(0,0,0,0.45)';
gameOverBox.style.padding = '48px 48px 32px 48px';
gameOverBox.style.display = 'flex';
gameOverBox.style.flexDirection = 'column';
gameOverBox.style.alignItems = 'center';
gameOverBox.style.animation = 'popIn 0.7s cubic-bezier(.68,-0.55,.27,1.55)';
gameOverContainer.appendChild(gameOverBox);

// Keyframes para animação popIn
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes popIn {
    0% { transform: scale(0.7); opacity: 0; }
    80% { transform: scale(1.08); opacity: 1; }
    100% { transform: scale(1); }
}
`;
document.head.appendChild(styleSheet);

const gameOverElement = document.createElement('div');
gameOverElement.style.color = '#FFD700';
gameOverElement.style.fontSize = '64px';
gameOverElement.style.fontWeight = 'bold';
gameOverElement.style.letterSpacing = '2px';
gameOverElement.style.textShadow = '0 4px 24px #000, 0 1px 0 #fff';
gameOverElement.innerHTML = 'GAME OVER';
gameOverBox.appendChild(gameOverElement);

const finalScoreElement = document.createElement('div');
finalScoreElement.style.color = '#fff';
finalScoreElement.style.fontSize = '32px';
finalScoreElement.style.marginTop = '24px';
finalScoreElement.style.marginBottom = '12px';
finalScoreElement.style.fontWeight = 'bold';
finalScoreElement.style.textShadow = '0 2px 8px #000';
gameOverBox.appendChild(finalScoreElement);

const tipElement = document.createElement('div');
tipElement.style.color = '#aaa';
tipElement.style.fontSize = '18px';
tipElement.style.marginBottom = '28px';
tipElement.style.textAlign = 'center';
tipElement.innerHTML = 'Pressione <b>A</b> ou <b>D</b> para desviar!';
gameOverBox.appendChild(tipElement);

const restartButton = document.createElement('button');
restartButton.style.marginTop = '10px';
restartButton.style.padding = '16px 48px';
restartButton.style.fontSize = '24px';
restartButton.style.background = 'linear-gradient(90deg, #FF5500 0%, #FFB300 100%)';
restartButton.style.color = 'white';
restartButton.style.border = 'none';
restartButton.style.borderRadius = '8px';
restartButton.style.cursor = 'pointer';
restartButton.style.fontWeight = 'bold';
restartButton.style.boxShadow = '0 2px 12px #0008';
restartButton.style.transition = 'transform 0.1s';
restartButton.innerHTML = 'Restart';
restartButton.onmouseenter = () => restartButton.style.transform = 'scale(1.07)';
restartButton.onmouseleave = () => restartButton.style.transform = 'scale(1)';
gameOverBox.appendChild(restartButton);

// Função para mostrar Game Over com fade-in
function showGameOver() {
    gameOverContainer.style.opacity = '1';
    gameOverContainer.style.pointerEvents = 'auto';
    gameOverBox.style.animation = 'popIn 0.7s cubic-bezier(.68,-0.55,.27,1.55)';
}
function hideGameOver() {
    gameOverContainer.style.opacity = '0';
    gameOverContainer.style.pointerEvents = 'none';
}

// No seu animate, troque:
// gameOverContainer.style.display = 'block';
// por:
showGameOver();
// E para esconder, use hideGameOver();

// No restartButton.addEventListener('click', ...), troque:
// gameOverContainer.style.display = 'none';
// por:
hideGameOver();

// Botão de reiniciar
restartButton.addEventListener('click', () => {
    // Resetar variáveis do jogo
    gameOver = false;
    collisionAnimating = false;
    collisionTime = 0;
    score = 0;
    gameSpeed = 1.0; // Reset da velocidade para o valor inicial
    lastSpeedIncrease = 0;
    distanceTraveled = 0;
    score = 0;
    scoreElement.innerHTML = `Score: ${score}`;
    
    // Resetar posição do carro E todas as rotações
    car.position.set(0, 0.1, 5);
    car.rotation.set(0, Math.PI, 0); // Reseta TODAS as rotações, não apenas Y
    
    // Remover obstáculos existentes
    for (let i = obstacles.length - 1; i >= 0; i--) {
        scene.remove(obstacles[i]);
        obstacles.splice(i, 1);
    }
    
    // Esconder o painel de Game Over
    hideGameOver();
    
    // CORRIGIDO: Resetar posição dos guarda-rails com valores que os tornem visíveis
    leftRailGroup1.position.set(-10, 0, -170);
    leftRailGroup2.position.set(-10, 0, -170 - railLength);
    rightRailGroup1.position.set(10, 0, -170);
    rightRailGroup2.position.set(10, 0, -170 - railLength);
    
    // Garantir visibilidade dos rails
    leftRailGroup1.visible = true;
    leftRailGroup2.visible = true;
    rightRailGroup1.visible = true;
    rightRailGroup2.visible = true;
    
    // Resetar a textura da estrada também
    roadTexture.offset.y = 0;
    
    // Atualizar o score na tela - forçar atualização imediata
    score = 0; // Garantir que o score seja realmente 0
    scoreElement.innerHTML = `Score: ${score}`;
    
    // CORRIGIDO: Interromper função atual antes de reiniciar
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Reiniciar com um novo timestamp para evitar saltos de deltaTime
    lastTime = performance.now();
    animate(lastTime);
});

// Função para criar obstáculos
function createObstacle() {
    let obstacleCar;
    if (obstacleCarModel1 && obstacleCarModel2) {
        // Escolhe aleatoriamente entre os dois modelos
        const useModel1 = Math.random() > 0.5;
        obstacleCar = useModel1 ? obstacleCarModel1.clone() : obstacleCarModel2.clone();
    } else if (obstacleCarModel1) {
        obstacleCar = obstacleCarModel1.clone();
    } else if (obstacleCarModel2) {
        obstacleCar = obstacleCarModel2.clone();
    } else {
        // Placeholder temporário caso nenhum modelo tenha carregado
        obstacleCar = new THREE.Group();
        const tempObstacleGeometry = new THREE.BoxGeometry(1.5, 0.8, 3);
        const tempObstacleMaterial = new THREE.MeshBasicMaterial({ 
            color: Math.random() > 0.5 ? 0xff0000 : 0x0000ff, 
            wireframe: true 
        });
        const tempObstacle = new THREE.Mesh(tempObstacleGeometry, tempObstacleMaterial);
        tempObstacle.position.y = 0.6;
        tempObstacle.castShadow = true;
        obstacleCar.add(tempObstacle);
    }
    
    // Posiciona em uma das quatro pistas aleatoriamente
    const position = Math.floor(Math.random() * 4);
    let xPos = -7.5;
    if (position === 1) xPos = -2.5;
    if (position === 2) xPos = 2.5;
    if (position === 3) xPos = 7.5;
    obstacleCar.position.set(xPos, 0.1, -70);
    scene.add(obstacleCar);
    obstacles.push(obstacleCar);
}
// Cria novos obstáculos a cada 2 segundos
setInterval(createObstacle, 2000);

// ===== CONTROLES DE MOVIMENTO DO CARRO =====
let moveLeft = false, moveRight = false;
document.addEventListener('keydown', (event) => {
    if (event.key === 'a') moveLeft = true;
    if (event.key === 'd') moveRight = true;
});
document.addEventListener('keyup', (event) => {
    if (event.key === 'a') moveLeft = false;
    if (event.key === 'd') moveRight = false;
});

// ===== FUNÇÃO PARA ANIMAR A LUZ PONTUAL =====
function animatePointLight() {
    // Faz a luz pontual seguir o carro do jogador
    pointLight.position.x = car.position.x;
    pointLight.position.z = car.position.z + 2;
    const time = Date.now() * 0.001;
    pointLight.intensity = 1.5 + Math.sin(time * 2) * 0.3;
}

// ===== LOOP DE ANIMAÇÃO =====
let animationFrameId;
let lastTime = 0;

function animate(currentTime = 0) {
    animationFrameId = requestAnimationFrame(animate);
    
    // CORRIGIDO: Cálculo de deltaTime mais estável
    const deltaTime = lastTime === 0 ? 0.016 : (currentTime - lastTime) / 1000; 
    lastTime = currentTime;
    const clampedDelta = Math.min(deltaTime, 0.1);
    
    // Game Over e animação de colisão
    if (gameOver) {
        if (collisionAnimating) {
            car.rotation.y += 0.1; // Faz o carro girar após colisão
            
            collisionTime++;
            
            if (collisionTime >= collisionAnimationDuration) {
                collisionAnimating = false;
                showGameOver(); // Mostra o painel de game over
                finalScoreElement.innerHTML = `Score: ${score}`; // Atualiza o score final
            }
            
            renderer.render(scene, currentCamera);
        }
        return; // Interrompe o restante da função quando gameOver é true
    }

    // CORRIGIDO: Resto da função de animação continua normalmente...
    
    // Aumento de velocidade com base na pontuação
    if (score >= lastSpeedIncrease + 100) {
        gameSpeed += 0.1;
        lastSpeedIncrease = Math.floor(score / 100) * 100;
        
        // Indicador visual de aumento de velocidade
        const speedIndicator = document.createElement('div');
        speedIndicator.style.position = 'absolute';
        speedIndicator.style.top = '50%';
        speedIndicator.style.left = '50%';
        speedIndicator.style.transform = 'translate(-50%, -50%)';
        speedIndicator.style.color = 'yellow';
        speedIndicator.style.fontSize = '36px';
        speedIndicator.style.zIndex = '1000';
        speedIndicator.innerHTML = `Speed Up! ${gameSpeed.toFixed(1)}x`;
        document.body.appendChild(speedIndicator);
        
        setTimeout(() => {
            document.body.removeChild(speedIndicator);
        }, 2000);
    }
    
    // Cálculo de velocidades sincronizadas
    const baseTextureSpeed = 1.2;
    const baseObjectSpeed = 120.0;
    
    // Velocidades ajustadas pelo multiplicador e deltaTime
    const textureSpeed = baseTextureSpeed * gameSpeed * clampedDelta;
    const objectSpeed = baseObjectSpeed * gameSpeed * clampedDelta;
    
    // Rolagem da textura da estrada
    roadTexture.offset.y += textureSpeed;
    
    // Velocidade de movimento dos guarda-rails sincronizada com a textura
    const railMoveSpeed = objectSpeed * 0.1;
    
    // Movimento dos grupos de guarda-rails
    leftRailGroup1.position.z += railMoveSpeed;
    leftRailGroup2.position.z += railMoveSpeed;
    rightRailGroup1.position.z += railMoveSpeed;
    rightRailGroup2.position.z += railMoveSpeed;

    // Reposiciona os grupos de guarda-rails com uma lógica melhorada
    // Para as barreiras da esquerda
    if (leftRailGroup1.position.z > 30) {
        // Encontra qual está mais atrás
        leftRailGroup1.position.z = leftRailGroup2.position.z - railLength;
    }
    if (leftRailGroup2.position.z > 30) {
        leftRailGroup2.position.z = leftRailGroup1.position.z - railLength;
    }

    // Para as barreiras da direita
    if (rightRailGroup1.position.z > 30) {
        rightRailGroup1.position.z = rightRailGroup2.position.z - railLength;
    }
    if (rightRailGroup2.position.z > 30) {
        rightRailGroup2.position.z = rightRailGroup1.position.z - railLength;
    }
    
    // Movimento do carro do jogador
    const carSpeed = objectSpeed * 0.15;
    if (moveLeft && car.position.x > -9) car.position.x -= carSpeed;
    if (moveRight && car.position.x < 9) car.position.x += carSpeed;

    // Movimento dos obstáculos e verificação de colisão
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].position.z += objectSpeed * 0.04;
        
        // Verificação de colisão quando o obstáculo está próximo
        if (obstacles[i].position.z > 0 && obstacles[i].position.z < 10) {
            // Atualiza as caixas delimitadoras
            carBoundingBox.setFromObject(car);
            obstacleBoundingBox.setFromObject(obstacles[i]);
            
            // Verifica a colisão
            if (carBoundingBox.intersectsBox(obstacleBoundingBox)) {
                gameOver = true;
                collisionAnimating = true;
                finalScoreElement.innerHTML = `Score: ${score}`;
                return;
            }
        }
        
        if (obstacles[i].position.z > 20) {
            scene.remove(obstacles[i]);
            obstacles.splice(i, 1);
            i--;
        }
    }
    
    // Atualização da pontuação
    distanceTraveled += objectSpeed * 0.04;
    score = Math.floor(distanceTraveled);
    scoreElement.innerHTML = `Score: ${score}`;

    // Anima a luz pontual se estiver visível
    if (pointLight.visible) {
        animatePointLight();
    }
    
    renderer.render(scene, currentCamera);
}

// Adiciona um evento para redimensionamento da janela
window.addEventListener('resize', () => {
    // Atualiza as dimensões do renderizador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Atualiza a relação de aspecto da câmera de perspectiva
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Atualiza a câmera ortográfica também
    const aspectRatio = window.innerWidth / window.innerHeight;
    orthographicCamera.left = -10 * aspectRatio;
    orthographicCamera.right = 10 * aspectRatio;
    orthographicCamera.updateProjectionMatrix();
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
controlsPanel.style.zIndex = '1000';
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
const aspect = window.innerWidth / window.innerHeight;
const orthographicCamera = new THREE.OrthographicCamera(-10 * aspect, 10 * aspect, 10, -5, 0.1, 1000);
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

// Preencha os arrays railPosts e railElements com os objetos corretos
// Após criar os postes e as barras horizontais, adicione:
for (let z = 0; z < railLength; z += postSpacing) {
    if (leftRailGroup1.children[z/postSpacing] && leftRailGroup1.children[z/postSpacing].isObject3D) {
        railPosts.push(leftRailGroup1.children[z/postSpacing]);
    }
    if (rightRailGroup1.children[z/postSpacing] && rightRailGroup1.children[z/postSpacing].isObject3D) {
        railPosts.push(rightRailGroup1.children[z/postSpacing]);
    }
    if (leftRailGroup2.children[z/postSpacing] && leftRailGroup2.children[z/postSpacing].isObject3D) {
        railPosts.push(leftRailGroup2.children[z/postSpacing]);
    }
    if (rightRailGroup2.children[z/postSpacing] && rightRailGroup2.children[z/postSpacing].isObject3D) {
        railPosts.push(rightRailGroup2.children[z/postSpacing]);
    }
}

// Adicione as barras aos elementos
railElements.push(leftTopRail1);
railElements.push(leftMiddleRail1);
railElements.push(rightTopRail1);
railElements.push(rightMiddleRail1);
railElements.push(leftTopRail2);
railElements.push(leftMiddleRail2);
railElements.push(rightTopRail2);
railElements.push(rightMiddleRail2);

// ===== TELA INICIAL =====
const startScreen = document.createElement('div');
startScreen.style.position = 'absolute';
startScreen.style.top = '0';
startScreen.style.left = '0';
startScreen.style.width = '100vw';
startScreen.style.height = '100vh';
startScreen.style.background = 'linear-gradient(120deg, #23243a 0%, #3a2c4a 100%)';
startScreen.style.display = 'flex';
startScreen.style.flexDirection = 'column';
startScreen.style.alignItems = 'center';
startScreen.style.justifyContent = 'center';
startScreen.style.zIndex = '2000';
startScreen.style.transition = 'opacity 0.7s';
startScreen.style.opacity = '1';

const title = document.createElement('div');
title.innerHTML = 'HYPER DRIVE';
title.style.color = '#FFD700';
title.style.fontSize = '64px';
title.style.fontWeight = 'bold';
title.style.letterSpacing = '4px';
title.style.textShadow = '0 4px 24px #000, 0 1px 0 #fff';
title.style.marginBottom = '32px';
startScreen.appendChild(title);

const subtitle = document.createElement('div');
subtitle.innerHTML = 'Desvie dos carros e faça a maior pontuação!';
subtitle.style.color = '#fff';
subtitle.style.fontSize = '22px';
subtitle.style.marginBottom = '48px';
subtitle.style.textAlign = 'center';
startScreen.appendChild(subtitle);

const startButton = document.createElement('button');
startButton.innerHTML = 'Start Game';
startButton.style.padding = '18px 60px';
startButton.style.fontSize = '28px';
startButton.style.background = 'linear-gradient(90deg, #FF5500 0%, #FFB300 100%)';
startButton.style.color = 'white';
startButton.style.border = 'none';
startButton.style.borderRadius = '12px';
startButton.style.cursor = 'pointer';
startButton.style.fontWeight = 'bold';
startButton.style.boxShadow = '0 2px 16px #0008';
startButton.style.transition = 'transform 0.1s, background 0.3s';
startButton.onmouseenter = () => startButton.style.transform = 'scale(1.08)';
startButton.onmouseleave = () => startButton.style.transform = 'scale(1)';
startScreen.appendChild(startButton);

document.body.appendChild(startScreen);

// Esconde todos os elementos do jogo até clicar em Start
renderer.domElement.style.filter = 'blur(6px)';
controlsPanel.style.display = 'none';
scoreElement.style.display = 'none';

// Função para iniciar o jogo
function startGame() {
    startScreen.style.opacity = '0';
    setTimeout(() => {
        startScreen.style.display = 'none';
        renderer.domElement.style.filter = '';
        controlsPanel.style.display = '';
        scoreElement.style.display = '';
        animate(); // Inicia o loop de animação
    }, 100);
}

// Inicialização do carro do jogador - adicione antes da função startGame()
const car = createBlueSportsCar();
car.position.set(0, 0.1, 5); // Posição inicial do carro
car.rotation.y = Math.PI; // Orientação correta
scene.add(car); // Adiciona o carro à cena

// Só inicia o jogo ao clicar no botão
startButton.addEventListener('click', startGame);

// Impede que o jogo inicie automaticamente
// Remova ou comente a chamada direta a animate() no final do arquivo
// animate();