let cycleIndex = 0; // Índice do par atual no ciclo
const imageSpeedFactor = 200; // Fator para sincronizar a velocidade com a rotação da Terra
const initialPositions = [
    { left: 1500, top: 100 }, // Posição inicial para a primeira imagem
    { left: 750, top: 300 }, // Posição inicial para a segunda imagem
    { left: 780, top: '50%' }, // Posição inicial para a terceira imagem
    { left: 40, top: '5%' }, // Posição inicial para a quarta imagem
    { left: 70, top: '10%' }, // Posição inicial para a quinta imagem
    { left: 70, top: '50%' }, // Posição inicial para a sexta imagem
    { left: 80, top: '30%' }, // Posição inicial para a sétima imagem
    { left: 20, top: '70%' }, // Posição inicial para a oitava imagem
];

let cycleCompleted = false; // Flag para verificar se o ciclo foi completado

// Função principal
function main() {
    const canvas = document.querySelector('#c');

    // Configuração do Three.js
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);

    // Configuração do planeta
    const earthGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
        roughness: 1,
        metalness: 0,
        map: new THREE.TextureLoader().load('texture/earthmap1k.jpg'),
        bumpMap: new THREE.TextureLoader().load('texture/earthbump.jpg'),
        bumpScale: 0.3,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    // Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointerLight = new THREE.PointLight(0xffffff, 0.9);
    pointerLight.position.set(5, 3, 5);
    scene.add(pointerLight);

    // Nuvens
    const cloudGeometry = new THREE.SphereGeometry(0.63, 32, 32);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('texture/earthCloud.png'),
        transparent: true,
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(cloudMesh);

    // Função de animação
    function animate() {
        requestAnimationFrame(animate);

        // Rotação da Terra e nuvens
        earthMesh.rotation.y -= 0.0025; // Rotação do planeta
        cloudMesh.rotation.y += 0.0015; // Rotação das nuvens

        moveAllImagesLeft(0.0025); // Chama a função para mover todas as imagens
        renderer.render(scene, camera);
    }

    animate();
    startImageCycle(); // Inicia o ciclo de imagens
}

// Função para mover todas as imagens para a esquerda
function moveAllImagesLeft(speed) {
    const images = document.querySelectorAll('.cycle-image'); // Seleciona todas as imagens
    let allImagesOutOfScreen = true; // Flag para verificar se todas as imagens saíram da tela

    images.forEach((image) => {
        const currentLeft = parseFloat(image.style.left); // Pega a posição atual
        if (!isNaN(currentLeft)) {
            // Se a imagem ultrapassar a tela, reinicia a posição
            if (currentLeft < -200) {
                image.style.left = `${window.innerWidth}px`; // Define a posição inicial à direita
            } else {
                image.style.left = `${currentLeft - speed * imageSpeedFactor}px`; // Move para a esquerda
            }
            if (currentLeft > -200) {
                allImagesOutOfScreen = false; // Se qualquer imagem ainda não saiu da tela, não completou o ciclo
            }
        }
    });

    // Se todas as imagens saíram da tela, reseta suas posições
    if (allImagesOutOfScreen && !cycleCompleted) {
        cycleCompleted = true; // Marca o ciclo como completo
        resetImagesPosition(); // Resetando as posições das imagens
        cycleCompleted = false; // Reconfigura a flag para o próximo ciclo
    }
}

// Função de ciclo das imagens
function startImageCycle() {
    const images = document.querySelectorAll('.cycle-image'); // Seleciona todas as imagens
    const totalImages = images.length; // Total de imagens (8)

    setInterval(() => {
        // Ocultar o par atual
        const currentImg1Index = cycleIndex % totalImages;
        const currentImg2Index = (cycleIndex + 1) % totalImages;

        images[currentImg1Index].style.opacity = 0;
        images[currentImg2Index].style.opacity = 0;

        // Avançar para o próximo par após o fade-out
        setTimeout(() => {
            const nextImg1Index = (cycleIndex + 2) % totalImages;
            const nextImg2Index = (cycleIndex + 3) % totalImages;

            images[nextImg1Index].style.opacity = 1;
            images[nextImg2Index].style.opacity = 1;

            // Atualizar o índice do ciclo
            cycleIndex = (cycleIndex + 2) % totalImages;
        }, 1000); // Delay para garantir o fade-out antes do fade-in
    }, 5000); // Troca a cada 5 segundos
}

// Função para resetar todas as imagens para suas posições iniciais
function resetImagesPosition() {
    const images = document.querySelectorAll('.cycle-image');
    images.forEach((image, index) => {
        const position = initialPositions[index];
        // Resetando a posição exata com margem de segurança
        image.style.left = `${position.left}px`;
        image.style.top = position.top;
        image.style.opacity = 1; // Assegura que todas as imagens estão visíveis ao serem resetadas
    });
}

window.onload = main;
