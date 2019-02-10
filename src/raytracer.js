class Raytracer
{
    constructor(width, height, samplesPerPixel, numFrames)
    {
        this.width = width;
        this.height = height;
        this.curPixelIdx = 0;
        this.curImageIdx = 0;
        this.numPixels = this.width * this.height;
        this.numFrames = numFrames;
        this.samplesPerPixel = samplesPerPixel;
        this.maxRecursionDepth = 50;

        this.framebuffer = new Framebuffer(this.width, this.height);
        this.images = [];

        this.backgroundColorTop = new Vec3(1.0, 1.0, 1.0);
        this.backgroundColorBottom = new Vec3(0.5, 0.7, 1.0);
        
        this.GenerateRandomScene();
        this.SetCamera();
    }

    GenerateRandomScene()
    {
        this.objects = new Array();

        // 3 big spheres
        this.objects.push(new Sphere(new Vec3(-1.0, 1.0, -2.5), 1.0, new MetalMaterial(new Vec3(0.9, 0.9, 0.9), 0.0)));
        this.objects.push(new Sphere(new Vec3(0.0, 1.0, 0.0), 1.0, new DiffuseMaterial(new Vec3(0.3, 0.5, 0.9))));
        this.objects.push(new Sphere(new Vec3(1.0, 1.0, 2.5), 1.0, new MetalMaterial(new Vec3(0.8, 0.7, 0.2), 0.35)));
        
        // A bunch of small spheres
        for (var x = -20; x < 20; x++)
        {
            for (var z = -20; z < 20; z++)
            {
                if (Math.random() < 0.3)
                {
                    continue;
                }

                let radius = 0.2 + Math.random()*0.2;
                let pos = new Vec3(x + Math.random()*0.9, radius, z + Math.random()*0.9);

                if (this.SphereIntersect(pos, radius))
                {
                    continue;
                }
                
                let rValue = Math.random();
                let randomMat;
                if (rValue < 0.5)
                {
                    randomMat = new DiffuseMaterial(new Vec3(Math.random(), Math.random(), Math.random()));
                }
                else
                {
                    randomMat = new MetalMaterial(new Vec3(Math.random(), Math.random(), Math.random()), Math.random()*Math.random());
                }

                this.objects.push(new Sphere(pos, radius, randomMat));
            }
        }

        // Giant sphere to act as a ground plane
        this.objects.push(new Sphere(new Vec3(0.0, -1000.0, 0.0), 1000.0, new DiffuseMaterial(new Vec3(0.8, 0.8, 0.8))));
    }
    
    RenderNextPixel()
    {
        let x = this.curPixelIdx % this.width;
        let y = Math.floor(this.curPixelIdx / this.width);
        this.RenderPixel(x, y);

        this.curPixelIdx++;
        if (this.curPixelIdx === this.numPixels)
        {
            this.images.push(this.framebuffer.imageData);
            this.framebuffer = new Framebuffer(this.width, this.height);

            this.curPixelIdx = 0;
            this.curImageIdx++;

            this.SetCamera();
        }
    }

    RenderPixel(x, y)
    {
        let colorSum = new Vec3(0, 0, 0);

        for (var s = 0; s < this.samplesPerPixel; s++)
        {
            let uScreen = (x + Math.random()) / this.width;
            let vScreen = (y + Math.random()) / this.height;
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

    SphereIntersect(center, radius)
    {
        // Assume all objects are spheres
        for (var i = 0; i < this.objects.length; i++)
        {
            if (this.objects[i].SphereIntersect(center, radius))
            {
                return true;
            }
        }

        return false;
    }

    GetTotalRenderPct()
    {
        let curTotalPixelIdx = (this.curImageIdx * this.numPixels) + this.curPixelIdx;
        let numTotalPixels = this.numFrames * this.numPixels;
        return curTotalPixelIdx / numTotalPixels;
    }

    IsComplete()
    {
        return this.curImageIdx >= this.numFrames;
    }

    SetCamera()
    {
        let curAngle = (this.curImageIdx / this.numFrames) * 360.0;

        this.camLookAt = new Vec3(0, 0.5, 0);
        this.camPos = new Vec3(Math.cos(curAngle * Math.PI/180.)*4.0, 2.0, Math.sin(curAngle * Math.PI/180.)*-4.0);
        this.camFOV = 90.0;
        this.camAspectRatio = this.width / this.height;
        this.camFocusDist = this.camLookAt.Sub(this.camPos).Length();
        this.camApertureRadius = 0.05;
        this.camera = new Camera(this.camPos, this.camLookAt, this.camFOV, this.camAspectRatio, this.camFocusDist, this.camApertureRadius);
    }

    GetFrameImage(idx)
    {
        return this.images[idx];
    }

    GetNumFrames()
    {
        return this.images.length;
    }
}