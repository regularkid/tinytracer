class Vec3
{
    constructor(x, y, z) { this.Set(x, y, z); }
    Set(x, y, z) { this.x = x || 0.0; this.y = y || 0.0; this.z = z || 0.0; }
    Add(v) { this.x += v.x; this.y += v.y; this.z += v.z; }
    Sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; }
    Scale(s) { this.x *= s; this.y *= s; this.z *= s; }
    Dot(v) { return (this.x*v.x + this.y*v.y + this.z*v.z); }
    Invert() { this.x = -this.x; this.y = -this.y; this.z = -this.z; }
    GetCopy() { let v = new Vec3(this.x, this.y, this.z); return v; }

    Normalize()
    {
        let len = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
        this.x /= len; this.y /= len; this.z /= len;
        return len;
    }

    GetReflected(n)
    {
        // https://www.3dkingdoms.com/weekly/weekly.php?a=2
        let projLength2 = 2.0*this.Dot(n);
        let r = new Vec3(n.x*projLength2, n.y*projLength2, n.z*projLength2);
        r.Sub(this);
        return r;
    }
}