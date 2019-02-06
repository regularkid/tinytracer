class Camera
{
    constructor(pos, lookAt, fov, aspectRatio)
    {
        this.SetLookAt(pos, lookAt, fov, aspectRatio);
    }

    SetLookAt(pos, lookAt, fov, aspectRatio)
    {
        this.pos = pos;
        this.lookAt = lookAt;
        this.fov = fov;
        this.aspectRatio = aspectRatio;

        // Assume vp distance of 1; half-height = tan(fov/2), height = half-height * 2
        this.vpWidth = Math.tan(fov * 0.5 * (Math.PI / 180.0)) * 2.0;
        this.vpHeight = this.vpWidth / aspectRatio;

        this.forward = this.lookAt.Sub(this.pos).Normalize();
        this.right = this.lookAt.Cross(new Vec3(0, 1, 0)).Normalize();
        this.up = this.right.Cross(this.forward).Normalize();

        this.vpUpperLeft = this.pos.Add(this.forward);
        this.vpUpperLeft.SubFromSelf(this.right.Scale(this.vpWidth * 0.5));
        this.vpUpperLeft.AddToSelf(this.up.Scale(this.vpHeight * 0.5));
    }

    GetRay(uScreen, vScreen)
    {
        //let dir = new Vec3(-2.0 + uScreen*4.0, 1.0 - vScreen*2.0, -1.0);
        let vpPos = this.vpUpperLeft.Add(this.right.Scale(this.vpWidth * uScreen));
        vpPos.SubFromSelf(this.up.Scale(this.vpHeight * vScreen));
        let dir = vpPos.Sub(this.pos).Normalize();

        return new Ray(this.pos, dir);
    }
}