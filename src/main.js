var ctx = document.getElementById("canvas").getContext('2d');

for (var y = 0; y < ctx.canvas.height; y++)
{
    for (var x = 0; x < ctx.canvas.width; x++)
    {
        ctx.fillStyle = `rgb(${Math.floor((x / ctx.canvas.width)*255)}, ${Math.floor((y / ctx.canvas.height)*255)}, ${0})`;
        ctx.fillRect(x, y, 1, 1);
    }
}