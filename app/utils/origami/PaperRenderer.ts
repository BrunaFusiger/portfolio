import fragmentSource from './paper.frag.glsl?raw'
import { BOAT_CREASES, SHEET_H, SHEET_W, strayCreases } from './creases'
import { PAPER } from './paperSettings'

const MAX_CREASES = 32
const MAX_PIXEL_RATIO = 2
const PHONE_MAX_PIXEL_RATIO = 1.5
const PHONE_MAX_WIDTH = 768
const FULLSCREEN_TRIANGLE = [-1, -1, 3, -1, -1, 3]

const UNIFORM_NAMES = [
  'uRes', 'uSheet', 'uFit', 'uMargin', 'uRotate', 'uSeg', 'uInfo', 'uCount', 'uPaper',
  'uBg', 'uLight', 'uSeed', 'uDepth', 'uSpread', 'uSharp', 'uLine', 'uContrast', 'uWarp',
  'uGrain', 'uFibre', 'uCreases', 'uStrength', 'uDebug',
] as const

type UniformName = (typeof UNIFORM_NAMES)[number]

const vertexSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

function maxPixelRatio() {
  return window.innerWidth < PHONE_MAX_WIDTH ? PHONE_MAX_PIXEL_RATIO : MAX_PIXEL_RATIO
}

export class PaperRenderer {
  private gl: WebGLRenderingContext
  private program: WebGLProgram
  private triangle: WebGLBuffer | null
  private loc = {} as Record<UniformName, WebGLUniformLocation | null>
  private creases = 1

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
    if (!gl) throw new Error('WebGL is not available')
    this.gl = gl

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(s) ?? 'shader error')
      }
      return s
    }
    const vertexShader = compile(gl.VERTEX_SHADER, vertexSource)
    const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource)
    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? 'link error')
    }
    gl.useProgram(program)
    this.program = program

    this.triangle = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.triangle)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(FULLSCREEN_TRIANGLE), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    for (const name of UNIFORM_NAMES) {
      this.loc[name] = gl.getUniformLocation(program, name)
    }
    this.setStaticUniforms()
  }

  private setStaticUniforms() {
    const { gl, loc } = this
    const creases = [...BOAT_CREASES, ...(PAPER.stray ? strayCreases(PAPER.seed) : [])].slice(
      0,
      MAX_CREASES,
    )
    const seg = new Float32Array(MAX_CREASES * 4)
    const info = new Float32Array(MAX_CREASES * 4)
    creases.forEach((c, i) => {
      seg.set([c.a[0], c.a[1], c.b[0], c.b[1]], i * 4)
      info.set([c.kind, c.strength, c.fadeA ? 1 : 0, c.fadeB ? 1 : 0], i * 4)
    })
    gl.uniform4fv(loc.uSeg, seg)
    gl.uniform4fv(loc.uInfo, info)
    gl.uniform1i(loc.uCount, creases.length)

    const az = (PAPER.lightAngle * Math.PI) / 180
    const el = (PAPER.lightElevation * Math.PI) / 180
    gl.uniform3f(loc.uLight, Math.cos(az) * Math.cos(el), Math.sin(az) * Math.cos(el), Math.sin(el))
    gl.uniform2f(loc.uSheet, SHEET_W, SHEET_H)
    gl.uniform3f(loc.uPaper, ...PAPER.colour)
    gl.uniform3f(loc.uBg, ...PAPER.colour)
    gl.uniform1f(loc.uFit, 0)
    gl.uniform1f(loc.uMargin, 0)
    gl.uniform1f(loc.uSeed, PAPER.seed)
    gl.uniform1f(loc.uDepth, PAPER.depth)
    gl.uniform1f(loc.uSpread, PAPER.spread)
    gl.uniform1f(loc.uSharp, PAPER.sharp)
    gl.uniform1f(loc.uLine, PAPER.line)
    gl.uniform1f(loc.uContrast, PAPER.contrast)
    gl.uniform1f(loc.uWarp, PAPER.warp)
    gl.uniform1f(loc.uGrain, PAPER.grain)
    gl.uniform1f(loc.uFibre, PAPER.fibre)
    gl.uniform1f(loc.uStrength, PAPER.strength)
    gl.uniform1f(loc.uDebug, 0)
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, maxPixelRatio())
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr))
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr))
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w
      this.canvas.height = h
    }
    const { gl, loc } = this
    gl.viewport(0, 0, w, h)
    gl.uniform2f(loc.uRes, w, h)
    gl.uniform1f(loc.uRotate, h > w ? 1 : 0)
    this.render()
  }

  setCreases(amount: number) {
    if (amount === this.creases) return
    this.creases = amount
    this.render()
  }

  render() {
    const { gl, loc } = this
    gl.uniform1f(loc.uCreases, this.creases)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  dispose() {
    const { gl } = this
    gl.deleteBuffer(this.triangle)
    gl.deleteProgram(this.program)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
