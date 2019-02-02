class Camera
{
    constructor(pos, dir)
    {
        this.pos = pos || new Vec3();
        this.dir = dir || new Vec3(0.0, 0.0, -1.0);
    }

    GetRay(uScreen, vScreen)
    {
        let dir = new Vec3(-2.0 + uScreen*4.0, 1.0 - vScreen*2.0, -1.0);
        return new Ray(this.pos, dir.Normalize());
    }
}