class HitInfo
{
    constructor(t, pos, normal) 
    {
        this.t = t || -1.0;
        this.pos = pos || new Vec3();
        this.normal = normal || new Vec3();
    }

    Copy()
    {
        return new HitInfo(this.t, this.pos, this.normal);
    }
}