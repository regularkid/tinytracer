class Material
{
    constructor(ambient, diffuse, spec, specExponent, reflectionMultiplier)
    {
        this.ambient = ambient || new Vec3(1.0, 0.0, 1.0);
        this.diffuse = diffuse || new Vec3(0.0, 0.0, 0.0);
        this.spec = spec || new Vec3(0.0, 0.0, 0.0);
        this.specExponent = specExponent || 0.0;
        this.reflectionMultiplier = reflectionMultiplier || 0.0;
    }

    Set(mat)
    {
        this.ambient.Set(mat.ambient.x, mat.ambient.y, mat.ambient.z);
        this.diffuse.Set(mat.diffuse.x, mat.diffuse.y, mat.diffuse.z);
        this.spec.Set(mat.spec.x, mat.spec.y, mat.spec.z);
        this.specExponent = mat.specExponent;
        this.reflectionMultiplier = mat.reflectionMultiplier;
    }
}