var ctx = document.getElementById("canvas").getContext('2d');
var raytracer;
var generationStartTime = 0;

var curAngle = 0;

var replayingAnim = false;
var curReplayImageIdx = 0;

function Update()
{
    if (replayingAnim)
    {
        ctx.putImageData(raytracer.images[curReplayImageIdx], 0, 0);
        curReplayImageIdx = (curReplayImageIdx + 1) % raytracer.images.length;
    }
    else
    {
        let startTime = Date.now();
        let elapsed = 0;
        while (elapsed < 16)
        {
            raytracer.RenderNextPixel();
            // {
            //     raytracer.RenderImageToCanvas();
                
            //     // Temp
            //     //curAngle += 1.0;
            //     //raytracer.camera.SetLookAt(new Vec3(Math.cos(curAngle * Math.PI/180.)*4.0, 2, Math.sin(curAngle * Math.PI/180.)*-4.0 - 1.0), raytracer.camLookAt, raytracer.camFOV, raytracer.camAspectRatio, raytracer.camFocusDist, raytracer.camApertureRadius);

            //     images.push(raytracer.framebuffer.imageData);
            //     raytracer.framebuffer = new Framebuffer(ctx, ctx.canvas.width, ctx.canvas.height);

            //     if (curAngle >= 360.0)
            //     {
            //         replayingAnim = true;
            //     }

            //     break;
            // }

            elapsed = Date.now() - startTime;
        }

        if (raytracer.IsComplete())
        {
            replayingAnim = true;
        }
        else
        {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, ctx.canvas.width, 20);
            ctx.fillStyle = "#00FF00";
            ctx.fillRect(0, 0, raytracer.GetTotalRenderPct()*ctx.canvas.width, 20);

            let pctText = `${Math.floor(raytracer.GetTotalRenderPct() * 100.0)}%`;
            ctx.font = `Bold 16px Arial`;
            ctx.fillStyle = "#000";
            ctx.fillText(pctText, 0, 40);

            let totalElapsed = Date.now() - generationStartTime;
            ctx.fillText(msToTime(totalElapsed), 0, 65);
        }
    }

    window.requestAnimationFrame(Update);
}

function StartRaytrace()
{
    let imageWidth = document.getElementById("width").value;
    let imageHeight = Math.floor(imageWidth / 2);
    ctx.canvas.width = imageWidth;
    ctx.canvas.height = imageHeight;
    ctx.canvas.style = `width:${imageWidth}px; height:${imageHeight}px;`;

    raytracer = new Raytracer(ctx, document.getElementById("samplesPerPixel").value);
    replayingAnim = false;

    generationStartTime = Date.now();

    window.requestAnimationFrame(Update);
}

function UpdateWidthSliderDisplayValue()
{
    document.getElementById("widthValue").innerHTML = document.getElementById("width").value;
}

function UpdateSPPSliderDisplayValue()
{
    document.getElementById("samplesPerPixelDisplayValue").innerHTML = document.getElementById("samplesPerPixel").value;
}

function msToTime(ms)
{
    let seconds = parseInt((ms/1000)%60);
    let minutes = parseInt((ms/(1000*60))%60);
    let hours = parseInt((ms/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}