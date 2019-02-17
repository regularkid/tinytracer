var ctx = document.getElementById("canvas").getContext('2d');
var raytracer;
var generationStartTime = 0;
var curReplayFrameIdx = 0;
var updateAnimationRequestId;

function StartRaytrace()
{
    let imageWidth = document.getElementById("width").value;
    let imageHeight = Math.floor(imageWidth / 2);
    ctx.canvas.width = imageWidth;
    ctx.canvas.height = imageHeight;
    ctx.canvas.style = `width:${imageWidth}px; height:${imageHeight}px;`;

    raytracer = new Raytracer(ctx.canvas.width, ctx.canvas.height, document.getElementById("samplesPerPixel").value, document.getElementById("numFrames").value);

    generationStartTime = Date.now();

    window.cancelAnimationFrame(updateAnimationRequestId);
    updateAnimationRequestId = window.requestAnimationFrame(UpdateGenerating);
}

function UpdateGenerating()
{
    if (raytracer.IsComplete())
    {
        console.log(`Total Time: ${msToTime(Date.now() - generationStartTime)}`);
        updateAnimationRequestId = window.requestAnimationFrame(UpdateReplaying);
    }
    else
    {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Frame progress
        let frameText = `Frame Progress`;
        ctx.font = `Bold 16px Arial`;
        ctx.fillStyle = "#000";
        ctx.fillText(frameText, 0, 20);

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 24, ctx.canvas.width, 20);
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(0, 24, raytracer.GetFrameRenderPct()*ctx.canvas.width, 20);

        // Total progress
        let totalText = `Total Progress`;
        ctx.font = `Bold 16px Arial`;
        ctx.fillStyle = "#000";
        ctx.fillText(totalText, 0, 70);

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 74, ctx.canvas.width, 20);
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(0, 74, raytracer.GetTotalRenderPct()*ctx.canvas.width, 20);

        // Time display
        let pctText = `${Math.floor(raytracer.GetTotalRenderPct() * 100.0)}%`;
        ctx.font = `Bold 16px Arial`;
        ctx.fillStyle = "#000";
        ctx.fillText(pctText, 0, 150);

        let totalElapsed = Date.now() - generationStartTime;
        ctx.fillText(msToTime(totalElapsed), 0, 175);

        updateAnimationRequestId = window.requestAnimationFrame(UpdateGenerating);
    }
}

function UpdateReplaying()
{
    // Interp based on a desired 360 frame max
    let curImageFrameIdx = Math.floor(curReplayFrameIdx / (360.0 / raytracer.GetNumFrames()));
    ctx.putImageData(raytracer.GetFrameImage(curImageFrameIdx), 0, 0);
    curReplayFrameIdx = (curReplayFrameIdx + 1) % 360.0;

    updateAnimationRequestId = window.requestAnimationFrame(UpdateReplaying);
}

function UpdateWidthSliderDisplayValue()
{
    document.getElementById("widthValue").innerHTML = document.getElementById("width").value;
}

function UpdateNumFramesSliderDisplayValue()
{
    document.getElementById("numFramesValue").innerHTML = document.getElementById("numFrames").value;
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