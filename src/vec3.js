class Vec3
{
    constructor(x, y, z) { this.x = x || 0.0; this.y = y || 0.0; this.z = z || 0.0; }
    Add(v) { this.x += v.x; this.y += v.y; this.z += v.z; }
    Sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; }
    Scale(s) { this.x *= s; this.y *= s; this.z *= s; }
    Dot(v) { return (this.x*v.x + this.y*v.y + this.z*v.z); }

    Normalize()
    {
        let len = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
        this.x /= len; this.y /= len; this.z /= len;
        return len;
    }
}