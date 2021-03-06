class HitInfo
{
    constructor(t, pos, normal, material) 
    {
        this.t = t || -1.0;
        this.pos = pos || new Vec3();
        this.normal = normal || new Vec3();
        this.material = material || new Material();
    }

    CopyTo(hitInfo)
    {
        hitInfo.t = this.t;
        hitInfo.pos = this.pos;
        hitInfo.normal = this.normal;
        hitInfo.material = this.material;
    }
}