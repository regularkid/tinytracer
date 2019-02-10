class Raytracer
{
    constructor(ctx, samplesPerPixel)
    {
        this.ctx = ctx;
        this.curPixelIdx = 0;
        this.curImageIdx = 0;
        this.numPixels = ctx.canvas.width * ctx.canvas.height;
        this.numImages = 1;
        this.samplesPerPixel = samplesPerPixel;
        this.maxRecursionDepth = 50;

        this.framebuffer = new Framebuffer(ctx, ctx.canvas.width, ctx.canvas.height);

        this.camPos = new Vec3(0, 2, 3);
        this.camLookAt = new Vec3(0, 0, -1);
        this.camFOV = 90.0;
        this.camAspectRatio = ctx.canvas.width / ctx.canvas.height;
        this.camFocusDist = this.camLookAt.Sub(this.camPos).Length();
        this.camApertureRadius = 0.2;
        this.camera = new Camera(this.camPos, this.camLookAt, this.camFOV, this.camAspectRatio, this.camFocusDist, this.camApertureRadius);

        this.backgroundColorTop = new Vec3(1.0, 1.0, 1.0);
        this.backgroundColorBottom = new Vec3(0.5, 0.7, 1.0);

        this.whiteDiffuse = new DiffuseMaterial(new Vec3(0.8, 0.8, 0.8));
        this.pinkDiffuse = new DiffuseMaterial(new Vec3(0.8, 0.3, 0.3));
        this.metalMat = new MetalMaterial(new Vec3(0.8, 0.8, 0.8), 0.1);
        this.metalDirtyMat = new MetalMaterial(new Vec3(0.8, 0.6, 0.2), 0.5);
        this.greenDiffuse = new DiffuseMaterial(new Vec3(0.3, 0.8, 0.3));
        
        this.objects = new Array();
        this.objects.push(new Sphere(new Vec3(0.0, 0.0, -1.0), 0.5, this.pinkDiffuse));
        this.objects.push(new Sphere(new Vec3(-1.0, 0.0, -1.0), 0.5, this.metalMat));
        this.objects.push(new Sphere(new Vec3(1.0, 0.0, -1.0), 0.5, this.metalDirtyMat));
        this.objects.push(new Sphere(new Vec3(0.0, -100.5, -1.0), 100.0, this.whiteDiffuse));
        this.objects.push(new Sphere(new Vec3(0.0, 0.0, -2.5), 0.5, this.greenDiffuse));
        this.objects.push(new Sphere(new Vec3(0.0, 0.0, 0.5), 0.5, this.greenDiffuse));

        this.images = [];
    }
    
    RenderNextPixel()
    {
        let x = this.curPixelIdx % this.ctx.canvas.width;
        let y = Math.floor(this.curPixelIdx / this.ctx.canvas.width);
        this.RenderPixel(x, y);

        this.curPixelIdx++;
        if (this.curPixelIdx === this.numPixels)
        {
            this.images.push(this.framebuffer.imageData);
            this.framebuffer = new Framebuffer(this.ctx, this.ctx.canvas.width, this.ctx.canvas.height);

            this.curPixelIdx = 0;
            this.curImageIdx++;
        }
    }

    RenderPixel(x, y)
    {
        let colorSum = new Vec3(0, 0, 0);

        for (var s = 0; s < this.samplesPerPixel; s++)
        {
            let uScreen = (x + Math.random()) / this.ctx.canvas.width;
            let vScreen = (y + Math.random()) / this.ctx.canvas.height;
            let ray = this.camera.GetRay(uScreen, vScreen);

            colorSum.AddToSelf(this.GetSceneColor(ray, 0));
        }

        // Average
        colorSum.ScaleSelf(1.0 / this.samplesPerPixel);

        // Gamma correct
        colorSum.Set(Math.sqrt(colorSum.x), Math.sqrt(colorSum.y), Math.sqrt(colorSum.z));

        this.framebuffer.drawPixel(x, y, colorSum);
    }

    GetSceneColor(ray, recursionDepth)
    {
        // If we hit a sphere
        let hitInfo = new HitInfo();
        if (this.Raycast(ray, hitInfo, 0.001, 100.0))
        {
            let bounceDir = new Ray();
            if (recursionDepth < this.maxRecursionDepth && hitInfo.material.GetBounceDir(ray, hitInfo, bounceDir))
            {
                return this.GetSceneColor(bounceDir, recursionDepth + 1).Scale(0.5).Multiply(hitInfo.material.albedo);
            }
            else
            {
                return new Vec3(0, 0, 0);
            }
        }

        // Background gradient from top to bottom
        let t = (ray.dir.y + 1.0) * 0.5;
        return this.backgroundColorTop.Lerp(this.backgroundColorBottom, t);
    }

    Raycast(ray, hitInfo, tMin, tMax)
    {
        let hitInfoCur = new HitInfo();
        let hitInfoClosest = new HitInfo();

        // Find the closest object intersection
        for (var i = 0; i < this.objects.length; i++)
        {
            if (this.objects[i].Raycast(ray, hitInfoCur, tMin, tMax) && (hitInfoClosest.t < 0.0 || hitInfoCur.t < hitInfoClosest.t))
            {
                hitInfoCur.CopyTo(hitInfoClosest);
            }
        }

        // Fill out the hitInfo if the caller cares about it
        if (hitInfo !== undefined)
        {
            hitInfoClosest.CopyTo(hitInfo);
        }

        return hitInfoClosest.t >= 0.0;
    }

    RenderImageToCanvas()
    {
        this.framebuffer.drawToContext(ctx);
    }

    GetTotalRenderPct()
    {
        let curTotalPixelIdx = (this.curImageIdx * this.numPixels) + this.curPixelIdx;
        let numTotalPixels = this.numImages * this.numPixels;
        return curTotalPixelIdx / numTotalPixels;
    }

    IsComplete()
    {
        return this.curImageIdx >= this.numImages;
    }
}