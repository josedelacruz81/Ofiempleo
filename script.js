const arreglo = [ 2,4,6,8,2,4,1,5,9,10,3,3,5,1,2,2,4,7,7,8,9,9,5,1,4,10,10,3,4,2,10,10,2,7,3,9,9,4,1,7,0,0,9,10,9,1,8,0,4,6
]
const lowValue = (arreglo) => {
  let low = 0;
  for(let i = 0; i < arreglo.length; i++){
    if(arreglo[i] > low || low === 0){
      low = arreglo[i];
      
    }
  }
  console.log(low);
}

const obtenerIntervalo = (arreglo) => {

  let numeros = [];
  for(let i = 0; i < arreglo.length; i++){
    if(arreglo[i] >= 9 && arreglo[i] < 12){
      numeros.push(arreglo[i].length);
    }
   
  }
  return numeros;
}

const res = obtenerIntervalo(arreglo);

