//IA en javascript
/*
point rouges = team 1 = au dessus du trait gris
points bleus = team -1 = au dessous du trait gris
trait vert = état du cerveau au départ (aléatoire)
variables à ajuster :  le nombre d'exemples pour entrainer le cerveau et le facteur d'apprentissage
 */

/*
 Constantes
 */
const X_MAX = 500;
const Y_MAX = 500;

/*
Points au hasard
*/
function generatePoints(num){
    const tableau = [...Array(num).keys()]; //Créé un tableau avec num éléments qui contiennent leur index en value
    const randomPoints = tableau.map(element => ({ // pour chaque élément, je remplace leur value par un objet avec les coordonnées x et y
        x: randomizer(0, X_MAX),
        y: randomizer(0, Y_MAX)
    }));
    return randomPoints;
}

function randomizer(min, max){ // renvoi un nombre entre min et max
    return Math.random() * (max - min) + min;
}



/*
Correct Data
*/
//Données correctes qui serviront à entrainer l'IA
const examples = generatePoints(1000000).map(point => ({point, team : team(point)}));


/*
TEAM : color points
*/
//team est la solution mathématique, elle n'est pas connue de l'IA et sert juste à créer des données correctes

function team(point){
    if (point.x > point.y) {
        return 1;
    }
    return -1;
}

/*
Cerveau
*/

var randomWeight = { // Etat de départ de l'IA choisi au hasard
    x: randomizer(0, 1),
    y: randomizer(0, 1)
}

function trainedWeight() { // Etat de l'IA après entrainement sur les exemples
    let currentWeight = randomWeight;
    for (const example of examples) {
        currentWeight = train(currentWeight, example.point, example.team)
    }
    return currentWeight;
}
const cerveauTrained = trainedWeight();

function guess(weights, inputs){ // fonction de test de l'IA pour savoir pour un point donné et l'état de son cerveau, la team de ce point(1 ou -1)
    const prodVect = inputs.x * weights.y -
                  inputs.y * weights.x ;
    const team = prodVect >= 0 ? 1 : -1;
    return team;
}


/*
Train
*/
function train(weights, input, soluce){ //Entrainement de l'IA qui changera son état en fonction de ses résultats
    const guessResult = guess(weights, input);
    const error = (soluce - guessResult); // 0 si juste , 2 si soluce == 1 et guessResult == -1 et -2 si soluce == -1 et guessResult == 1
    return {
        x: weights.x + (input.x * error*0.001), // 0.001 = facteur d'apprentissage
        y: weights.y + (input.y * error*0.001)
    }
}





//Construction du svg

const pointsDuSVG = generatePoints(300);
var html = `
    <svg width = "${X_MAX}" height="${Y_MAX}">
    <defs>
        <marker id="arrowX" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#f00" />
        </marker>
        <marker id="arrowY" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#6579db" />
        </marker>
    </defs>
        ${pointsDuSVG.map(point =>
            `<circle cx="${point.x}"
             cy="${point.y}"
             r="2"
             fill= "${guess(cerveauTrained,point) === -1 ? "blue" : "red"}"
             />`
            )}
        <line x1="0" x2="${randomWeight.x*400}" y1="0" y2= "${randomWeight.y*400}" stroke="green" />
        <line x1="0" x2="${X_MAX}" y1="0" y2= "${Y_MAX}" stroke="gray" />

      <line x1="0" y1="0" x2="450" y2="0" stroke="#000" stroke-width="5" marker-end="url(#arrowX)" />
      <line x1="0" y1="0" x2="0" y2="450" stroke="#000" stroke-width="5" marker-end="url(#arrowY)" />
        </svg>

`;
document.getElementById('body').innerHTML = html;
console.log(cerveauTrained);
