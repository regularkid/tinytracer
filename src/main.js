var generationStartTime = 0;

function Update()
{
    let startTime = Date.now();
    let elapsed = 0;
    while (elapsed < 16)
    {
        if (RenderNextPixel())
        {
            RenderImageToCanvas();
            break;
        }

        elapsed = Date.now() - startTime;
    }

    if (curPixelIdx > 0)
    {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, ctx.canvas.width, 20);
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(0, 0, GetTotalRenderPct()*ctx.canvas.width, 20);

        let pctText = `${Math.floor(GetTotalRenderPct() * 100.0)}%`;
        ctx.font = `Bold 16px Arial`;
        ctx.fillStyle = "#000";
        ctx.fillText(pctText, 0, 40);

        let totalElapsed = Date.now() - generationStartTime;
        ctx.fillText(msToTime(totalElapsed), 0, 65);

        window.requestAnimationFrame(Update);
    }
}

function StartRaytrace()
{
    // Update values from user controls
    samplesPerPixel = document.getElementById("samplesPerPixel").value;

    let imageWidth = document.getElementById("width").value;
    let imageHeight = Math.floor(imageWidth / 2);
    ctx.canvas.width = imageWidth;
    ctx.canvas.height = imageHeight;
    ctx.canvas.style = `width:${imageWidth}px; height:${imageHeight}px;`;

    generationStartTime = Date.now();
    curPixelIdx = 0;
    numPixels = imageWidth * imageHeight;
    framebuffer = new Framebuffer(ctx, ctx.canvas.width, ctx.canvas.height);

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