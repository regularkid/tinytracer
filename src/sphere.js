class Sphere
{
    constructor(center, radius, material)
    {
        this.center = center;
        this.radius = radius;
        this.radiusSqr = radius*radius;
        this.material = material;
    }

    Intersects(origin, dir, hitPosition, hitNormal, hitMaterial)
    {
        // From: https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection

        // Is the projected sphere point farther away than the radius? If so, the ray doesn't intersect
        let rayToCenter = new Vec3(this.center.x - origin.x, this.center.y - origin.y, this.center.z - origin.z);
        let rayProjDist = rayToCenter.Dot(dir);
        let distToRayProjSqr = (rayToCenter.x*rayToCenter.x + rayToCenter.y*rayToCenter.y + rayToCenter.z*rayToCenter.z) - rayProjDist*rayProjDist;
        if (distToRayProjSqr > this.radiusSqr)
        {
            return false;
        }

        // Calculate intersection point
        let projToIntersectionDist = rayProjDist - Math.sqrt(this.radiusSqr - distToRayProjSqr);
        if (projToIntersectionDist < 0.0)
        {
            return false;
        }

        if (hitPosition !== undefined && hitNormal !== undefined && hitMaterial !== undefined)
        {
            hitPosition.Set(origin.x + dir.x*projToIntersectionDist, origin.y + dir.y*projToIntersectionDist, origin.z + dir.z*projToIntersectionDist);
            hitNormal.Set(hitPosition.x - this.center.x, hitPosition.y - this.center.y, hitPosition.z - this.center.z);
            hitNormal.Normalize();
            hitMaterial.Set(this.material);
        }

        return true;
    }
}