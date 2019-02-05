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

    GetBounceDir(ray, hitInfo, bounceRay)
    {
        let targetPos = hitInfo.pos.Add(hitInfo.normal).Add(Vec3.GetRandomDir());
        let dir = targetPos.Sub(hitInfo.pos).Normalize();
        bounceRay.Set(hitInfo.pos, dir);
        
        return true;
    }
}

class MetalMaterial extends Material
{
    constructor(albedo, fuzziness)
    {
        super(albedo);
        this.fuzziness = fuzziness;
    }

    GetBounceDir(ray, hitInfo, bounceRay)
    {
        let reflectedDir = ray.dir.Reflect(hitInfo.normal);

        if (this.fuzziness > 0)
        {
            bounceRay.Set(hitInfo.pos, reflectedDir.Add(Vec3.GetRandomDir().Scale(this.fuzziness)));
        }
        else
        {
            bounceRay.Set(hitInfo.pos, reflectedDir);
        }
        
        return bounceRay.dir.Dot(hitInfo.normal) > 0;
    }
}