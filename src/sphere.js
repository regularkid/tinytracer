class Sphere
{
    constructor(center, radius, material)
    {
        this.center = center;
        this.radius = radius;
        this.radiusSqr = radius*radius;
        this.material = material;
    }

    Raycast(ray, hitInfo, tMin, tMax)
    {
        // From: https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection

        // Is the projected sphere point farther away than the radius? If so, the ray doesn't intersect
        let rayOriginToCenter = this.center.Sub(ray.origin);
        let rayOriginToProjDist = rayOriginToCenter.Dot(ray.dir);
        let centerToProjDistSqr = rayOriginToCenter.LengthSq() - rayOriginToProjDist*rayOriginToProjDist;
        if (centerToProjDistSqr > this.radiusSqr)
        {
            return false;
        }

        // Calculate intersection point times
        let projToIntersectionDist = Math.sqrt(this.radiusSqr - centerToProjDistSqr);
        let t0 = rayOriginToProjDist - projToIntersectionDist;
        let t1 = rayOriginToProjDist + projToIntersectionDist;

        // Are both intersection points behind the ray origin? If so, the ray doesn't intersect
        if (t0 < 0.0 && t1 < 0.0)
        {
            return false;
        }

        // Get closest intersection time
        if (t0 > t1) { t0 = t1; }

        // Outside our desired time range?
        if (t0 < tMin || t0 > tMax)
        {
            return false;
        }

        // Fill out hit info if one was passed in
        if (hitInfo !== undefined)
        {
            hitInfo.t = t0;
            hitInfo.pos = ray.origin.Add(ray.dir.Scale(t0));
            hitInfo.normal = hitInfo.pos.Sub(this.center);
            hitInfo.normal.NormalizeSelf();
            hitInfo.material = this.material;
        }

        return true;
    }
}