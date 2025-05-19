import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';


let isNightMode = false;

// Musica

const bgMusic = document.createElement('audio');
bgMusic.src = 'assets/music.mp3'; // Caminho para sua música
bgMusic.loop = true;
bgMusic.volume = 0.1; // Volume de 0 a 1
document.body.appendChild(bgMusic);

const collisionMusic = document.createElement('audio');
collisionMusic.src = 'assets/crashMusic.mp3'; // Coloque o caminho do seu áudio de colisão
collisionMusic.volume = 0.1;
collisionMusic.preload = 'auto';
document.body.appendChild(collisionMusic);

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

//Carregamento de cada face skybox2
let texture_ft2 = new THREE.TextureLoader().load("assets/texture/skybox2/arid_ft.jpg");
let texture_bk2 = new THREE.TextureLoader().load("assets/texture/skybox2/arid_bk.jpg");
let texture_up2 = new THREE.TextureLoader().load("assets/texture/skybox2/arid_up.jpg");
let texture_dn2 = new THREE.TextureLoader().load("assets/texture/skybox2/arid_dn.jpg");
let texture_rt2 = new THREE.TextureLoader().load("assets/texture/skybox2/arid_rt.jpg");
let texture_lf2 = new THREE.TextureLoader().load("assets/texture/skybox2/arid_lf.jpg");

//Carregamento de cada face skybox3
let texture_ft3 = new THREE.TextureLoader().load("assets/texture/skybox3/blizzard_ft.jpg");
let texture_bk3 = new THREE.TextureLoader().load("assets/texture/skybox3/blizzard_bk.jpg");
let texture_up3 = new THREE.TextureLoader().load("assets/texture/skybox3/blizzard_up.jpg");
let texture_dn3 = new THREE.TextureLoader().load("assets/texture/skybox3/blizzard_dn.jpg");
let texture_rt3 = new THREE.TextureLoader().load("assets/texture/skybox3/blizzard_rt.jpg");
let texture_lf3 = new THREE.TextureLoader().load("assets/texture/skybox3/blizzard_lf.jpg");

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

// ===== AIRPLANE =====
let airplane = null;
let airplaneDirection = 1; // 1 = right to left, -1 = left to right
const AIRPLANE_SPEED = 0.1;
const AIRPLANE_HEIGHT = 15;
const AIRPLANE_TURN_POINT = 50;

function createSimpleAirplane() {
    const airplaneGroup = new THREE.Group();
    
    // Cores
    const bodyColor = 0xf5f5f5;  // Branco
    const wingColor = 0xc0c0c0;  // Cinza claro
    const detailColor = 0x333333; // Cinza escuro
    const propellerColor = 0x222222; // Quase preto
    
    // Fuselagem (corpo principal)
    const fuselage = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 4, 8),
        new THREE.MeshPhongMaterial({ color: bodyColor })
    );
    fuselage.rotation.z = Math.PI / 2;
    airplaneGroup.add(fuselage);
    
    // Nariz/Cabine
    const nose = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 1.4, 8),
        new THREE.MeshPhongMaterial({ color: bodyColor })
    );
    nose.rotation.z = -Math.PI / 2;
    nose.position.set(2.7, 0, 0);
    airplaneGroup.add(nose);
    
    // Asas principais
    const mainWing = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.1, 5),
        new THREE.MeshPhongMaterial({ color: wingColor })
    );
    mainWing.position.set(0, 0, 0);
    airplaneGroup.add(mainWing);
    
    // Asas traseiras (estabilizadores horizontais)
    const tailWing = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.1, 1.5),
        new THREE.MeshPhongMaterial({ color: wingColor })
    );
    tailWing.position.set(-1.8, 0, 0);
    airplaneGroup.add(tailWing);
    
    // Estabilizador vertical
    const tailFin = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.8, 0.1),
        new THREE.MeshPhongMaterial({ color: wingColor })
    );
    tailFin.position.set(-1.8, 0.4, 0);
    airplaneGroup.add(tailFin);
    
    // Hélice
    const propellerHub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8),
        new THREE.MeshPhongMaterial({ color: detailColor })
    );
    propellerHub.position.set(3.2, 0, 0);
    propellerHub.rotation.z = Math.PI / 2;
    airplaneGroup.add(propellerHub);
    
    // Pás da hélice
    const propellerBlade1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1.5, 0.2),
        new THREE.MeshPhongMaterial({ color: propellerColor })
    );
    propellerBlade1.position.set(3.35, 0, 0);
    airplaneGroup.add(propellerBlade1);
    
    const propellerBlade2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.2, 1.5),
        new THREE.MeshPhongMaterial({ color: propellerColor })
    );
    propellerBlade2.position.set(3.35, 0, 0);
    airplaneGroup.add(propellerBlade2);
    
    // Janelas da cabine
    const cockpitWindow = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.8, 8),
        new THREE.MeshPhongMaterial({ 
            color: 0x88ccff, 
            transparent: true,
            opacity: 0.7
        })
    );
    cockpitWindow.position.set(1.5, 0.2, 0);
    cockpitWindow.rotation.z = Math.PI / 2;
    airplaneGroup.add(cockpitWindow);
    
    // Adiciona sombras
    airplaneGroup.traverse((object) => {
        if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });
    
    airplaneGroup.scale.set(1.2, 1.2, 1.2);
    airplaneGroup.position.set(-AIRPLANE_TURN_POINT, AIRPLANE_HEIGHT, -40);
    
    
    return airplaneGroup;
}

// Inicializa o avião
function initializeAirplane() {
    airplane = createSimpleAirplane();
    scene.add(airplane);
}

let airplaneTargetYRotation = 0;
let airplaneTurning = false;

// Variáveis para o loop (mortal)
let airplaneLooping = false;
let airplaneLoopProgress = 0;
let nextLoopTime = Date.now() + 8000 + Math.random() * 7000; // Próximo loop entre 8 e 15s

function updateAirplane(deltaTime) {
    if (!airplane) return;

    const t = Date.now() * 0.0005;
    const prevX = airplane.position.x;
    const newX = Math.sin(t) * AIRPLANE_TURN_POINT;

    // --- LOOP (MORTAL) ---
    // Inicia o loop se chegou a hora e não está virando
    if (!airplaneLooping && !airplaneTurning && Date.now() > nextLoopTime) {
        airplaneLooping = true;
        airplaneLoopProgress = 0;
        nextLoopTime = Date.now() + 8000 + Math.random() * 7000; // Próximo loop aleatório
    }

    // Animação do loop (gira no eixo X)
    if (airplaneLooping) {
        const loopDuration = 1.2; // segundos
        airplaneLoopProgress += deltaTime;
        // Gira 360° no eixo X durante o loop
        airplane.rotation.x = Math.PI * 2 * (airplaneLoopProgress / loopDuration) + Math.cos(t * 2) * 0.08;
        if (airplaneLoopProgress >= loopDuration) {
            airplaneLooping = false;
            airplane.rotation.x = Math.cos(t * 2) * 0.08; // volta ao normal
        }
    } else {
        // Inclinação normal
        airplane.rotation.x = Math.cos(t * 2) * 0.08;
    }

    // Movimento lateral (zig-zag com curva suave)
    // ...restante do seu código...
    // Detecta se chegou no extremo e precisa virar
    if (!airplaneTurning) {
        if (airplaneDirection === 1 && newX >= AIRPLANE_TURN_POINT - 0.5) {
            airplaneDirection = -1;
            airplaneTargetYRotation += Math.PI;
            airplaneTurning = true;
        } else if (airplaneDirection === -1 && newX <= -AIRPLANE_TURN_POINT + 0.5) {
            airplaneDirection = 1;
            airplaneTargetYRotation -= Math.PI;
            airplaneTurning = true;
        }
    }
    if (airplaneTurning) {
        const diff = airplaneTargetYRotation - airplane.rotation.y;
        const step = Math.sign(diff) * Math.min(Math.abs(diff), 2.5 * deltaTime);
        airplane.rotation.y += step;
        if (Math.abs(diff) < 0.05) {
            airplane.rotation.y = airplaneTargetYRotation;
            airplaneTurning = false;
        }
    }

    airplane.position.x = newX;
    airplane.position.y = AIRPLANE_HEIGHT + Math.sin(t * 2) * 2 + Math.cos(t * 1.5) * 0.7;
    airplane.position.z = -40 + Math.cos(t * 1.2) * 8;

    // Inclinação do avião conforme curva (banking)
    airplane.rotation.z = -Math.sin(t) * 0.4;

    // Rotação da hélice
    if (airplane.children.length > 6) {
        airplane.children[6].rotation.x += 0.2 * deltaTime * 60;
        airplane.children[7].rotation.z += 0.2 * deltaTime * 60;
    }
}


// ===== PLAYER CAR MODELS =====
// Array to store all car models
const carModels = [];
let selectedCarIndex = 0; // Default car

const carBodyTexture = new THREE.TextureLoader().load('assets/texture/texture_cars/azul.jpg'); 
const carBodyTexture2 = new THREE.TextureLoader().load('assets/texture/texture_cars/vermelho.jpeg');
const carBodyTexture3 = new THREE.TextureLoader().load('assets/texture/texture_cars/verde.jpg');
const carBodyTexture4 = new THREE.TextureLoader().load('assets/texture/texture_cars/preto.jpg');

// Original blue car (already in the code)
function createBlueSportsCar() {
    const carGroup = new THREE.Group();

    // Definição das cores do carro
    const carRoofColor = 0x66aaff; // Azul clarinho
    const wheelColor = 0x222222; // Preto
    const windowColor = 0x99ccff; // Azul claro para vidros
    const detailColor = 0xdddddd; // Cinza claro para detalhes
    const lightColor = 0xffffcc; // Amarelo claro para faróis

    // Corpo principal do carro
    const carBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.7, 5.2),
    new THREE.MeshPhongMaterial({ 
        map: carBodyTexture, // Aplica a textura
        color: 0xffffff,     // Mantém as cores da textura
        shininess: 70
    })
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

    const leftHeadlightLight = new THREE.SpotLight(0xffee88, 1.2, 18, Math.PI / 6, 0.4, 1);
    leftHeadlightLight.position.set(0.78, 0.78, 2.67);
    leftHeadlightLight.target.position.set(0.78, 0.78, 5.5);
    carGroup.add(leftHeadlightLight);
    carGroup.add(leftHeadlightLight.target);

    const rightHeadlightLight = new THREE.SpotLight(0xffee88, 1.2, 18, Math.PI / 6, 0.4, 1);
    rightHeadlightLight.position.set(-0.78, 0.78, 2.67);
    rightHeadlightLight.target.position.set(-0.78, 0.78, 5.5);
    carGroup.add(rightHeadlightLight);
    carGroup.add(rightHeadlightLight.target);

    // Lanternas traseiras (luz vermelha)
    const leftTailLightLight = new THREE.PointLight(0xff2222, 0.7, 4, 2);
    leftTailLightLight.position.set(0.78, 0.78, -2.67);
    carGroup.add(leftTailLightLight);

    const rightTailLightLight = new THREE.PointLight(0xff2222, 0.7, 4, 2);
    rightTailLightLight.position.set(-0.78, 0.78, -2.67);
    carGroup.add(rightTailLightLight);

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

function createRedSportsCar() {
    const carGroup = new THREE.Group();

    // Cores principais
    const carBodyColor = 0xd90429; // Vermelho vibrante
    const carRoofColor = 0x8d0801; // Vermelho escuro
    const windowColor = 0xffeaea;  // Vidro levemente rosado
    const wheelColor = 0x222222;
    const rimColor = 0xffffff;
    const detailColor = 0x6a040f; // Detalhes escuros
    const lightColor = 0xfff3c9;

    // Corpo principal
    const carBody = new THREE.Mesh(
        new THREE.BoxGeometry(2.9, 0.55, 5.2),
        new THREE.MeshPhongMaterial({ 
        map: carBodyTexture2, // Aplica a textura
        color: 0xffffff,     // Mantém as cores da textura
        shininess: 70
    })
    );
    carBody.position.y = 0.6;
    carBody.castShadow = true;
    carGroup.add(carBody);

    // Teto rebaixado e mais esportivo
    const carRoof = new THREE.Mesh(
        new THREE.BoxGeometry(1.7, 0.38, 2.1),
        new THREE.MeshPhongMaterial({ color: carRoofColor, shininess: 80 })
    );
    carRoof.position.set(0, 1.05, 0.3);
    carRoof.castShadow = true;
    carGroup.add(carRoof);

    // Aerofólio traseiro
    const spoiler = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.08, 0.5),
        new THREE.MeshPhongMaterial({ color: detailColor })
    );
    spoiler.position.set(0, 1.05, -2.5);
    carGroup.add(spoiler);

    // Vidro dianteiro inclinado (apenas uma peça, inclinação correta)
    const windshield = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.32, 0.32),
        new THREE.MeshPhongMaterial({ color: windowColor, transparent: true, opacity: 0.55 })
    );
    windshield.position.set(0, 1, 1.2);
    carGroup.add(windshield);

    // Vidro traseiro inclinado (apenas uma peça, inclinação correta)
    const rearWindow = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.32, 0.32),
        new THREE.MeshPhongMaterial({ color: windowColor, transparent: true, opacity: 0.55 })
    );
    rearWindow.position.set(0, 1, -0.7); 
    carGroup.add(rearWindow);

    // Rodas esportivas 
    const wheelGeometry = new THREE.CylinderGeometry(0.62, 0.62, 0.22, 24);
    const rimGeometry = new THREE.TorusGeometry(0.42, 0.07, 8, 16);
    const wheelPositions = [
        {x: -1.25, y: 0.48, z: 1.7}, 
        {x: 1.25, y: 0.48, z: 1.7}, 
        {x: -1.25, y: 0.48, z: -1.7}, 
        {x: 1.25, y: 0.48, z: -1.7}
    ];
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, new THREE.MeshPhongMaterial({ color: wheelColor }));
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.rotation.z = Math.PI / 2;
        carGroup.add(wheel);
    });

    // Para-choque dianteiro com entrada de ar
    const frontBumper = new THREE.Mesh(
        new THREE.BoxGeometry(2.9, 0.18, 0.45),
        new THREE.MeshPhongMaterial({ color: detailColor, shininess: 90 })
    );
    frontBumper.position.set(0, 0.45, 2.7);
    carGroup.add(frontBumper);

    const airIntake = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.09, 0.18),
        new THREE.MeshPhongMaterial({ color: 0x222222 })
    );
    airIntake.position.set(0, 0.41, 2.85);
    carGroup.add(airIntake);

    // Para-choque traseiro
    const rearBumper = new THREE.Mesh(
        new THREE.BoxGeometry(2.9, 0.18, 0.32),
        new THREE.MeshPhongMaterial({ color: detailColor, shininess: 90 })
    );
    rearBumper.position.set(0, 0.45, -2.7);
    carGroup.add(rearBumper);

    // Faróis dianteiros alongados
    const headlightGeometry = new THREE.BoxGeometry(0.32, 0.13, 0.18);
    const headlightMaterial = new THREE.MeshPhongMaterial({ color: lightColor, emissive: lightColor, emissiveIntensity: 0.8 });
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(0.55, 0.68, 2.85);
    carGroup.add(leftHeadlight);
    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(-0.55, 0.68, 2.85);
    carGroup.add(rightHeadlight);


    // Lanternas traseiras horizontais
    const tailLightGeometry = new THREE.BoxGeometry(0.7, 0.13, 0.12);
    const tailLightMaterial = new THREE.MeshPhongMaterial({ color: 0xff2222, emissive: 0xff2222, emissiveIntensity: 0.7 });
    const leftTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
    leftTailLight.position.set(0.45, 0.7, -2.85);
    carGroup.add(leftTailLight);
    const rightTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
    rightTailLight.position.set(-0.45, 0.7, -2.85);
    carGroup.add(rightTailLight);


    const leftHeadlightLight = new THREE.SpotLight(0xffee88, 1.2, 18, Math.PI / 6, 0.4, 1);
    leftHeadlightLight.position.set(0.78, 0.78, 2.67);
    leftHeadlightLight.target.position.set(0.78, 0.78, 5.5);
    carGroup.add(leftHeadlightLight);
    carGroup.add(leftHeadlightLight.target);

    const rightHeadlightLight = new THREE.SpotLight(0xffee88, 1.2, 18, Math.PI / 6, 0.4, 1);
    rightHeadlightLight.position.set(-0.78, 0.78, 2.67);
    rightHeadlightLight.target.position.set(-0.78, 0.78, 5.5);
    carGroup.add(rightHeadlightLight);
    carGroup.add(rightHeadlightLight.target);

    // Lanternas traseiras (luz vermelha)
    const leftTailLightLight = new THREE.PointLight(0xff2222, 0.7, 4, 2);
    leftTailLightLight.position.set(0.78, 0.78, -2.67);
    carGroup.add(leftTailLightLight);

    const rightTailLightLight = new THREE.PointLight(0xff2222, 0.7, 4, 2);
    rightTailLightLight.position.set(-0.78, 0.78, -2.67);
    carGroup.add(rightTailLightLight);

    // Faixa esportiva central preta
    const centerStripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.04, 5.2),
        new THREE.MeshPhongMaterial({ color: 0x111111 })
    );
    centerStripe.position.set(0, 0.83, 0);
    carGroup.add(centerStripe);

    // Detalhe esportivo no capô (vermelho escuro)
    const hoodDetail = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.04, 0.7),
        new THREE.MeshPhongMaterial({ color: 0x6a040f })
    );
    hoodDetail.position.set(0, 0.82, 1.7);
    carGroup.add(hoodDetail);

    // Placa dianteira
    const licensePlate = new THREE.Mesh(
        new THREE.PlaneGeometry(0.7, 0.22),
        new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            emissive: 0xffcccc,
            emissiveIntensity: 0.1
        })
    );
    licensePlate.position.set(0, 0.55, -2.05);
    licensePlate.rotation.y = Math.PI;
    carGroup.add(licensePlate);

    // Espelhos retrovisores
    const mirrorGeometry = new THREE.BoxGeometry(0.18, 0.08, 0.08);
    const mirrorMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const leftMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    leftMirror.position.set(1.05, 1.12, 0.7);
    leftMirror.rotation.y = Math.PI * 0.12;
    carGroup.add(leftMirror);
    const rightMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    rightMirror.position.set(-1.05, 1.12, 0.7);
    rightMirror.rotation.y = -Math.PI * 0.12;
    carGroup.add(rightMirror);

    carGroup.rotation.y = Math.PI; // Gira o carro 180 graus

    return carGroup;
}

//createGreenSportsCar
// Green sports car
function createGreenSportsCar() {
    const carGroup = new THREE.Group();

    const carRoofColor = 0x388e3c;
    const windowColor = 0xeedddd;
    const wheelColor = 0x000000;
    const detailColor = 0x333333;
    const lightColor = 0xffffcc;

    // Corpo principal
    const carBody = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 1.1, 5.8),
        new THREE.MeshPhongMaterial({ 
        map: carBodyTexture3, // Aplica a textura
        color: 0xffffff,     // Mantém as cores da textura
        shininess: 70
    })
    );
    carBody.position.y = 0.8;
    carBody.castShadow = true;
    carGroup.add(carBody);

    // Teto
    const carRoof = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 1.0, 2.4),
        new THREE.MeshPhongMaterial({ color: carRoofColor })
    );
    carRoof.position.set(0, 1.8, 0);
    carRoof.castShadow = true;
    carGroup.add(carRoof);

    // Rack no teto
    const roofRack = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.15, 2.4),
        new THREE.MeshPhongMaterial({ color: detailColor })
    );
    roofRack.position.set(0, 2.45, 0);
    carGroup.add(roofRack);

    // Aerofólio traseiro ligeiramente inclinado
    const spoiler = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.1, 0.5),
        new THREE.MeshPhongMaterial({ color: detailColor })
    );
    spoiler.position.set(0, 1.4, -2.8);
    spoiler.rotation.x = Math.PI * 0.10;
    carGroup.add(spoiler);

    // Vidros dianteiro e traseiro
    const frontWindow = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.7, 0.1),
        new THREE.MeshPhongMaterial({ color: windowColor, transparent: true, opacity: 0.5 })
    );
    frontWindow.position.set(0, 1.7, 1.1);
    frontWindow.rotation.x = Math.PI * 0.08;
    carGroup.add(frontWindow);

    const backWindow = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.7, 0.1),
        new THREE.MeshPhongMaterial({ color: windowColor, transparent: true, opacity: 0.5 })
    );
    backWindow.position.set(0, 1.7, -1.1);
    backWindow.rotation.x = -Math.PI * 0.08;
    carGroup.add(backWindow);

    // Vidros laterais
    const sideWindowGeometry = new THREE.BoxGeometry(0.1, 0.7, 2.0);
    const sideWindowMaterial = new THREE.MeshPhongMaterial({ color: windowColor, transparent: true, opacity: 0.4 });
    const leftWindow = new THREE.Mesh(sideWindowGeometry, sideWindowMaterial);
    leftWindow.position.set(1.35, 1.7, 0);
    carGroup.add(leftWindow);
    const rightWindow = new THREE.Mesh(sideWindowGeometry, sideWindowMaterial);
    rightWindow.position.set(-1.35, 1.7, 0);
    carGroup.add(rightWindow);

    // Pneus grossos
    const wheelGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 12);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: wheelColor });
    const wheelPositions = [
        {x: -1.4, y: 0.6, z: 2.2},
        {x: 1.4, y: 0.6, z: 2.2},
        {x: -1.4, y: 0.6, z: -2.2},
        {x: 1.4, y: 0.6, z: -2.2}
    ];
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.rotation.z = Math.PI / 2;
        carGroup.add(wheel);
    });

    // Para-choques
    const frontBumper = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.2, 0.3),
        new THREE.MeshPhongMaterial({ color: detailColor })
    );
    frontBumper.position.set(0, 0.6, 2.9);
    carGroup.add(frontBumper);

    const rearBumper = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.2, 0.3),
        new THREE.MeshPhongMaterial({ color: detailColor })
    );
    rearBumper.position.set(0, 0.6, -2.9);
    carGroup.add(rearBumper);

    // Faróis
    const headlightGeometry = new THREE.SphereGeometry(0.18, 12, 12);
    const headlightMaterial = new THREE.MeshPhongMaterial({ color: lightColor, emissive: lightColor, emissiveIntensity: 0.5 });
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(0.7, 1.0, 2.95);
    leftHeadlight.scale.set(1.1, 1.1, 0.5);
    carGroup.add(leftHeadlight);
    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(-0.7, 1.0, 2.95);
    rightHeadlight.scale.set(1.1, 1.1, 0.5);
    carGroup.add(rightHeadlight);

    // Lanternas traseiras
    const tailLightGeometry = new THREE.SphereGeometry(0.13, 10, 10);
    const tailLightMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5 });
    const leftTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
    leftTailLight.position.set(0.7, 1.0, -2.95);
    leftTailLight.scale.set(1.1, 1.1, 0.5);
    carGroup.add(leftTailLight);
    const rightTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
    rightTailLight.position.set(-0.7, 1.0, -2.95);
    rightTailLight.scale.set(1.1, 1.1, 0.5);
    carGroup.add(rightTailLight);

    const leftHeadlightLight = new THREE.SpotLight(0xffee88, 1.2, 18, Math.PI / 6, 0.4, 1);
    leftHeadlightLight.position.set(0.78, 0.78, 2.67);
    leftHeadlightLight.target.position.set(0.78, 0.78, 5.5);
    carGroup.add(leftHeadlightLight);
    carGroup.add(leftHeadlightLight.target);

    const rightHeadlightLight = new THREE.SpotLight(0xffee88, 1.2, 18, Math.PI / 6, 0.4, 1);
    rightHeadlightLight.position.set(-0.78, 0.78, 2.67);
    rightHeadlightLight.target.position.set(-0.78, 0.78, 5.5);
    carGroup.add(rightHeadlightLight);
    carGroup.add(rightHeadlightLight.target);

    // Lanternas traseiras (luz vermelha)
    const leftTailLightLight = new THREE.PointLight(0xff2222, 0.7, 4, 2);
    leftTailLightLight.position.set(0.78, 0.78, -2.67);
    carGroup.add(leftTailLightLight);

    const rightTailLightLight = new THREE.PointLight(0xff2222, 0.7, 4, 2);
    rightTailLightLight.position.set(-0.78, 0.78, -2.67);
    carGroup.add(rightTailLightLight);

    // Detalhe lateral esportivo
    const sideStripe = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.07, 5.2),
        new THREE.MeshPhongMaterial({ color: 0x22ff22 })
    );
    sideStripe.position.set(0, 0.45, 0);
    carGroup.add(sideStripe);

    return carGroup;
}

//createYellowSportsCar
// Yellow sports car
function createYellowSportsCar() {
    const carGroup = new THREE.Group();

    const carRoofColor = 0x333333;
    const windowColor = 0xaaaaaa;
    const wheelColor = 0x555555;
    const detailColor = 0xff0000; 
    const lightColor = 0xffffff;

    // Corpo principal
    const carBody = new THREE.Mesh(
        new THREE.BoxGeometry(3.0, 0.6, 6.0),
        new THREE.MeshPhongMaterial({ 
        map: carBodyTexture4, // Aplica a textura
        color: 0xffffff,     // Mantém as cores da textura
        shininess: 70
    })
    );
    carBody.position.y = 0.6;
    carBody.castShadow = true;
    carGroup.add(carBody);

    // Teto
    const carRoof = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.5, 2.8),
        new THREE.MeshPhongMaterial({ color: carRoofColor })
    );
    carRoof.position.set(0, 1.2, 0.5);
    carRoof.castShadow = true;
    carGroup.add(carRoof);

    // Faixa lateral vermelha
    const sideStripe = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.05, 5.8),
        new THREE.MeshPhongMaterial({ color: detailColor })
    );
    sideStripe.position.set(0, 0.4, 0);
    carGroup.add(sideStripe);

    // Vidros dianteiro e traseiro
    const frontWindow = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 0.4, 0.1),
        new THREE.MeshPhongMaterial({ color: windowColor, transparent: true, opacity: 0.5 })
    );
    frontWindow.position.set(0, 1.1, 1.1);
    frontWindow.rotation.x = Math.PI * 0.08;
    carGroup.add(frontWindow);

    const backWindow = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 0.4, 0.1),
        new THREE.MeshPhongMaterial({ color: windowColor, transparent: true, opacity: 0.5 })
    );
    backWindow.position.set(0, 1.1, -0.7);
    backWindow.rotation.x = -Math.PI * 0.08;
    carGroup.add(backWindow);

    // Vidros laterais
    const sideWindowGeometry = new THREE.BoxGeometry(0.1, 0.35, 2.0);
    const sideWindowMaterial = new THREE.MeshPhongMaterial({ color: windowColor, transparent: true, opacity: 0.4 });
    const leftWindow = new THREE.Mesh(sideWindowGeometry, sideWindowMaterial);
    leftWindow.position.set(1.25, 1.1, 0.2);
    carGroup.add(leftWindow);
    const rightWindow = new THREE.Mesh(sideWindowGeometry, sideWindowMaterial);
    rightWindow.position.set(-1.25, 1.1, 0.2);
    carGroup.add(rightWindow);

    // Rodas
    const wheelGeometry = new THREE.CylinderGeometry(0.55, 0.55, 0.3, 18);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: wheelColor });
    const wheelPositions = [
        {x: -1.3, y: 0.55, z: 2.1}, 
        {x: 1.3, y: 0.55, z: 2.1}, 
        {x: -1.3, y: 0.55, z: -2.1}, 
        {x: 1.3, y: 0.55, z: -2.1}
    ];
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.rotation.z = Math.PI / 2;
        carGroup.add(wheel);
    });

    // Para-choques
    const frontBumper = new THREE.Mesh(
        new THREE.BoxGeometry(2.9, 0.18, 0.32),
        new THREE.MeshPhongMaterial({ color: detailColor })
    );
    frontBumper.position.set(0, 0.45, 2.95);
    carGroup.add(frontBumper);

    const rearBumper = new THREE.Mesh(
        new THREE.BoxGeometry(2.9, 0.18, 0.32),
        new THREE.MeshPhongMaterial({ color: detailColor })
    );
    rearBumper.position.set(0, 0.45, -2.95);
    carGroup.add(rearBumper);

    // Faróis
    const headlightGeometry = new THREE.SphereGeometry(0.16, 10, 10);
    const headlightMaterial = new THREE.MeshPhongMaterial({ color: lightColor, emissive: lightColor, emissiveIntensity: 0.7 });
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(0.7, 0.7, 3.0);
    leftHeadlight.scale.set(1.1, 1.1, 0.5);
    carGroup.add(leftHeadlight);
    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(-0.7, 0.7, 3.0);
    rightHeadlight.scale.set(1.1, 1.1, 0.5);
    carGroup.add(rightHeadlight);

    // Lanternas traseiras
    const tailLightGeometry = new THREE.SphereGeometry(0.13, 10, 10);
    const tailLightMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5 });
    const leftTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
    leftTailLight.position.set(0.7, 0.7, -3.0);
    leftTailLight.scale.set(1.1, 1.1, 0.5);
    carGroup.add(leftTailLight);
    const rightTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
    rightTailLight.position.set(-0.7, 0.7, -3.0);
    rightTailLight.scale.set(1.1, 1.1, 0.5);
    carGroup.add(rightTailLight);

    const leftHeadlightLight = new THREE.SpotLight(0xffee88, 1.2, 18, Math.PI / 6, 0.4, 1);
    leftHeadlightLight.position.set(0.78, 0.78, 2.67);
    leftHeadlightLight.target.position.set(0.78, 0.78, 5.5);
    carGroup.add(leftHeadlightLight);
    carGroup.add(leftHeadlightLight.target);

    const rightHeadlightLight = new THREE.SpotLight(0xffee88, 1.2, 18, Math.PI / 6, 0.4, 1);
    rightHeadlightLight.position.set(-0.78, 0.78, 2.67);
    rightHeadlightLight.target.position.set(-0.78, 0.78, 5.5);
    carGroup.add(rightHeadlightLight);
    carGroup.add(rightHeadlightLight.target);

    // Lanternas traseiras (luz vermelha)
    const leftTailLightLight = new THREE.PointLight(0xff2222, 0.7, 4, 2);
    leftTailLightLight.position.set(0.78, 0.78, -2.67);
    carGroup.add(leftTailLightLight);

    const rightTailLightLight = new THREE.PointLight(0xff2222, 0.7, 4, 2);
    rightTailLightLight.position.set(-0.78, 0.78, -2.67);
    carGroup.add(rightTailLightLight);

    // Detalhe esportivo no capô
    const hoodDetail = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.04, 0.8),
        new THREE.MeshPhongMaterial({ color: 0xffff00 })
    );
    hoodDetail.position.set(0, 0.8, 1.8);
    carGroup.add(hoodDetail);

    return carGroup;
}

// Initialize car models array
function initializeCarModels() {
    carModels.push({
        name: "Blue Racer",
        createFunction: createBlueSportsCar,
        description: "Clássico e veloz"
    });
    carModels.push({
        name: "Red Thunder",
        createFunction: createRedSportsCar,
        description: "Potente e agressivo, feito para vencer"
    });
    carModels.push({
        name: "Green Machine",
        createFunction: createGreenSportsCar,
        description: "SUV desportivo com alta estabilidade"
    });
    carModels.push({
        name: "Black Bolt",
        createFunction: createYellowSportsCar,
        description: "Leve e ágil, perfeito para desviar de obstáculos."
    });
}

// Call this function to initialize the car models
initializeCarModels();

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
restartButton.style.color = '#23243a';
restartButton.style.border = 'none';
restartButton.style.borderRadius = '8px';
restartButton.style.cursor = 'pointer';
restartButton.style.fontWeight = 'bold';
restartButton.style.boxShadow = 'none';
restartButton.style.transition = 'transform 0.1s';
restartButton.innerHTML = 'Restart';
restartButton.onmouseenter = () => restartButton.style.transform = 'scale(1.07)';
restartButton.onmouseleave = () => restartButton.style.transform = 'scale(1)';
gameOverBox.appendChild(restartButton);

const backToMenuButton = document.createElement('button');
backToMenuButton.innerHTML = 'Voltar ao Menu';
backToMenuButton.style.marginTop = '18px';
backToMenuButton.style.padding = '16px 48px';
backToMenuButton.style.fontSize = '24px';
backToMenuButton.style.background = 'linear-gradient(90deg, #FFD700 0%, #FF5500 100%)';
backToMenuButton.style.color = '#23243a';
backToMenuButton.style.border = 'none';
backToMenuButton.style.borderRadius = '8px';
backToMenuButton.style.cursor = 'pointer';
backToMenuButton.style.fontWeight = 'bold';
backToMenuButton.style.boxShadow = 'none';
backToMenuButton.style.transition = 'transform 0.1s';
backToMenuButton.onmouseenter = () => backToMenuButton.style.transform = 'scale(1.07)';
backToMenuButton.onmouseleave = () => backToMenuButton.style.transform = 'scale(1)';
gameOverBox.appendChild(backToMenuButton);

backToMenuButton.addEventListener('click', () => {
    window.location.reload();
});

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
    collisionMusic.pause();
    collisionMusic.currentTime = 0;
    bgMusic.currentTime = 0;
    if (!isMuted) bgMusic.play();
    gameOver = false;
    collisionAnimating = false;
    collisionTime = 0;
    score = 0;
    gameSpeed = 1.0;
    lastSpeedIncrease = 0;
    distanceTraveled = 0;
    scoreElement.innerHTML = `Score: ${score}`;
    
    // Remover o carro atual e criar um novo com o modelo selecionado
    if (car) {
        scene.remove(car);
    }
    car = carModels[selectedCarIndex].createFunction();
    car.position.set(0, 0.1, 5);
    car.rotation.set(0, Math.PI, 0);
    scene.add(car);
    
    // Remover obstáculos existentes
    for (let i = obstacles.length - 1; i >= 0; i--) {
        scene.remove(obstacles[i]);
        obstacles.splice(i, 1);
    }
    
    // Esconder o painel de Game Over
    hideGameOver();
    
    // Resetar posição dos guarda-rails
    leftRailGroup1.position.set(-10, 0, -170);
    leftRailGroup2.position.set(-10, 0, -170 - railLength);
    rightRailGroup1.position.set(10, 0, -170);
    rightRailGroup2.position.set(10, 0, -170 - railLength);
    
    // Garantir visibilidade dos rails
    leftRailGroup1.visible = true;
    leftRailGroup2.visible = true;
    rightRailGroup1.visible = true;
    rightRailGroup2.visible = true;
    
    // Resetar a textura da estrada
    roadTexture.offset.y = 0;
    
    // Forçar atualização imediata
    score = 0;
    scoreElement.innerHTML = `Score: ${score}`;
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
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

    updateAirplane(clampedDelta);

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
                // Pare a música de fundo e toque a de colisão
                bgMusic.pause();
                bgMusic.currentTime = 0;
                collisionMusic.currentTime = 0;
                collisionMusic.play();
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


function applyNightMode(night) {
    if (night) {
        // Escurece o ambiente
        ambientLight.intensity = 0.18;
        directionalLight.intensity = 0.15;
        pointLight.intensity = 0.7;
        scene.background = new THREE.Color(0x0a0a18);

        // Escurece o skybox (opcional: use uma textura de céu noturno se tiver)
        for (let i = 0; i < 6; i++) {
            materialArray[i].color = new THREE.Color(0x111122);
            materialArray[i].needsUpdate = true;
        }

        // Aumenta a intensidade dos faróis dos carros (se quiser)
        scene.traverse(obj => {
            if (obj.isSpotLight && obj.color.getHex() === 0xffee88) obj.intensity = 2.2;
            if (obj.isPointLight && obj.color.getHex() === 0xff2222) obj.intensity = 1.2;
        });
    } else {
        // Volta ao modo dia
        ambientLight.intensity = 0.6;
        directionalLight.intensity = 0.8;
        pointLight.intensity = 1.5;
        scene.background = null;

        // Restaura o skybox normal
        for (let i = 0; i < 6; i++) {
            materialArray[i].color = new THREE.Color(0xffffff);
            materialArray[i].needsUpdate = true;
        }

        // Restaura intensidade dos faróis
        scene.traverse(obj => {
            if (obj.isSpotLight && obj.color.getHex() === 0xffee88) obj.intensity = 1.2;
            if (obj.isPointLight && obj.color.getHex() === 0xff2222) obj.intensity = 0.7;
        });
    }
}

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

// Add before the startScreen initialization
//botao noite
const nightModeButton = document.createElement('button');
nightModeButton.innerHTML = '🌙 Modo Noite';
nightModeButton.style.width = '100%';
nightModeButton.style.padding = '8px';
nightModeButton.style.marginTop = '10px';
nightModeButton.style.backgroundColor = '#23243a';
nightModeButton.style.color = '#FFD700';
nightModeButton.style.border = 'none';
nightModeButton.style.borderRadius = '6px';
nightModeButton.style.cursor = 'pointer';
controlsPanel.appendChild(nightModeButton);

nightModeButton.addEventListener('click', () => {
    isNightMode = !isNightMode;
    applyNightMode(isNightMode);
    nightModeButton.innerHTML = isNightMode ? '☀️ Modo Dia' : '🌙 Modo Noite';
});


// Setup for car preview
let carPreviewScene, carPreviewCamera, carPreviewRenderer;
let carPreviewModel;

function initCarPreview() {
    // Create scene
    carPreviewScene = new THREE.Scene();
    carPreviewScene.background = new THREE.Color(0x111122);
    
    // Create camera
    carPreviewCamera = new THREE.PerspectiveCamera(40, 400/240, 0.1, 1000);
    carPreviewCamera.position.set(0, 3, 8);
    carPreviewCamera.lookAt(0, 0, 0);
    
    // Create renderer
    carPreviewRenderer = new THREE.WebGLRenderer({ antialias: true });
    carPreviewRenderer.setSize(400, 240);
    carPreviewRenderer.shadowMap.enabled = true;
    
    // Add lighting to the preview scene
    const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
    carPreviewScene.add(ambLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    carPreviewScene.add(dirLight);
    
    
    // Add renderer to the DOM
    document.getElementById('car-preview').appendChild(carPreviewRenderer.domElement);
    
    // Start animation
    animateCarPreview();
}

function updateCarPreview() {
    // Remove current car model if it exists
    if (carPreviewModel) {
        carPreviewScene.remove(carPreviewModel);
    }
    
    // Create new car model based on selected index
    carPreviewModel = carModels[selectedCarIndex].createFunction();
    carPreviewScene.add(carPreviewModel);
    
    // Update car info text
    document.getElementById('car-name').innerHTML = carModels[selectedCarIndex].name;
    document.getElementById('car-description').innerHTML = carModels[selectedCarIndex].description;
}

function animateCarPreview() {
    requestAnimationFrame(animateCarPreview);
    
    // Rotate car model for better visualization
    if (carPreviewModel) {
        carPreviewModel.rotation.y += 0.01;
        carPreviewModel.rotation.x = Math.sin(Date.now() * 0.001) * 0.1; // Adiciona leve movimento de oscilação
        carPreviewModel.position.x = -1;
        carPreviewModel.position.z = -1;
    }
    
    carPreviewRenderer.render(carPreviewScene, carPreviewCamera);
}

// ===== NOVA TELA INICIAL COM SELEÇÃO MAIS BONITA =====
const startScreen = document.createElement('div');
startScreen.style.position = 'absolute';
startScreen.style.top = '0';
startScreen.style.left = '0';
startScreen.style.width = '100vw';
startScreen.style.height = '100vh';
startScreen.style.background = 'radial-gradient(ellipse at 60% 40%, #2b2d42 60%, #1a1a2e 100%)';
startScreen.style.display = 'flex';
startScreen.style.flexDirection = 'column';
startScreen.style.alignItems = 'center';
startScreen.style.justifyContent = 'center';
startScreen.style.zIndex = '2000';
startScreen.style.transition = 'opacity 0.s';
startScreen.style.opacity = '1';
startScreen.style.overflow = 'auto';


// Adicione antes do startScreen.appendChild(title);
let selectedTerrain = 0; // 0 = normal, 1 = deserto

// Botões de seleção de terreno
const terrainContainer = document.createElement('div');
terrainContainer.style.display = 'flex';
terrainContainer.style.flexDirection = 'column'; // <-- vertical
terrainContainer.style.alignItems = 'flex-end';   // <-- alinha à direita
terrainContainer.style.position = 'absolute';     // <-- posiciona absoluto
terrainContainer.style.top = '300px';              // <-- distância do topo
terrainContainer.style.right = '200px';            // <-- distância da direita
terrainContainer.style.gap = '18px';
terrainContainer.style.zIndex = '2100'; 

const normalButton = document.createElement('button');
normalButton.innerHTML = 'Terreno Normal';
normalButton.style.padding = '10px 28px';
normalButton.style.fontSize = '16px';
normalButton.style.background = 'linear-gradient(90deg, #2b2d42 0%, #3a2c4a 100%)';
normalButton.style.color = '#FFD700';
normalButton.style.border = 'none';
normalButton.style.borderRadius = '8px';
normalButton.style.cursor = 'pointer';
normalButton.style.fontWeight = 'bold';
normalButton.style.transition = 'background 0.2s, color 0.2s, transform 0.1s';
normalButton.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.15)';
normalButton.style.outline = '2px solid #FFD700';

const desertButton = document.createElement('button');
desertButton.innerHTML = 'Terreno Deserto';
desertButton.style.padding = '10px 28px';
desertButton.style.fontSize = '16px';
desertButton.style.background = 'linear-gradient(90deg, #FFD700 0%, #FF5500 100%)';
desertButton.style.color = '#23243a';
desertButton.style.border = 'none';
desertButton.style.borderRadius = '8px';
desertButton.style.cursor = 'pointer';
desertButton.style.fontWeight = 'bold';
desertButton.style.transition = 'background 0.2s, color 0.2s, transform 0.1s';
desertButton.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.15)';
desertButton.style.outline = 'none';

const neveButton = document.createElement('button');
neveButton.innerHTML = 'Terreno Neve';
neveButton.style.padding = '10px 28px';
neveButton.style.fontSize = '16px';
neveButton.style.background = 'linear-gradient(90deg, #FFD700 0%, #FF5500 100%)';
neveButton.style.color = '#23243a';
neveButton.style.border = 'none';
neveButton.style.borderRadius = '8px';
neveButton.style.cursor = 'pointer';
neveButton.style.fontWeight = 'bold';
neveButton.style.transition = 'background 0.2s, color 0.2s, transform 0.1s';
neveButton.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.15)';
neveButton.style.outline = 'none';

terrainContainer.appendChild(normalButton);
terrainContainer.appendChild(desertButton);
terrainContainer.appendChild(neveButton);
startScreen.appendChild(terrainContainer);

// Troca visual e estado ao clicar
function updateTerrainButtons() {
    // Resetar todos para o estado "não selecionado"
    normalButton.style.outline = 'none';
    normalButton.style.background = 'linear-gradient(90deg, #FFD700 0%, #FF5500 100%)';
    normalButton.style.color = '#23243a';

    desertButton.style.outline = 'none';
    desertButton.style.background = 'linear-gradient(90deg, #FFD700 0%, #FF5500 100%)';
    desertButton.style.color = '#23243a';

    neveButton.style.outline = 'none';
    neveButton.style.background = 'linear-gradient(90deg, #FFD700 0%, #FF5500 100%)';
    neveButton.style.color = '#23243a';

    // Destaca o selecionado
    if (selectedTerrain === 0) {
        normalButton.style.outline = '2px solid #FFD700';
        normalButton.style.background = 'linear-gradient(90deg, #2b2d42 0%, #3a2c4a 100%)';
        normalButton.style.color = '#FFD700';
    } else if (selectedTerrain === 1) {
        desertButton.style.outline = '2px solid #FFD700';
        desertButton.style.background = 'linear-gradient(90deg, #2b2d42 0%, #3a2c4a 100%)';
        desertButton.style.color = '#FFD700';
    } else if (selectedTerrain === 2) {
        neveButton.style.outline = '2px solid #FFD700';
        neveButton.style.background = 'linear-gradient(90deg, #2b2d42 0%, #3a2c4a 100%)';
        neveButton.style.color = '#FFD700';
    }
}
normalButton.onclick = () => { selectedTerrain = 0; updateTerrainButtons(); };
desertButton.onclick = () => { selectedTerrain = 1; updateTerrainButtons(); };
neveButton.onclick = () => { selectedTerrain = 2; updateTerrainButtons(); };


updateTerrainButtons();

// Título estilizado
const title = document.createElement('div');
title.innerHTML = 'HYPER DRIVE';
title.style.color = '#FFD700';
title.style.fontSize = '48px'; // um pouco maior
title.style.fontWeight = 'bold';
title.style.letterSpacing = '5px';
title.style.textShadow = '0 4px 16px #000, 0 1px 0 #fff';
title.style.marginBottom = '16px';
title.style.marginTop = '32px';
title.style.fontFamily = 'Orbitron, Arial, sans-serif';
startScreen.appendChild(title);

// Subtítulo
const subtitle = document.createElement('div');
subtitle.innerHTML = 'Desvie dos carros e faça a maior pontuação!';
subtitle.style.color = '#fff';
subtitle.style.fontSize = '20px'; // um pouco maior
subtitle.style.marginBottom = '28px';
subtitle.style.textAlign = 'center';
subtitle.style.fontFamily = 'Montserrat, Arial, sans-serif';
subtitle.style.textShadow = '0 1px 4px #000';
startScreen.appendChild(subtitle);

// Car selection container
const carSelectionContainer = document.createElement('div');
carSelectionContainer.style.display = 'flex';
carSelectionContainer.style.flexDirection = 'column';
carSelectionContainer.style.alignItems = 'center';
carSelectionContainer.style.marginBottom = '24px';
carSelectionContainer.style.width = '100%';
carSelectionContainer.style.maxWidth = '420px'; // maior
carSelectionContainer.style.background = 'rgba(30,30,50,0.85)';
carSelectionContainer.style.borderRadius = '16px';
carSelectionContainer.style.boxShadow = '0 4px 16px 0 rgba(0,0,0,0.45)';
carSelectionContainer.style.padding = '22px 16px 18px 16px';
carSelectionContainer.style.backdropFilter = 'blur(2px)';
startScreen.appendChild(carSelectionContainer);

// Título da seleção
const selectionTitle = document.createElement('div');
selectionTitle.innerHTML = 'Escolha seu carro';
selectionTitle.style.color = '#FFD700';
selectionTitle.style.fontSize = '22px';
selectionTitle.style.marginBottom = '10px';
selectionTitle.style.fontWeight = 'bold';
selectionTitle.style.letterSpacing = '1px';
selectionTitle.style.fontFamily = 'Orbitron, Arial, sans-serif';
carSelectionContainer.appendChild(selectionTitle);

// Car display container (preview 3D)
const carDisplayContainer = document.createElement('div');
carDisplayContainer.style.position = 'relative';
carDisplayContainer.style.width = '320px'; // maior
carDisplayContainer.style.height = '170px'; // maior
carDisplayContainer.style.marginBottom = '10px';
carDisplayContainer.style.background = 'linear-gradient(120deg, #23243a 60%, #3a2c4a 100%)';
carDisplayContainer.style.borderRadius = '12px';
carDisplayContainer.style.padding = '6px';
carDisplayContainer.style.boxShadow = '0 4px 16px 0 rgba(0,0,0,0.3)';
carDisplayContainer.style.display = 'flex';
carDisplayContainer.style.justifyContent = 'center';
carDisplayContainer.style.alignItems = 'flex-end';
carSelectionContainer.appendChild(carDisplayContainer);

// Car preview renderer
const carPreviewRendererDiv = document.createElement('div');
carPreviewRendererDiv.id = 'car-preview';
carPreviewRendererDiv.style.width = '100%';
carPreviewRendererDiv.style.height = '100%';
carPreviewRendererDiv.style.borderRadius = '10px';
carPreviewRendererDiv.style.overflow = 'hidden';
carDisplayContainer.appendChild(carPreviewRendererDiv);

// Car info
const carInfoContainer = document.createElement('div');
carInfoContainer.style.display = 'flex';
carInfoContainer.style.flexDirection = 'column';
carInfoContainer.style.alignItems = 'center';
carInfoContainer.style.marginBottom = '10px';
carSelectionContainer.appendChild(carInfoContainer);

const carName = document.createElement('div');
carName.id = 'car-name';
carName.style.color = '#FFD700';
carName.style.fontSize = '18px';
carName.style.fontWeight = 'bold';
carName.style.marginBottom = '4px';
carName.style.fontFamily = 'Orbitron, Arial, sans-serif';
carInfoContainer.appendChild(carName);

const carDescription = document.createElement('div');
carDescription.id = 'car-description';
carDescription.style.color = '#CCC';
carDescription.style.fontSize = '13px';
carDescription.style.textAlign = 'center';
carDescription.style.maxWidth = '260px';
carDescription.style.fontFamily = 'Montserrat, Arial, sans-serif';
carInfoContainer.appendChild(carDescription);

// Navegação dos carros
const navButtonsContainer = document.createElement('div');
navButtonsContainer.style.display = 'flex';
navButtonsContainer.style.width = '100%';
navButtonsContainer.style.justifyContent = 'space-between';
navButtonsContainer.style.padding = '0 28px';
carSelectionContainer.appendChild(navButtonsContainer);

const prevButton = document.createElement('button');
prevButton.innerHTML = '<';
prevButton.style.padding = '8px 18px';
prevButton.style.fontSize = '16px';
prevButton.style.background = 'linear-gradient(90deg, #23243a 0%, #3a2c4a 100%)';
prevButton.style.color = '#FFD700';
prevButton.style.border = 'none';
prevButton.style.borderRadius = '8px';
prevButton.style.cursor = 'pointer';
prevButton.style.fontWeight = 'bold';
prevButton.style.transition = 'background 0.2s, color 0.2s';
prevButton.onmouseenter = () => {
    prevButton.style.background = '#FFD700';
    prevButton.style.color = '#23243a';
};
prevButton.onmouseleave = () => {
    prevButton.style.background = 'linear-gradient(90deg, #23243a 0%, #3a2c4a 100%)';
    prevButton.style.color = '#FFD700';
};
navButtonsContainer.appendChild(prevButton);

const nextButton = document.createElement('button');
nextButton.innerHTML = '>';
nextButton.style.padding = '8px 18px';
nextButton.style.fontSize = '16px';
nextButton.style.background = 'linear-gradient(90deg, #23243a 0%, #3a2c4a 100%)';
nextButton.style.color = '#FFD700';
nextButton.style.border = 'none';
nextButton.style.borderRadius = '8px';
nextButton.style.cursor = 'pointer';
nextButton.style.fontWeight = 'bold';
nextButton.style.transition = 'background 0.2s, color 0.2s';
nextButton.onmouseenter = () => {
    nextButton.style.background = '#FFD700';
    nextButton.style.color = '#23243a';
};
nextButton.onmouseleave = () => {
    nextButton.style.background = 'linear-gradient(90deg, #23243a 0%, #3a2c4a 100%)';
    nextButton.style.color = '#FFD700';
};
navButtonsContainer.appendChild(nextButton);

// Eventos de navegação
prevButton.addEventListener('click', () => {
    selectedCarIndex = (selectedCarIndex - 1 + carModels.length) % carModels.length;
    updateCarPreview();
});
nextButton.addEventListener('click', () => {
    selectedCarIndex = (selectedCarIndex + 1) % carModels.length;
    updateCarPreview();
});

// Botão de iniciar
const startButton = document.createElement('button');
startButton.innerHTML = 'Jogar';
startButton.style.padding = '14px 54px';
startButton.style.fontSize = '22px';
startButton.style.background = 'linear-gradient(90deg, #FFD700 0%, #FF5500 100%)';
startButton.style.color = '#23243a';
startButton.style.border = 'none';
startButton.style.borderRadius = '12px';
startButton.style.cursor = 'pointer';
startButton.style.fontWeight = 'bold';
startButton.style.boxShadow = 'none';
startButton.style.transition = 'transform 0.1s, background 0.3s';
startButton.style.marginTop = '18px';
startButton.onmouseenter = () => startButton.style.transform = 'scale(1.08)';
startButton.onmouseleave = () => startButton.style.transform = 'scale(1)';
carSelectionContainer.appendChild(startButton);

document.body.appendChild(startScreen);

// Esconde todos os elementos do jogo até clicar em Start
renderer.domElement.style.filter = 'blur(6px)';
controlsPanel.style.display = 'none';
scoreElement.style.display = 'none';

// Inicializa os modelos e preview
initializeCarModels();
window.addEventListener('load', () => {
    initCarPreview();
    updateCarPreview();
});

// Atualiza o startGame para usar o botão novo
let car;
startButton.addEventListener('click', startGame);

function startGame() {
    if (selectedTerrain === 0) {
        // Terreno normal
        materialArray[0].map = texture_ft;
        materialArray[1].map = texture_bk;
        materialArray[2].map = texture_up;
        materialArray[3].map = texture_dn;
        materialArray[4].map = texture_rt;
        materialArray[5].map = texture_lf;
    } else if (selectedTerrain === 1) {
        // Terreno deserto
        materialArray[0].map = texture_ft2;
        materialArray[1].map = texture_bk2;
        materialArray[2].map = texture_up2;
        materialArray[3].map = texture_dn2;
        materialArray[4].map = texture_rt2;
        materialArray[5].map = texture_lf2;
    }else if (selectedTerrain === 2) {
        // Terreno neve
        materialArray[0].map = texture_ft3;
        materialArray[1].map = texture_bk3;
        materialArray[2].map = texture_up3;
        materialArray[3].map = texture_dn3;
        materialArray[4].map = texture_rt3;
        materialArray[5].map = texture_lf3;
    }

    // Atualiza as texturas do skybox
    for (let i = 0; i < 6; i++) {
        materialArray[i].needsUpdate = true;
    }
    car = carModels[selectedCarIndex].createFunction();
    car.position.set(0, 0.1, 5);
    car.rotation.y = Math.PI;
    scene.add(car);

    initializeAirplane();

    startScreen.style.opacity = '0';
    setTimeout(() => {
        startScreen.style.display = 'none';
        renderer.domElement.style.filter = '';
        controlsPanel.style.display = '';
        scoreElement.style.display = '';
        pauseButton.style.display = '';
        muteButton.style.display = '';
        bgMusic.play();
        animate();
    }, 700);
}

// Só inicia o jogo ao clicar no botão
startButton.addEventListener('click', startGame);

// Impede que o jogo inicie automaticamente
// Remova ou comente a chamada direta a animate() no final do arquivo
// animate();

// ===== BOTÃO DE PAUSA E MENU DE PAUSA =====

// Cria o botão de pausa
const pauseButton = document.createElement('button');
pauseButton.innerHTML = '⏸️';
pauseButton.title = 'Pausar';
pauseButton.style.position = 'absolute';
pauseButton.style.top = 'unset';
pauseButton.style.bottom = '20px';
pauseButton.style.right = '20px';
pauseButton.style.zIndex = '3000';
pauseButton.style.fontSize = '32px';
pauseButton.style.background = 'rgba(30,30,50,0.85)';
pauseButton.style.color = '#FFD700';
pauseButton.style.border = 'none';
pauseButton.style.borderRadius = '50%';
pauseButton.style.width = '56px';
pauseButton.style.height = '56px';
pauseButton.style.cursor = 'pointer';
pauseButton.style.boxShadow = '0 4px 16px 0 rgba(0,0,0,0.25)';
pauseButton.style.transition = 'background 0.2s, transform 0.1s';
pauseButton.style.display = 'none';
pauseButton.onmouseenter = () => pauseButton.style.background = '#FFD700';
pauseButton.onmouseleave = () => pauseButton.style.background = 'rgba(30,30,50,0.85)';
document.body.appendChild(pauseButton);

// Cria o menu de pausa (inicialmente oculto)
const pauseMenuContainer = document.createElement('div');
pauseMenuContainer.style.position = 'absolute';
pauseMenuContainer.style.top = '0';
pauseMenuContainer.style.left = '0';
pauseMenuContainer.style.width = '100vw';
pauseMenuContainer.style.height = '100vh';
pauseMenuContainer.style.display = 'flex';
pauseMenuContainer.style.alignItems = 'center';
pauseMenuContainer.style.justifyContent = 'center';
pauseMenuContainer.style.background = 'rgba(0,0,0,0.65)';
pauseMenuContainer.style.backdropFilter = 'blur(4px)';
pauseMenuContainer.style.zIndex = '4000';
pauseMenuContainer.style.transition = 'opacity 0.5s';
pauseMenuContainer.style.opacity = '0';
pauseMenuContainer.style.pointerEvents = 'none';
document.body.appendChild(pauseMenuContainer);

const pauseMenuBox = document.createElement('div');
pauseMenuBox.style.background = 'rgba(30,30,40,0.95)';
pauseMenuBox.style.borderRadius = '18px';
pauseMenuBox.style.boxShadow = '0 8px 32px 0 rgba(0,0,0,0.45)';
pauseMenuBox.style.padding = '48px 48px 32px 48px';
pauseMenuBox.style.display = 'flex';
pauseMenuBox.style.flexDirection = 'column';
pauseMenuBox.style.alignItems = 'center';
pauseMenuBox.style.animation = 'popIn 0.7s cubic-bezier(.68,-0.55,.27,1.55)';
pauseMenuContainer.appendChild(pauseMenuBox);

const pauseTitle = document.createElement('div');
pauseTitle.innerHTML = 'PAUSED';
pauseTitle.style.color = '#FFD700';
pauseTitle.style.fontSize = '54px';
pauseTitle.style.fontWeight = 'bold';
pauseTitle.style.letterSpacing = '2px';
pauseTitle.style.textShadow = '0 4px 24px #000, 0 1px 0 #fff';
pauseTitle.style.marginBottom = '32px';
pauseMenuBox.appendChild(pauseTitle);

// Botão de reiniciar no menu de pausa
const pauseRestartButton = document.createElement('button');
pauseRestartButton.innerHTML = 'Reiniciar';
pauseRestartButton.style.marginTop = '10px';
pauseRestartButton.style.padding = '16px 48px';
pauseRestartButton.style.fontSize = '24px';
pauseRestartButton.style.background = 'linear-gradient(90deg, #FF5500 0%, #FFB300 100%)';
pauseRestartButton.style.color = '#23243a';
pauseRestartButton.style.border = 'none';
pauseRestartButton.style.borderRadius = '8px';
pauseRestartButton.style.cursor = 'pointer';
pauseRestartButton.style.fontWeight = 'bold';
pauseRestartButton.style.boxShadow = 'none';
pauseRestartButton.style.transition = 'transform 0.1s';
pauseRestartButton.onmouseenter = () => pauseRestartButton.style.transform = 'scale(1.07)';
pauseRestartButton.onmouseleave = () => pauseRestartButton.style.transform = 'scale(1)';
pauseMenuBox.appendChild(pauseRestartButton);

// Botão de voltar ao menu inicial no menu de pausa
const pauseBackToMenuButton = document.createElement('button');
pauseBackToMenuButton.innerHTML = 'Voltar ao Menu';
pauseBackToMenuButton.style.marginTop = '18px';
pauseBackToMenuButton.style.padding = '16px 48px';
pauseBackToMenuButton.style.fontSize = '24px';
pauseBackToMenuButton.style.background = 'linear-gradient(90deg, #FFD700 0%, #FF5500 100%)';
pauseBackToMenuButton.style.color = '#23243a';
pauseBackToMenuButton.style.border = 'none';
pauseBackToMenuButton.style.borderRadius = '8px';
pauseBackToMenuButton.style.cursor = 'pointer';
pauseBackToMenuButton.style.fontWeight = 'bold';
pauseBackToMenuButton.style.boxShadow = 'none';
pauseBackToMenuButton.style.transition = 'transform 0.1s';
pauseBackToMenuButton.onmouseenter = () => pauseBackToMenuButton.style.transform = 'scale(1.07)';
pauseBackToMenuButton.onmouseleave = () => pauseBackToMenuButton.style.transform = 'scale(1)';
pauseMenuBox.appendChild(pauseBackToMenuButton);

// texto PRECIONE ESC PARA SAIR DO PAUSE
const pauseText = document.createElement('div');
pauseText.style.marginTop = '24px';
pauseText.innerHTML = 'Pressione ESC para sair do menu';
pauseText.style.color = '#fff';
pauseMenuBox.appendChild(pauseText);

// Variável para controlar o estado de pausa
let isPaused = false;

// Funções para mostrar/ocultar o menu de pausa
function showPauseMenu() {
    pauseMenuContainer.style.opacity = '1';
    pauseMenuContainer.style.pointerEvents = 'auto';
    isPaused = true;
}
function hidePauseMenu() {
    pauseMenuContainer.style.opacity = '0';
    pauseMenuContainer.style.pointerEvents = 'none';
    isPaused = false;
}

// Evento do botão de pausa
pauseButton.addEventListener('click', () => {
    if (!isPaused) {
        showPauseMenu();
    }
});

// Evento para reiniciar pelo menu de pausa
pauseRestartButton.addEventListener('click', () => {
    hidePauseMenu();
    // Chama o mesmo código do botão de restart do game over
    // (Você pode extrair para uma função se quiser evitar duplicação)
    gameOver = false;
    collisionAnimating = false;
    collisionTime = 0;
    score = 0;
    gameSpeed = 1.0;
    lastSpeedIncrease = 0;
    distanceTraveled = 0;
    scoreElement.innerHTML = `Score: ${score}`;
    if (car) scene.remove(car);
    car = carModels[selectedCarIndex].createFunction();
    car.position.set(0, 0.1, 5);
    car.rotation.set(0, Math.PI, 0);
    scene.add(car);
    for (let i = obstacles.length - 1; i >= 0; i--) {
        scene.remove(obstacles[i]);
        obstacles.splice(i, 1);
    }
    leftRailGroup1.position.set(-10, 0, -170);
    leftRailGroup2.position.set(-10, 0, -170 - railLength);
    rightRailGroup1.position.set(10, 0, -170);
    rightRailGroup2.position.set(10, 0, -170 - railLength);
    leftRailGroup1.visible = true;
    leftRailGroup2.visible = true;
    rightRailGroup1.visible = true;
    rightRailGroup2.visible = true;
    roadTexture.offset.y = 0;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    lastTime = performance.now();
    animate(lastTime);
});

// Evento para voltar ao menu inicial pelo menu de pausa
pauseBackToMenuButton.addEventListener('click', () => {
    window.location.reload();
});

// Pausa o loop de animação quando o menu de pausa está aberto
const originalAnimate = animate;
function animateWrapper(currentTime = 0) {
    if (isPaused) return; // Não anima se estiver pausado
    originalAnimate(currentTime);
}
animate = animateWrapper;

// Se você chama animate() em algum lugar, chame animate() normalmente.
// Para permitir sair do pause, adicione um evento de teclado:
document.addEventListener('keydown', (e) => {
    if (isPaused && (e.key === 'Escape')) {
        hidePauseMenu();
        animate(performance.now());
    }
});

// ===== BOTÃO DE MUTE/DESMUTE DA MÚSICA =====
const muteButton = document.createElement('button');
muteButton.innerHTML = '🔊';
muteButton.title = 'Mutar música';
muteButton.style.position = 'absolute';
muteButton.style.left = '20px';
muteButton.style.bottom = '20px';
muteButton.style.zIndex = '3000';
muteButton.style.fontSize = '28px';
muteButton.style.background = 'rgba(30,30,50,0.85)';
muteButton.style.color = '#FFD700';
muteButton.style.border = 'none';
muteButton.style.borderRadius = '50%';
muteButton.style.width = '48px';
muteButton.style.height = '48px';
muteButton.style.cursor = 'pointer';
muteButton.style.boxShadow = '0 4px 16px 0 rgba(0,0,0,0.25)';
muteButton.style.transition = 'background 0.2s, transform 0.1s';
muteButton.style.display = 'none';
muteButton.onmouseenter = () => muteButton.style.background = '#FFD700';
muteButton.onmouseleave = () => muteButton.style.background = 'rgba(30,30,50,0.85)';
document.body.appendChild(muteButton);

let isMuted = false;
muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    collisionMusic.muted = isMuted;
    muteButton.innerHTML = isMuted ? '🔇' : '🔊';
    muteButton.title = isMuted ? 'Desmutar música' : 'Mutar música';
});