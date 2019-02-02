var ctx = document.getElementById("canvas").getContext('2d');
var framebuffer = new Framebuffer(ctx, ctx.canvas.width, ctx.canvas.height);

var objects = new Array();
objects.push(new Sphere(new Vec3(0.0, 0.0, -1.0), 0.5));//, matRed));
// objects.push(new Sphere(new Vec3(6.0, 3.0, -17.0), 4.0, matBlack));
// objects.push(new Sphere(new Vec3(-4.0, 2.0, -20.0), 4.0, matBlue));
// objects.push(new Sphere(new Vec3(0.0, -100.0, 15.0), 100.0, matWhite));

var backgroundColorTop = new Vec3(1.0, 1.0, 1.0);
var backgroundColorBottom = new Vec3(0.5, 0.7, 1.0);

function GetSceneColor(ray)
{
    if (Raycast(ray))
    {
        return new Vec3(1.0, 0.0, 0.0);
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
                //let dir = new Vec3(-2.0 + (x / ctx.canvas.width)*4.0, 1.0 - (y / ctx.canvas.height)*2.0, -1.0);
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
            hitInfoClosest = hitInfoCur.Copy();
        }
    }

    // Fill out the hitInfo if the caller cares about it
    if (hitInfo !== undefined)
    {
        hitInfo = hitInfoClosest.Copy();
    }

    return hitInfoClosest.t >= 0.0;
}

Render();

// function CastRay(origin, dir, color, depth)
// {
//     let hitMaterial = new Material();
//     let hitPosition = new Vec3();
//     let hitNormal = new Vec3();

//     // Nothing hit - just render the background color
//     if (!GetSceneIntersection(origin, dir, hitPosition, hitNormal, hitMaterial))
//     {
//         color.Set(backgroundColor.x, backgroundColor.y, backgroundColor.y);
//         return false;
//     }

//     // Calculate diffuse/spec intensities
//     let diffuseIntensity = 0.0;
//     let specIntensity = 0.0;
//     for (var i = 0; i < lights.length; i++)
//     {
//         let toLight = lights[i].position.GetCopy();
//         toLight.Sub(hitPosition);
//         toLight.Normalize();

//         // Any other objects blocking our view of the light? If so, don't include this light source (ie., shadows)
//         if (depth > 0)
//         {
//             let shadowTestStart = hitNormal.GetCopy();
//             shadowTestStart.Scale(0.001);
//             shadowTestStart.Add(hitPosition);
//             if (GetSceneIntersection(shadowTestStart, toLight))
//             {
//                 continue;
//             }
//         }

//         diffuseIntensity += Math.max(0.0, toLight.Dot(hitNormal) * lights[i].intensity);

//         let reflectedDirInv = toLight.GetReflected(hitNormal);
//         reflectedDirInv.Invert();
//         specIntensity += Math.pow(Math.max(0.0, reflectedDirInv.Dot(dir)), hitMaterial.specExponent) * lights[i].intensity;
//     }
    
//     // Phong = ambient + diffuse + spec
//     let ambient = hitMaterial.ambient.GetCopy();

//     let diffuse = hitMaterial.diffuse.GetCopy();
//     diffuse.Scale(diffuseIntensity);

//     let spec = hitMaterial.spec.GetCopy();
//     spec.Scale(specIntensity);

//     color.Set(ambient.x+diffuse.x+spec.x, ambient.y+diffuse.y+spec.y, ambient.z+diffuse.z+spec.z);

//     // Get reflected color
//     if (hitMaterial.reflectionMultiplier > 0.0 && depth > 0)
//     {
//         let reflectedColor = new Vec3();
//         let reflectedDir = dir.GetReflected(hitNormal);
//         reflectedDir.Invert();
//         let reflectOrigin = hitNormal.GetCopy();
//         reflectOrigin.Scale(0.001);
//         reflectOrigin.Add(hitPosition);
//         CastRay(reflectOrigin, reflectedDir, reflectedColor, depth - 1);

//         reflectedColor.Scale(hitMaterial.reflectionMultiplier);
//         color.Add(reflectedColor);
//     }

//     return true;
// }

// function GetSceneIntersection(origin, dir, hitPosition, hitNormal, hitMaterial)
// {
//     for (var i = 0; i < objects.length; i++)
//     {
//         // Assume sphere are sorted by depth to make this simpler
//         if (objects[i].Intersects(origin, dir, hitPosition, hitNormal, hitMaterial))
//         {
//             return true;
//         }
//     }

//     return false;
// }

//setInterval(Render, 16);
// Render();

// function SetCanvasSize()
// {
//     let canvas = document.getElementById("canvas");
//     let size = parseInt(document.getElementById("sizeSelect").value);
//     canvas.width = size;
//     canvas.height = size;
//     //canvas.style.width = `${size}px`;
//     //canvas.style.height = `${size}px`;
// }