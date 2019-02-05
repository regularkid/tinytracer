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
        let origin = hitInfo.pos.Add(hitInfo.normal.Scale(0.01));
        let reflectedRay = new Ray(origin, dir);
        
        return reflectedRay;
    }
}