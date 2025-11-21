// --- 1. Typewriter Effect ---
const phrases = ["Full Stack Developer", "AIML Enthusiast", "Problem Solver", "Tech Explorer"];
let currentPhraseIndex = 0, isDeleting = false, txt = '', typeSpeed = 100;

function typeWriter() {
    const phrase = phrases[currentPhraseIndex];
    const el = document.getElementById('typewriter');
    if (isDeleting) { txt = phrase.substring(0, txt.length - 1); typeSpeed = 50; } 
    else { txt = phrase.substring(0, txt.length + 1); typeSpeed = 150; }
    el.innerHTML = txt;
    if (!isDeleting && txt === phrase) { typeSpeed = 2000; isDeleting = true; } 
    else if (isDeleting && txt === '') { isDeleting = false; currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length; typeSpeed = 500; }
    setTimeout(typeWriter, typeSpeed);
}
document.addEventListener('DOMContentLoaded', typeWriter);

// --- 2. Three.js: Load Custom Avatar (Iron Man) ---
const initAvatar = () => {
    const container = document.getElementById('avatar-container');
    if (!container) return;

    const scene = new THREE.Scene();
    // Camera
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5; 
    camera.position.y = 0;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load Iron Man Model
    let model;
    const loader = new THREE.GLTFLoader();
    
    // CHANGED: Loading 'iron_man.glb' from root
    loader.load('iron_man.glb', (gltf) => {
        model = gltf.scene;
        
        // Scale adjustments (You might need to change 1.5 to smaller/larger depending on the model size)
        model.scale.set(1.5, 1.5, 1.5); 
        model.position.y = -1; // Move down slightly
        scene.add(model);
        
    }, undefined, (error) => {
        console.error('Error loading iron_man.glb:', error);
    });

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        if (model) {
            // Smooth rotation towards mouse
            model.rotation.y += 0.05 * (mouseX - model.rotation.y);
            model.rotation.x += 0.05 * (mouseY - model.rotation.x);
        }
        renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
        const w = container.clientWidth, h = container.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
};
document.addEventListener('DOMContentLoaded', initAvatar);


// --- 3. Three.js: Load Custom Gear (Flower) ---
const initGear = () => {
    const container = document.getElementById('gear-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x00f2ff, 2);
    dirLight.position.set(2, 2, 5);
    scene.add(dirLight);

    let gearModel;
    const loader = new THREE.GLTFLoader();

    // CHANGED: Loading 'flower.glb' from root
    loader.load('flower.glb', (gltf) => {
        gearModel = gltf.scene;
        gearModel.scale.set(1, 1, 1); 
        
        // Apply cool material if needed
        gearModel.traverse((child) => {
            if (child.isMesh) {
                // Optional: Give it a metallic look
                child.material.metalness = 0.8;
                child.material.roughness = 0.2;
            }
        });
        
        scene.add(gearModel);
    }, undefined, (error) => {
        console.error('Error loading flower.glb:', error);
    });

    // Rotate Flower/Gear on Scroll
    const animate = () => {
        requestAnimationFrame(animate);
        if (gearModel) {
            // Rotation based on scroll Y position
            gearModel.rotation.z = window.pageYOffset * 0.005; 
            gearModel.rotation.x += 0.002;
            gearModel.rotation.y += 0.002;
        }
        renderer.render(scene, camera);
    };
    animate();
    
    window.addEventListener('resize', () => {
        const w = container.clientWidth, h = container.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
};
document.addEventListener('DOMContentLoaded', initGear);


// --- 4. Dynamic Elemental Cursor (Fire <-> Water) ---
let cursorType = 'fire'; 

const initFireCursor = () => {
    const cvs = document.getElementById('fire-cursor-canvas'), ctx = cvs.getContext('2d');
    let parts = [], mouse = {x: -100, y: -100};
    
    const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();
    
    window.addEventListener('mousemove', e => { 
        mouse.x = e.x; 
        mouse.y = e.y; 
        
        const projects = document.getElementById('projects');
        if(projects) {
            const rect = projects.getBoundingClientRect();
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                cursorType = 'water';
            } else {
                cursorType = 'fire';
            }
        }

        for(let i=0;i<3;i++) parts.push(new P()); 
    });

    class P {
        constructor() {
            this.x = mouse.x + (Math.random()*10-5); 
            this.y = mouse.y + (Math.random()*10-5);
            this.s = Math.random()*8+4; 
            this.sy = Math.random()*2+0.5; 
            this.sx = Math.random()*2-1;
            this.o = 1;
            
            if (cursorType === 'water') {
                this.h = Math.random() * 40 + 180; // Blue
            } else {
                this.h = Math.random() * 20 + 30; // Fire
            }
        }
        u() { 
            this.y -= this.sy; 
            this.x += this.sx; 
            if(this.s>0.2) this.s-=0.2; 
            this.o-=0.02; 
            
            if (cursorType === 'water') {
                this.h += 1; 
            } else {
                this.h -= 1.5; 
                if(this.h<0) this.h=0; 
            }
        }
        d() { 
            ctx.fillStyle=`hsla(${this.h},100%,60%,${this.o})`; 
            ctx.beginPath(); 
            ctx.arc(this.x,this.y,this.s,0,Math.PI*2); 
            ctx.fill(); 
        }
    }
    
    const loop = () => {
        ctx.clearRect(0,0,cvs.width,cvs.height);
        for(let i=0; i<parts.length; i++) { 
            parts[i].u(); 
            parts[i].d(); 
            if(parts[i].s<=0.3||parts[i].o<=0) { parts.splice(i,1); i--; } 
        }
        requestAnimationFrame(loop);
    }
    loop();
};
document.addEventListener('DOMContentLoaded', initFireCursor);


// --- 5. Orbits Logic ---
const inner = [{i:'devicon-python-plain',c:'text-yellow-300',t:'Python'},{i:'devicon-c-plain',c:'text-blue-500',t:'C'},{i:'devicon-cplusplus-plain',c:'text-blue-400',t:'C++'},{i:'devicon-csharp-plain',c:'text-purple-500',t:'C#'},{i:'devicon-javascript-plain',c:'text-yellow-400',t:'JS'}];
const mid = [{i:'fas fa-sitemap',c:'text-green-400',t:'DSA'},{i:'fas fa-terminal',c:'text-gray-400',t:'OS'},{i:'fas fa-server',c:'text-blue-300',t:'SysDesign'},{i:'fas fa-cubes',c:'text-orange-400',t:'OOP'},{i:'fas fa-database',c:'text-purple-300',t:'DBMS'},{i:'fas fa-network-wired',c:'text-cyan-300',t:'Net'}];
const out = [{i:'devicon-react-original',c:'text-cyan-400',t:'React'},{i:'devicon-nodejs-plain',c:'text-green-500',t:'Node'},{i:'devicon-express-original',c:'text-white',t:'Express'},{i:'devicon-tailwindcss-original',c:'text-cyan-300',t:'Tailwind'},{i:'devicon-mongodb-plain',c:'text-green-400',t:'Mongo'},{i:'devicon-nextjs-original',c:'text-white',t:'Next'},{i:'devicon-git-plain',c:'text-red-500',t:'Git'},{i:'devicon-threejs-original',c:'text-white',t:'ThreeJS'}];

function place(id, arr) {
    const el = document.getElementById(id);
    if(!el) return;
    const step = (2*Math.PI)/arr.length;
    arr.forEach((d,i) => {
        const a = step*i, r=50;
        const x = 50 + (r * Math.cos(a));
        const y = 50 + (r * Math.sin(a));
        const div = document.createElement('div');
        div.className = 'skill-item'; div.style.left = `${x}%`; div.style.top = `${y}%`; div.title = d.t;
        div.innerHTML = `<i class="${d.i} ${d.c}"></i>`;
        el.appendChild(div);
    });
}
document.addEventListener('DOMContentLoaded', () => { place('orbit-inner', inner); place('orbit-middle', mid); place('orbit-outer', out); });
