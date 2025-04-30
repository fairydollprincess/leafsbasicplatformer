//alert("hello world");

var keySet = new Set();
document.addEventListener("keydown", (event) => {
    keySet.add(event.key.toLowerCase());
});
document.addEventListener("keyup", (event) => {
    keySet.delete(event.key.toLowerCase());
});

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

var x = 10;
var y = 10;

function update(){
    if(keySet.has('a')){
        x--;
    }
    if(keySet.has('d')){
        x++;
    }

    context.fillStyle = "purple";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "pink";
    context.fillRect(x, y, 10, 10);

    requestAnimationFrame(update);
}
update();
