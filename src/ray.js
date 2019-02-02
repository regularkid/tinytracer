class Ray
{
    constructor(origin, dir)
    {
        this.origin = origin;
        this.dir = dir;
    }

    GetPoint(t)
    {
        return this.origin.Add(this.dir.Scale(t));
    }
}