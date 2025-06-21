export interface TypewriterOptions {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseEnd?: number;
  pauseStart?: number;
}

export class TypewriterAnimation {
  private texts: string[];
  private currentTextIndex = 0;
  private currentCharIndex = 0;
  private isDeleting = false;
  private timeout: NodeJS.Timeout | null = null;
  private element: HTMLInputElement | null = null;
  private options: Required<TypewriterOptions>;

  constructor(element: HTMLInputElement, options: TypewriterOptions) {
    this.element = element;
    this.texts = options.texts;
    this.options = {
      texts: options.texts,
      typeSpeed: options.typeSpeed ?? 100,
      deleteSpeed: options.deleteSpeed ?? 50,
      pauseEnd: options.pauseEnd ?? 2000,
      pauseStart: options.pauseStart ?? 500,
    };
  }

  start(): void {
    if (!this.element) return;
    this.animate();
  }

  stop(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  reset(): void {
    this.currentTextIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.stop();
  }

  restart(): void {
    this.reset();
    this.start();
  }

  private animate(): void {
    if (!this.element) return;

    const currentText = this.texts[this.currentTextIndex];

    if (this.isDeleting) {
      this.element.placeholder = currentText.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
    } else {
      this.element.placeholder = currentText.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
    }

    let speed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;

    if (!this.isDeleting && this.currentCharIndex === currentText.length) {
      speed = this.options.pauseEnd;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
      speed = this.options.pauseStart;
    }

    this.timeout = setTimeout(() => this.animate(), speed);
  }
}