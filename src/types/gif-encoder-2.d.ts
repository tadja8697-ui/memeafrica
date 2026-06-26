declare module "gif-encoder-2" {
  import { CanvasRenderingContext2D } from "canvas";
  class GIFEncoder {
    constructor(w: number, h: number, algo?: string, optimize?: boolean, total?: number);
    out: { getData(): Buffer };
    start(): void;
    addFrame(ctx: CanvasRenderingContext2D): void;
    setDelay(ms: number): void;
    setRepeat(n: number): void;
    finish(): void;
  }
  export = GIFEncoder;
}