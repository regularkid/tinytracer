importScripts("vec3.js");
importScripts("ray.js");
importScripts("material.js");
importScripts("hitInfo.js");
importScripts("sphere.js");
importScripts("camera.js");
importScripts("framebuffer.js");

var width;
var height;
var camera;
var objects = [];
var samplesPerPixel = 1;
var maxRecursionDepth = 50;
var backgroundColorTop = new Vec3(1.0, 1.0, 1.0);
var backgroundColorBottom = new Vec3(0.5, 0.7, 1.0);

function RenderPixel(x, y)
{
    let colorSum = new Vec3(0, 0, 0);

    for (var s = 0; s < samplesPerPixel; s++)
    {
        let uScreen = (x + Math.random()) / width;
        let vScreen = (y + Math.random()) / height;
        let ray = camera.GetRay(uScreen, vScreen);

        colorSum.AddToSelf(GetSceneColor(ray, 0));
    }

    // Average
    colorSum.ScaleSelf(1.0 / samplesPerPixel);

    // Gamma correct
    colorSum.Set(Math.sqrt(colorSum.x), Math.sqrt(colorSum.y), Math.sqrt(colorSum.z));
    return colorSum;
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

function SphereIntersect(center, radius)
{
    // Assume all objects are spheres
    for (var i = 0; i < objects.length; i++)
    {
        if (objects[i].SphereIntersect(center, radius))
        {
            return true;
        }
    }

    return false;
}

onmessage = (event) =>
{
    let eventType = event.data[0];

    if (eventType === "s")
    {
        width = event.data[1];
        height = event.data[2];
        samplesPerPixel = event.data[3];
        maxRecursionDepth = event.data[4];
    }
    else if (eventType === "c")
    {
        let curAngle = event.data[1];
        let camLookAt = new Vec3(0, 0.5, 0);
        let camPos = new Vec3(Math.cos(curAngle * Math.PI/180.)*4.0, 2.0, Math.sin(curAngle * Math.PI/180.)*-4.0);
        let camFOV = 90.0;
        let camAspectRatio = width / height;
        let camFocusDist = camLookAt.Sub(camPos).Length();
        let camApertureRadius = 0.05;
        camera = new Camera(camPos, camLookAt, camFOV, camAspectRatio, camFocusDist, camApertureRadius);
    }
    else if (eventType === "o")
    {
        let center = new Vec3(event.data[1].x, event.data[1].y, event.data[1].z);
        let radius = event.data[2];
        let albedo = new Vec3(event.data[3].x, event.data[3].y, event.data[3].z);
        let fuzziness = event.data[4];

        let material;
        if (fuzziness !== undefined)
        {
            material = new MetalMaterial(albedo, fuzziness);
        }
        else
        {
            material = new DiffuseMaterial(albedo);
        }

        objects.push(new Sphere(center, radius, material));
    }
    else
    {
        let workerIdx = event.data[0];
        let rangeStart = event.data[1];
        let rangeEnd = event.data[2];
        let colors = [];

        //console.log(`Worker starting: ${rangeStart}, ${rangeEnd}`);

        for (let i = rangeStart; i <= rangeEnd; i++)
        {
            let x = i % width;
            let y = Math.floor(i / width);
            colors.push(RenderPixel(x, y));

            let progress = (i - rangeStart) / (rangeEnd - rangeStart);
            postMessage(["p", workerIdx, progress]);
        }

        //console.log(`Worker ending: ${rangeStart}, ${rangeEnd}`);
        
        postMessage([rangeStart, rangeEnd, colors]);
    }
}