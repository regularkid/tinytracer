class Material
{
    constructor(albedo)
    {
        this.albedo = albedo;
    }
}

class DiffuseMaterial extends Material
{
    constructor(albedo)
    {
        super(albedo);
    }

    GetBounceDir(ray, hitInfo)
    {
        let targetPos = hitInfo.pos.Add(hitInfo.normal).Add(Vec3.GetRandomDir());
        let dir = targetPos.Sub(hitInfo.pos).Normalize();
        let bounceRay = new Ray(hitInfo.pos, dir);
        
        return bounceRay;
    }
}

class MetalMaterial extends Material
{
    constructor(albedo, fuzziness)
    {
        super(albedo);
        this.fuzziness = fuzziness;
    }

    GetBounceDir(ray, hitInfo)
    {
        let reflectedDir = ray.dir.Reflect(hitInfo.normal).Invert();
        let bounceRay = new Ray(hitInfo.pos, reflectedDir);
        
        return bounceRay;
    }
}