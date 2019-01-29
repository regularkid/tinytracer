var ctx = document.getElementById("canvas").getContext('2d');

var matRed = new Material(new Vec3(0.4, 0.0, 0.0), new Vec3(1.0, 0.0, 0.0), new Vec3(1.0, 1.0, 1.0), 30.0);
var matGreen = new Material(new Vec3(0.0, 0.4, 0.0), new Vec3(0.0, 1.0, 0.0), new Vec3(1.0, 1.0, 1.0), 10.0);
var matBlue = new Material(new Vec3(0.0, 0.0, 0.4), new Vec3(0.0, 0.0, 1.0), new Vec3(1.0, 1.0, 1.0), 50.0);

var spheres = new Array();
spheres.push(new Sphere(new Vec3(0.0, -3.0, -15.0), 5.0, matRed));
spheres.push(new Sphere(new Vec3(6.0, 2.0, -17.0), 4.0, matGreen));
spheres.push(new Sphere(new Vec3(-4.0, 2.0, -18.0), 2.5, matBlue));

var lights = new Array();
lights.push(new Light(new Vec3(-5.0, 0.0, -2.0), 0.5));
lights.push(new Light(new Vec3(15.0, 15.0, -5.0), 0.5));

var backgroundColor = new Vec3(0.5, 0.5, 0.5);

var curAngle = 0;
function Render()
{
    let start = Date.now();
    let color = new Vec3();

    // TEMP!
    curAngle = (Date.now() * 0.0005) % 6.28;
    lights[0].position.x = Math.cos(curAngle)*25.0;
    lights[0].position.z = -15 + Math.sin(curAngle)*25.0;

    for (var y = 0; y < ctx.canvas.height; y++)
    {
        for (var x = 0; x < ctx.canvas.width; x++)
        {
            let dir = new Vec3(-1.0 + (x / ctx.canvas.width)*2.0,
                                1.0 - (y / ctx.canvas.height)*2.0,
                               -1.0);
            dir.Normalize();

            CastRay(new Vec3(0, 0, 0), dir, color);

            ctx.fillStyle = `rgb(${color.x*255.0}, ${color.y*255.0}, ${color.z*255.0})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }

    let elapsed = Date.now() - start;
    console.log(elapsed);
}

function CastRay(origin, dir, color)
{
    let hitMaterial = new Material();
    let hitPosition = new Vec3();
    let hitNormal = new Vec3();

    // Nothing hit - just render the background color
    if (!GetSceneIntersection(origin, dir, hitPosition, hitNormal, hitMaterial))
    {
        color.Set(backgroundColor.x, backgroundColor.y, backgroundColor.y);
        return false;
    }

    // Calculate diffuse/spec intensities
    let diffuseIntensity = 0.0;
    let specIntensity = 0.0;
    for (var i = 0; i < lights.length; i++)
    {
        let toLight = lights[i].position.GetCopy();
        toLight.Sub(hitPosition);
        toLight.Normalize();

        // Any other objects blocking our view of the light? If so, don't include this light source (ie., shadows)
        // let shadowTestStart = toLight.GetCopy();
        // shadowTestStart.Scale(0.001);
        // shadowTestStart.Add(hitPosition);
        // if (GetSceneIntersection(shadowTestStart, toLight))
        // {
        //     continue;
        // }

        diffuseIntensity += toLight.Dot(hitNormal) * lights[i].intensity;

        let reflectedDirInv = toLight.GetReflected(hitNormal);
        reflectedDirInv.Invert();
        specIntensity += Math.pow(Math.max(0.0, reflectedDirInv.Dot(dir)), hitMaterial.specExponent) * lights[i].intensity;
    }
    
    // Phong = ambient + diffuse + spec
    let ambient = hitMaterial.ambient.GetCopy();

    let diffuse = hitMaterial.diffuse.GetCopy();
    diffuse.Scale(diffuseIntensity);

    let spec = hitMaterial.spec.GetCopy();
    spec.Scale(specIntensity);

    color.Set(ambient.x+diffuse.x+spec.x, ambient.y+diffuse.y+spec.y, ambient.z+diffuse.z+spec.z);
    return true;
}

function GetSceneIntersection(origin, dir, hitPosition, hitNormal, hitMaterial)
{
    for (var i = 0; i < spheres.length; i++)
    {
        // Assume sphere are sorted by depth to make this simpler
        if (spheres[i].Intersects(origin, dir, hitPosition, hitNormal, hitMaterial))
        {
            return true;
        }
    }

    return false;
}

setInterval(Render, 16);