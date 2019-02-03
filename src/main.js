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
        this.ctx.font = `Bold 16px Arial`;
        this.ctx.fillStyle = "#000";
        this.ctx.fillText(pctText, 0, 40);

        let totalElapsed = Date.now() - generationStartTime;
        this.ctx.fillText(msToTime(totalElapsed), 0, 65);

        window.requestAnimationFrame(Update);
    }
}

function StartRaytrace()
{
    generationStartTime = Date.now();
    curPixelIdx = 0;
    samplesPerPixel = document.getElementById("samplesPerPixel").value;
    window.requestAnimationFrame(Update);
}

function UpdateSliderDisplayValue()
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