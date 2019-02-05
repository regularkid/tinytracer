class Ray
{
    constructor(origin, dir)
    {
        this.Set(origin, dir);
    }

    Set(origin, dir)
    {
        this.origin = origin || new Vec3();
        this.dir = dir || new Vec3();
    }

    GetPoint(t)
    {
        return this.origin.Add(this.dir.Scale(t));
    }
}