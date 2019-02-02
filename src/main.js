var ctx = document.getElementById("canvas").getContext('2d');
var framebuffer = new Framebuffer(ctx, ctx.canvas.width, ctx.canvas.height);

var objects = new Array();
objects.push(new Sphere(new Vec3(0.0, 0.0, -1.0), 0.5));
objects.push(new Sphere(new Vec3(0.0, -100.5, -1.0), 100.0));

var backgroundColorTop = new Vec3(1.0, 1.0, 1.0);
var backgroundColorBottom = new Vec3(0.5, 0.7, 1.0);

function GetSceneColor(ray)
{
    let hitInfo = new HitInfo();
    if (Raycast(ray, hitInfo))
    {
        let c = new Vec3(hitInfo.normal.x + 1.0, hitInfo.normal.y + 1.0, hitInfo.normal.z + 1.0);
        return c.Scale(0.5);
    }

    let t = (ray.dir.y + 1.0) * 0.5;
    return backgroundColorTop.Lerp(backgroundColorBottom, t);
}

function Render()
{
    let start = Date.now();
    let samplesPerPixel = 100;
    let cameraPos = new Vec3(0, 0, 0);

    for (var y = 0; y < ctx.canvas.height; y++)
    {
        for (var x = 0; x < ctx.canvas.width; x++)
        {
            let colorSum = new Vec3(0, 0, 0);
            for (var s = 0; s < samplesPerPixel; s++)
            {
                let dir = new Vec3(-2.0 + ((x + Math.random()) / ctx.canvas.width)*4.0, 1.0 - ((y + Math.random()) / ctx.canvas.height)*2.0, -1.0);
                let ray = new Ray(cameraPos, dir.Normalize());

                colorSum.AddToSelf(GetSceneColor(ray));
            }

            framebuffer.drawPixel(x, y, colorSum.Scale(1.0 / samplesPerPixel));
        }
    }

    framebuffer.drawToContext(ctx);

    let elapsed = Date.now() - start;
    console.log(elapsed);
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

Render();