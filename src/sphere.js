class Sphere
{
    constructor(center, radius)
    {
        this.center = center;
        this.radius = radius;
    }

    Intersects(origin, dir, hitPosition, hitNormal)
    {
        // From: https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection &
        // https://github.com/ssloy/tinyraytracer/wiki
        let L = new Vec3(this.center.x, this.center.y, this.center.z);
        L.Sub(origin);
        let tca = L.Dot(dir);
        let d2 = L.Dot(L) - tca*tca;
        if (d2 > this.radius*this.radius) return false;
        let thc = Math.sqrt(this.radius*this.radius - d2);
        let t0 = tca - thc;
        let t1 = tca + thc;
        if (t0 < 0.0) t0 = t1;
        if (t0 < 0.0) return false;

        hitPosition.x = origin.x + dir.x*t0;
        hitPosition.y = origin.y + dir.y*t0;
        hitPosition.z = origin.z + dir.z*t0;

        hitNormal.x = hitPosition.x - this.center.x;
        hitNormal.y = hitPosition.y - this.center.y;
        hitNormal.z = hitPosition.z - this.center.z;
        hitNormal.Normalize();

        return true;
    }
}