package main

// mandelbrot wasm code
func mandelbrot(x0, y0 float64, maxIterations uint32) uint32 {
	var (
		a  float64
		b  float64
		rx float64
		ry float64
		ab float64
	)

	iterations := uint32(0)

	for iterations < maxIterations && rx*rx+ry*ry <= 4 {
		rx = a*a - b*b + x0
		ab = a * b
		ry = ab + ab + y0
		a = rx
		b = ry
		iterations++
	}
	return iterations

}

func main() {

}
