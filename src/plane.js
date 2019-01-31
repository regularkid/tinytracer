class Plane
{
    constructor(axis, pos, size, material)
    {
        this.axis = axis;
        this.pos = pos;
        this.size = size;
        this.min = new Vec3(this.pos.x - this.size*0.5, this.pos.y - this.size*0.5, this.pos.z - this.size*0.5);
        this.max = new Vec3(this.pos.x + this.size*0.5, this.pos.y + this.size*0.5, this.pos.z + this.size*0.5);
        this.material = material;
    }

    Intersects(origin, dir, hitPosition, hitNormal, hitMaterial)
    {
        let toIntersectionDist = 0.0;
        switch (this.axis)
        {
            case "x": toIntersectionDist = (this.pos.x - origin.x) / dir.x; break;
            case "y": toIntersectionDist = (this.pos.y - origin.y) / dir.y; break;
            case "z": toIntersectionDist = (this.pos.z - origin.z) / dir.z; break;
        }

        if (toIntersectionDist <= 0.0)
        {
            return false;
        }

        let intersectionPoint = new Vec3(origin.x + dir.x*toIntersectionDist, origin.y + dir.y*toIntersectionDist, origin.z + dir.z*toIntersectionDist);        
        switch (this.axis)
        {
            case "x":
                if (intersectionPoint.y < this.min.y || intersectionPoint.y > this.max.y ||
                    intersectionPoint.z < this.min.z || intersectionPoint.z > this.max.z)
                {
                    return false;
                }
                break;

            case "y":
                if (intersectionPoint.x < this.min.x || intersectionPoint.x > this.max.x ||
                    intersectionPoint.z < this.min.z || intersectionPoint.z > this.max.z)
                {
                    return false;
                }
                break;

            case "z":
                if (intersectionPoint.x < this.min.x || intersectionPoint.x > this.max.x ||
                    intersectionPoint.y < this.min.y || intersectionPoint.y > this.max.y)
                {
                    return false;
                }
                break;
        }

        if (hitPosition !== undefined)
        {
            hitPosition = intersectionPoint.GetCopy();
        }

        if (hitNormal !== undefined)
        {
            switch (this.axis)
            {
                case "x": hitNormal.Set(1, 0, 0); break;
                case "y": hitNormal.Set(0, 1, 0); break;
                case "z": hitNormal.Set(0, 0, 1); break;
            }
        }

        if (hitMaterial !== undefined)
        {
            hitMaterial.Set(this.material);
        }

        return true;
    }
}