var ctx = document.getElementById("canvas").getContext('2d');
var framebuffer = new Framebuffer(ctx, ctx.canvas.width, ctx.canvas.height);
var camera = new Camera(new Vec3(0, 2, 4), new Vec3(0, 0, -1), 90.0, ctx.canvas.width / ctx.canvas.height);

var samplesPerPixel = 1;
var maxRecursionDepth = 50;

var backgroundColorTop = new Vec3(1.0, 1.0, 1.0);
var backgroundColorBottom = new Vec3(0.5, 0.7, 1.0);

var whiteDiffuse = new DiffuseMaterial(new Vec3(0.8, 0.8, 0.8));
var pinkDiffuse = new DiffuseMaterial(new Vec3(0.8, 0.3, 0.3));
var metalMat = new MetalMaterial(new Vec3(0.8, 0.8, 0.8), 0.1);
var metalDirtyMat = new MetalMaterial(new Vec3(0.8, 0.6, 0.2), 0.5);

var objects = new Array();
objects.push(new Sphere(new Vec3(0.0, 0.0, -1.0), 0.5, pinkDiffuse));
objects.push(new Sphere(new Vec3(-1.0, 0.0, -1.0), 0.5, metalMat));
objects.push(new Sphere(new Vec3(1.0, 0.0, -1.0), 0.5, metalDirtyMat));
objects.push(new Sphere(new Vec3(0.0, -100.5, -1.0), 100.0, whiteDiffuse));

var curPixelIdx = 0;
var numPixels = ctx.canvas.width * ctx.canvas.height;

function RenderNextPixel()
{
    let x = curPixelIdx % ctx.canvas.width;
    let y = Math.floor(curPixelIdx / ctx.canvas.width);
    RenderPixel(x, y);

    curPixelIdx++;
    if (curPixelIdx === numPixels)
    {
        curPixelIdx = 0;
        return true;
    }

    return false;
}

function RenderPixel(x, y)
{
    let colorSum = new Vec3(0, 0, 0);

    for (var s = 0; s < samplesPerPixel; s++)
    {
        let uScreen = (x + Math.random()) / ctx.canvas.width;
        let vScreen = (y + Math.random()) / ctx.canvas.height;
        let ray = camera.GetRay(uScreen, vScreen);

        colorSum.AddToSelf(GetSceneColor(ray, 0));
    }

    // Average
    colorSum.ScaleSelf(1.0 / samplesPerPixel);

    // Gamma correct
    colorSum.Set(Math.sqrt(colorSum.x), Math.sqrt(colorSum.y), Math.sqrt(colorSum.z));

    framebuffer.drawPixel(x, y, colorSum);
}

function GetSceneColor(ray, recursionDepth)
{
    // If we hit a sphere
    let hitInfo = new HitInfo();
    if (Raycast(ray, hitInfo, 0.001, 100.0))
    {
        let bounceDir = new Ray();
        if (recursionDepth < maxRecursionDepth && hitInfo.material.GetBounceDir(ray, hitInfo, bounceDir))
        {
            return GetSceneColor(bounceDir, recursionDepth + 1).Scale(0.5).Multiply(hitInfo.material.albedo);
        }
        else
        {
            return new Vec3(0, 0, 0);
        }
    }

    // Background gradient from top to bottom
    let t = (ray.dir.y + 1.0) * 0.5;
    return backgroundColorTop.Lerp(backgroundColorBottom, t);
}

function Raycast(ray, hitInfo, tMin, tMax)
{
    let hitInfoCur = new HitInfo();
    let hitInfoClosest = new HitInfo();

    // Find the closest object intersection
    for (var i = 0; i < objects.length; i++)
    {
        if (objects[i].Raycast(ray, hitInfoCur, tMin, tMax) && (hitInfoClosest.t < 0.0 || hitInfoCur.t < hitInfoClosest.t))
        {
            hitInfoCur.CopyTo(hitInfoClosest);
        }
    }

    // Fill out the hitInfo if the caller cares about it
    if (hitInfo !== undefined)
    {
        hitInfoClosest.CopyTo(hitInfo);
    }

    return hitInfoClosest.t >= 0.0;
}

function RenderImageToCanvas()
{
    framebuffer.drawToContext(ctx);
}

function GetTotalRenderPct()
{
    return curPixelIdx / numPixels;
}