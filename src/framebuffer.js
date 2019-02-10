class Framebuffer
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        this.imageData = new ImageData(width, height);
    }

    drawPixel(x, y, color)
    {
        this.imageData.data[((y * (this.imageData.width * 4)) + (x * 4)) + 0] = color.x*255.99;
        this.imageData.data[((y * (this.imageData.width * 4)) + (x * 4)) + 1] = color.y*255.99;
        this.imageData.data[((y * (this.imageData.width * 4)) + (x * 4)) + 2] = color.z*255.99;
        this.imageData.data[((y * (this.imageData.width * 4)) + (x * 4)) + 3] = 255;
    }
}