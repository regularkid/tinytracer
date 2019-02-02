class Vec3
{
    constructor(x, y, z) { this.Set(x, y, z); }
    Set(x, y, z) { this.x = x || 0.0; this.y = y || 0.0; this.z = z || 0.0; }
    LengthSq() { return this.x*this.x + this.y*this.y + this.z*this.z; }
    Length() { return Math.sqrt(this.LengthSq()); }
    Dot(v) { return (this.x*v.x + this.y*v.y + this.z*v.z); }
    Cross(v)
    {
        let x = this.y * v.z - this.z * v.y;
        let y = this.z * v.x - this.x * v.z;
        let z = this.x * v.y - this.y * v.x;
        return new Vec3(x, y, z);
    }
    
    // Return a new vector
    Copy() { let v = new Vec3(this.x, this.y, this.z); return v; }
    Add(v) { return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z); }
    Sub(v) { return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z); }
    Scale(s) { return new Vec3(this.x * s, this.y * s, this.z * s); }
    Invert(v) { return new Vec3(-this.x, -this.y, -this.z); }
    Normalize()
    {
        let k = 1.0 / this.Length();
        return new Vec3(this.x * k, this.y * k, this.z * k);
    }
    Reflect(n)
    {
        // https://www.3dkingdoms.com/weekly/weekly.php?a=2
        let projLength2 = 2.0*this.Dot(n);
        let r = new Vec3(n.x*projLength2, n.y*projLength2, n.z*projLength2);
        r.Sub(this);
        return r;
    }

    // Modify this vector
    AddToSelf(v) { this.x += v.x; this.y += v.y; this.z += v.z; }
    SubFromSelf(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; }
    ScaleSelf(s) { this.x *= s; this.y *= s; this.z *= s; }
    InvertSelf() { this.x = -this.x; this.y = -this.y; this.z = -this.z; }
    NormalizeSelf()
    {
        let k = 1.0 / this.Length();
        this.x *= k; this.y *= k; this.z *= k;
        return len;
    }
}