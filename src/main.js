var ctx = document.getElementById("canvas").getContext('2d');
var framebuffer = new Framebuffer(ctx, ctx.canvas.width, ctx.canvas.height);
var camera = new Camera();

var backgroundColorTop = new Vec3(1.0, 1.0, 1.0);
var backgroundColorBottom = new Vec3(0.5, 0.7, 1.0);

var objects = new Array();
objects.push(new Sphere(new Vec3(0.0, 0.0, -1.0), 0.5));
objects.push(new Sphere(new Vec3(0.0, -100.5, -1.0), 100.0));

function Render()
{
    for (var y = 0; y < ctx.canvas.height; y++)
    {
        for (var x = 0; x < ctx.canvas.width; x++)
        {
            RenderPixel(x, y);
        }
    }

    framebuffer.drawToContext(ctx);
}

function RenderPixel(x, y)
{
    let samplesPerPixel = 1;
    let colorSum = new Vec3(0, 0, 0);

    for (var s = 0; s < samplesPerPixel; s++)
    {
        let uScreen = (x + Math.random()) / ctx.canvas.width;
        let vScreen = (y + Math.random()) / ctx.canvas.height;
        let ray = camera.GetRay(uScreen, vScreen);

        colorSum.AddToSelf(GetSceneColor(ray));
    }

    framebuffer.drawPixel(x, y, colorSum.Scale(1.0 / samplesPerPixel));
}

function GetSceneColor(ray)
{
    // If we hit a sphere just use the normal as the color
    let hitInfo = new HitInfo();
    if (Raycast(ray, hitInfo))
    {
        let c = new Vec3(hitInfo.normal.x + 1.0, hitInfo.normal.y + 1.0, hitInfo.normal.z + 1.0);
        return c.Scale(0.5);
    }

    // Background gradient from top to bottom
    let t = (ray.dir.y + 1.0) * 0.5;
    return backgroundColorTop.Lerp(backgroundColorBottom, t);
}

function Raycast(ray, hitInfo)
{
    let hitInfoCur = new HitInfo();
    let hitInfoClosest = new HitInfo();

    // Find the closest object intersection
    for (var i = 0; i < objects.length; i++)
    {
        if (objects[i].Raycast(ray, hitInfoCur) && (hitInfoClosest.t < 0.0 || hitInfoCur.t < hitInfoClosest.t))
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

let start = Date.now();
Render();
console.log(Date.now() - start);