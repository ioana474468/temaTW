document.getElementById("caine").onclick=getRandomDog;

async function getRandomDog() {
    try {
        let fetchCount=  0 || localStorage.getItem("FetchCount") ;
        document.getElementById("count").innerText = "Fetch a fost apelat de :"+fetchCount+" ori!";

    // Folosim Dog API pentru a obtine o imagine de caine la intamplare
    
    const response= await fetch('https://dog.ceo/api/breeds/image/random');
    fetchCount++;
    localStorage.setItem("FetchCount", fetchCount);
        const data = await response.json();
            // Verificam dacă raspunsul contine o imagine
            
            if (data && data.message) {
                // Afisam imaginea intr-un element HTML
                displayDogImage(data.message);
                displayDogImageInCanvas(data.message);

                let linkElement = document.createElement('a');
                linkElement.href=data.message;
                linkElement.innerHTML="Link catre poza";
                let Link=document.getElementById('link');
                Link.innerHTML=' ';                
                Link.appendChild(linkElement);
            } else {
                console.error('Raspuns invalid de la API');
            }
        
    }catch(error) {
            console.error('Eroare la solicitarea API-ului:', error);
        };
}

function displayDogImage(imageUrl) {
    // Obtinem elementul HTML in care va fi afisata imaginea
    var dogImageContainer = document.getElementById('dogImageContainer');

    // Cream un element imagine si setatm sursa imaginii
    var imgElement = document.createElement('img');
    imgElement.id='poza';
    imgElement.src = imageUrl;
    imgElement.alt = 'Random Dog';
    imgElement.style.width='300px';

    // Stergem conținutul anterior din container
    dogImageContainer.innerHTML = '';

    // Adaugam imaginea la container
    dogImageContainer.appendChild(imgElement);
}

 // Adaugam poza in canvas
function displayDogImageInCanvas(imageUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() { 
        setTimeout(()=> {
            const canvas = document.getElementById('dogImageCanvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
            
    },1000);
    };
    img.src = imageUrl;
}

//Event listener pentru butonul "Optiunea 1"
document.getElementById('opt1').addEventListener('click', async function () {

        const canvas = document.getElementById('dogImageCanvas');
        const ctx = canvas.getContext('2d');
        // oglindirea pozei
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        for (let i = 1; i <= 4; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mirroredImageData = mirrorImage(imageData,i);
            ctx.putImageData(mirroredImageData, 0, 0); 
        }

        
    
});

//Event listener pentru butonul "Optiunea 2"
document.getElementById('opt2').addEventListener('click', async function () {
        const canvas = document.getElementById('dogImageCanvas');
        const ctx = canvas.getContext('2d');
        // oglindirea pe jumatate a pozei
        const imageData = ctx.getImageData(0, 0, canvas.width/2, canvas.height);
        for (let i = 1; i <= 4; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mirroredImageData = mirrorImage(imageData,i);
            ctx.putImageData(mirroredImageData, 0, 0); 
        }
    
    
});

// Functia de oglindire
function mirrorImage(imageData,k) {
    const width = imageData.width;
    const height = imageData.height;
    const pixels = imageData.data;
  
    for (let y = Math.round((k-1)*height/4); y <Math.round( k* height/4); y++) {
      for (let x = 0; x < width / 2; x++) {
        //Calculam indecsii pixelilor pe care ii vom inversa
        const originalIndex = (y * width + x) * 4;
        const mirroredIndex = (y * width + (width - x - 1)) * 4;
  
        //Inversam valorile pixelilor
        for (let k = 0; k < 4; k++) {
          const temp = pixels[originalIndex + k];
          pixels[originalIndex + k] = pixels[mirroredIndex + k];
          pixels[mirroredIndex + k] = temp;
        }
      }
    }
  
    return imageData;
  }


  // Event listener pentru butonul de "maresteLuminozitatea" 
  document.getElementById('maresteLuminozitatea').addEventListener('click', async function () {
    for (let i = 1; i <= 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        adjustBrightness(30, i);  
    }
});

// Event listener pentru butonul de "scadeLuminozitatea"
document.getElementById('scadeLuminozitatea').addEventListener('click', async function () {
    for (let i = 1; i <= 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        adjustBrightness(-30, i);  
    }
});

function adjustBrightness(brightnessChange,k) {

    const canvas = document.getElementById('dogImageCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const width = imageData.width;
    const height = imageData.height;
    const pixels = imageData.data;

    for (let y = Math.round((k-1)*height/4); y <Math.round( k* height/4); y++) {
        for (let x = 0; x < width; x++) {
          const Index = (y * width + x) * 4;
    
          for (let j = 0; j < 3; j++) {
            //Scadem sau adunam la valoarea culorii;
            pixels[Index + j] += brightnessChange; 
            //Ne asiguram ca valorile culorilor raman in intervalul 0-255
            pixels[Index + j] = Math.max(0, Math.min(255, pixels[Index+ j]));
        }
        }
      }
    // Punem modificarile in canvas
    ctx.putImageData(imageData, 0, 0);
}

document.getElementById('reset').addEventListener('click', function () {
    const canvas = document.getElementById('dogImageCanvas');
    const ctx = canvas.getContext('2d');
    
    displayDogImageInCanvas(document.getElementById('poza').src);
    


});
