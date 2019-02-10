class Camera
{
    constructor(pos, lookAt, fov, aspectRatio, focusDist, apertureRadius)
    {
        this.SetLookAt(pos, lookAt, fov, aspectRatio, focusDist, apertureRadius);
    }

    SetLookAt(pos, lookAt, fov, aspectRatio, focusDist, apertureRadius)
    {
        this.pos = pos;
        this.lookAt = lookAt;
        this.fov = fov;
        this.aspectRatio = aspectRatio;
        this.focusDist = focusDist;
        this.apertureRadius = apertureRadius;

        // Assume vp distance of 1; half-height = tan(fov/2), height = half-height * 2
        this.vpWidth = Math.tan(fov * 0.5 * (Math.PI / 180.0)) * 2.0 * focusDist;
        this.vpHeight = this.vpWidth / aspectRatio;

        this.forward = this.lookAt.Sub(this.pos).Normalize();
        this.right = this.forward.Cross(new Vec3(0, 1, 0)).Normalize();
        this.up = this.right.Cross(this.forward).Normalize();

        this.vpUpperLeft = this.pos.Add(this.forward.Scale(focusDist));
        this.vpUpperLeft.SubFromSelf(this.right.Scale(this.vpWidth * 0.5));
        this.vpUpperLeft.AddToSelf(this.up.Scale(this.vpHeight * 0.5));
    }

    SetPos(pos)
    {
        this.SetLookAt(pos, this.lookAt, this.fov, this.aspectRatio, this.focusDist, this.apertureRadius);
    }

    GetRay(uScreen, vScreen)
    {
        let rOffset = Vec3.GetRandomDir().Scale(this.apertureRadius);
        let lensPos = this.pos.Copy();
        lensPos.AddToSelf(this.right.Scale(rOffset.x));
        lensPos.AddToSelf(this.up.Scale(rOffset.y));

        let vpPos = this.vpUpperLeft.Add(this.right.Scale(this.vpWidth * uScreen));
        vpPos.SubFromSelf(this.up.Scale(this.vpHeight * vScreen));
        let dir = vpPos.Sub(lensPos).Normalize();

        return new Ray(lensPos, dir);
    }
}