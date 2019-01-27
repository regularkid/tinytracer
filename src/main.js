var ctx = document.getElementById("canvas").getContext('2d');
var spheres = new Array();
spheres.push(new Sphere(new Vec3(0.0, 0.0, -15.0), 5.0));
var lights = new Array();
lights.push(new Light(new Vec3(-5.0, 10.0, -2.0), 1.0));

var curAngle = 0;
function Render()
{
    let start = Date.now();

    // TEMP!
    // curAngle = (Date.now() * 0.0005) % 6.28;
    // lights[0].position.x = Math.cos(curAngle)*15.0;
    // lights[0].position.z = -15 + Math.sin(curAngle)*15.0;

    for (var y = 0; y < ctx.canvas.height; y++)
    {
        for (var x = 0; x < ctx.canvas.width; x++)
        {
            let dir = new Vec3(-1.0 + (x / ctx.canvas.width)*2.0,
                                1.0 - (y / ctx.canvas.height)*2.0,
                               -1.0);
            dir.Normalize();

            let color = CastRay(new Vec3(0, 0, 0), dir);

            ctx.fillStyle = `rgb(${color.x*255.0}, ${color.y*255.0}, ${color.z*255.0})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }

    let elapsed = Date.now() - start;
    console.log(elapsed);
}

function Reflect(i, n)
{
    let reflectedDir = new Vec3(i.x, i.y, i.z);
    let t = new Vec3(n.x, n.y, n.z);
    t.Scale(2.0*i.Dot(n));
    reflectedDir.Sub(t);
    return reflectedDir;
}

function CastRay(origin, dir)
{
    let hitPosition = new Vec3();
    let hitNormal = new Vec3();
    if (spheres[0].Intersects(origin, dir, hitPosition, hitNormal))
    {
        let lightIntensity = 0.0;
        let toLight = new Vec3(lights[0].position.x, lights[0].position.y, lights[0].position.z);
        toLight.Sub(hitPosition);
        toLight.Normalize();
        lightIntensity += toLight.Dot(hitNormal) * lights[0].intensity;

        let specIntensity = 0.0;
        let specExponent = 50.0;
        //let specExponent = 10.0;
        let reflectedDirInv = Reflect(new Vec3(-toLight.x, -toLight.y, -toLight.z), hitNormal);
        reflectedDirInv.Invert();
        specIntensity += Math.pow(Math.max(0.0, reflectedDirInv.Dot(dir)), specExponent)*lights[0].intensity;

        let color = new Vec3(0.0, 1.0, 0.0);
        color.Scale(lightIntensity);

        let albedo = new Vec3(0.6, 0.3);
        //let albedo = new Vec3(0.9, 0.1);
        color.Scale(albedo.x + specIntensity*albedo.y);
        return color;
    }

    return new Vec3(0.5, 0.5, 0.5);
}

setInterval(Render, 16);